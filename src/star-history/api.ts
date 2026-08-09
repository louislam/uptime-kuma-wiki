import { getDateString, range } from "./utils.ts";

const API_PER_PAGE = 100; // GitHub API max items per request
const REQUEST_TIMEOUT_MS = 15000; // 15s timeout for GitHub API calls

const GITHUB_API = "https://api.github.com";

// GitHub intermittently returns 500 on the stargazers endpoint during the
// access-restriction rollout (July 2026). Retry 5xx responses a few times.
const MAX_RETRIES = 3;

async function githubFetch(path: string, token?: string): Promise<Response> {
    let res: Response | undefined;
    for (let attempt = 1;; attempt++) {
        res = await fetch(`${GITHUB_API}${path}`, {
            headers: {
                Accept: "application/vnd.github.v3.star+json",
                Authorization: token ? `token ${token}` : "",
                "User-Agent": "uptime-kuma-wiki",
            },
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (res.ok || res.status < 500 || attempt > MAX_RETRIES) {
            break;
        }

        console.warn(`GitHub API returned ${res.status} for ${path}, retrying (${attempt}/${MAX_RETRIES})...`);
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }

    if (!res.ok) {
        let message = "";
        try {
            const body = await res.json();
            message = body?.message || "";
        } catch {
            // ignore JSON parse errors
        }

        throw {
            response: { status: res.status, data: message },
            status: res.status,
            message,
        };
    }

    return res;
}

export async function getRepoStargazers(repo: string, token?: string, page?: number) {
    let path = `/repos/${repo}/stargazers?per_page=${API_PER_PAGE}`;

    if (page !== undefined) {
        path = `${path}&page=${page}`;
    }
    const res = await githubFetch(path, token);

    return {
        data: await res.json(),
        headers: { link: res.headers.get("link") || "" },
    };
}

export async function getRepoStargazersCount(repo: string, token?: string) {
    const res = await githubFetch(`/repos/${repo}`, token);
    const data = await res.json();

    return data.stargazers_count;
}

export async function getRepoStarRecords(repo: string, token: string, maxRequestAmount: number) {
    const patchRes = await getRepoStargazers(repo, token);

    const headerLink = patchRes.headers["link"] || "";

    let pageCount = 1;
    const regResult = /next.*&page=(\d*).*last/.exec(headerLink);

    if (regResult) {
        if (regResult[1] && Number.isInteger(Number(regResult[1]))) {
            pageCount = Number(regResult[1]);
        }
    }

    if (pageCount === 1 && patchRes?.data?.length === 0) {
        throw {
            status: 200,
            data: [],
        };
    }

    const requestPages: number[] = [];
    if (pageCount < maxRequestAmount) {
        requestPages.push(...range(1, pageCount));
    } else {
        range(1, maxRequestAmount).map((i) => {
            requestPages.push(Math.round((i * pageCount) / maxRequestAmount) - 1);
        });
        if (!requestPages.includes(1)) {
            requestPages[0] = 1;
        }
    }

    const resArray = await Promise.all(
        requestPages.map((page) => {
            return getRepoStargazers(repo, token, page);
        }),
    );

    const starRecordsMap: Map<string, number> = new Map();

    if (requestPages.length < maxRequestAmount) {
        const starRecordsData: { starred_at: string }[] = [];
        resArray.map((res) => {
            const { data } = res;
            starRecordsData.push(...data);
        });
        for (let i = 0; i < starRecordsData.length;) {
            starRecordsMap.set(getDateString(starRecordsData[i].starred_at), i + 1);
            i += Math.floor(starRecordsData.length / maxRequestAmount) || 1;
        }
    } else {
        resArray.map(({ data }, index) => {
            if (data.length > 0) {
                const starRecord = data[0];
                // Calculate actual star position based on API page size and position in page
                const pageStartPosition = API_PER_PAGE * (requestPages[index] - 1);
                starRecordsMap.set(getDateString(starRecord.starred_at), pageStartPosition);
            }
        });
    }

    const starAmount = await getRepoStargazersCount(repo, token);
    starRecordsMap.set(getDateString(Date.now()), starAmount);

    const starRecords: { date: string; count: number }[] = [];

    starRecordsMap.forEach((v, k) => {
        starRecords.push({
            date: k,
            count: v,
        });
    });

    return starRecords;
}

export async function getRepoLogoUrl(repo: string, token?: string): Promise<string> {
    const owner = repo.split("/")[0];
    const res = await githubFetch(`/users/${owner}`, token);
    const data = await res.json();

    return data.avatar_url;
}
