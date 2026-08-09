import { JSDOM } from "jsdom";
import { optimize } from "svgo";
import XYChart from "./star-history/xy-chart.ts";
import { convertDataToChartData, getRepoData } from "./star-history/chart.ts";
import type { ChartMode } from "./star-history/chart-types.ts";

const token = Deno.env.get("STAR_HISTORY_GITHUB_TOKEN") || Deno.env.get("GITHUB_TOKEN");
if (!token) {
    console.warn("Warning: STAR_HISTORY_GITHUB_TOKEN is not set. GitHub now requires a token for the stargazers API.");
    console.warn("Create a token at https://github.com/settings/tokens and run: deno task gen-star-history");
}

const MAX_REQUEST_AMOUNT = 16;

// Extra repos can be passed as CLI args, e.g. deno task gen-star-history louislam/uptime-kuma louislam/uptime-kuma-api
const repos = Deno.args.length > 0 ? Deno.args : ["louislam/uptime-kuma"];
const type: ChartMode = "Date";

/**
 * JSDOM lowercases camelCase SVG attribute names and element names.
 * Fix the known ones used by D3 filter generation (addFilter.ts).
 */
const fixJsdomSvgCasing = (svgContent: string): string => {
    return svgContent
        // Element names
        .replace(/feturbulence/g, "feTurbulence")
        .replace(/fedisplacementmap/g, "feDisplacementMap")
        // Attributes
        .replace(/filterunits/g, "filterUnits")
        .replace(/basefrequency/g, "baseFrequency")
        .replace(/xchannelselector/g, "xChannelSelector")
        .replace(/ychannelselector/g, "yChannelSelector");
};

async function getBase64Image(url: string): Promise<string> {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) {
        return "";
    }
    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (const b of bytes) {
        binary += String.fromCharCode(b);
    }
    const contentType = res.headers.get("content-type");
    return `data:${contentType};base64,${btoa(binary)}`;
}

let repoData;
try {
    repoData = await getRepoData(repos, token, MAX_REQUEST_AMOUNT);
} catch (error: any) {
    if (error?.status === 401 && !token) {
        console.error("Error: GitHub API now requires authentication for the stargazers endpoint.");
        console.error("Create a personal access token at https://github.com/settings/tokens");
        console.error("Then add STAR_HISTORY_GITHUB_TOKEN=xxx to the .env file and run: deno task gen-star-history");
    } else if (error?.status === 403 && String(error?.response?.data).includes("Resource not accessible")) {
        console.error("Error: GitHub token has no access to the repo's stargazers.");
        console.error("Since July 2026, GitHub restricts the stargazers endpoint to repo admins and collaborators.");
        console.error("Fix: use a classic PAT with the 'public_repo' scope, or a fine-grained PAT with repository access (Metadata: read) to the repos you chart.");
    } else {
        console.error(`Error: ${error?.message || error}`);
    }
    Deno.exit(1);
}

// Fetch all logos in parallel
await Promise.all(
    repoData.map(async (d) => {
        d.logoUrl = await getBase64Image(`${d.logoUrl}&size=22`);
    }),
);

const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
const body = dom.window.document.querySelector("body");
const svg = dom.window.document.createElement("svg") as unknown as SVGSVGElement;

if (!dom || !body || !svg) {
    console.error("Failed to mock dom with JSDOM");
    Deno.exit(1);
}

const width = 800; // "laptop" size

body.append(svg);
svg.setAttribute("width", `${width}`);
svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

XYChart(
    svg,
    {
        title: "Star History",
        xLabel: "Date",
        yLabel: "GitHub Stars",
        data: convertDataToChartData(repoData, type),
        showDots: false,
        transparent: false,
        theme: "light",
    },
    {
        xTickLabelType: "Date",
        chartWidth: width,
        useLogScale: false,
        legendPosition: "top-left",
    },
);

const svgContent = fixJsdomSvgCasing(svg.outerHTML);
const optimized = optimize(svgContent, { multipass: true }).data;

await Deno.writeTextFile("star-history.svg", optimized);
console.log(`Generated star-history.svg (${(optimized.length / 1024).toFixed(1)} KB)`);
console.log(`Repos: ${repos.join(", ")}`);
