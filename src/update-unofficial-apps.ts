import obj from "./unofficial-apps.json" with { type: "json" };

let output = `A list of 3rd party addons or applications, plugins or related side projects.

Feel free to add your project here by making a pull request in [this wiki's repo](https://github.com/louislam/uptime-kuma-wiki). You should add your project to \`./src/unofficial-apps.json\`.

`

if (new Date(obj.lastUpdate).getTime() < new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
    console.log("Updating unofficial apps data...");

    const githubToken = Deno.env.get("GITHUB_TOKEN");
    const headers: HeadersInit = {};
    if (!githubToken) {
        throw new Error("GITHUB_TOKEN environment variable is not set.");
    }

    headers["Authorization"] = `token ${githubToken}`;

    // Update github star count
    for (const item of obj.apps) {
        if (item.githubRepo) {
            console.log(`Fetching data for ${item.githubRepo}...`);
            const url = item.githubRepo.replace("https://github.com/", "https://api.github.com/repos/");
            try {
                const response = await fetch(url, {
                    headers,
                });
                if (response.ok) {
                    const data = await response.json();
                    item.githubStars = data.stargazers_count;
                    item.lastUpdate = data.pushed_at ? data.pushed_at.slice(0, 10) : "N/A";
                } else {
                    console.error(`Failed to fetch data for ${item.githubRepo}: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error fetching data for ${item.githubRepo}: ${error}`);
            }
        }
    }

    obj.apps.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    obj.lastUpdate = new Date().toISOString();

    // Store JSON
    Deno.writeTextFileSync("./src/unofficial-apps.json", JSON.stringify(obj, null, 4));
} else {
    console.log("Don't need to update unofficial apps data, last update was less than 7 days ago.");
}

// Sort by github stars, and then by name
obj.apps.sort((a, b) => {
    if (b.githubStars !== a.githubStars) {
        return b.githubStars - a.githubStars;
    }
    return a.name.localeCompare(b.name);
});

// Markdown table header
// | [Name](GitHub Repo) | Description | GitHub Stars | Last Update |
const header = `| Name | Description | GitHub Stars | Last Update |\n| --- | --- | --- | --- |\n`;

// Markdown table rows
const rows = obj.apps.map(item => {
    const url = item.githubRepo ? item.githubRepo : item.url;
    const name =`[${item.name}](${url})`;
    const description = item.description || "";
    const stars = (item.githubRepo) ? item.githubStars || 0 : "N/A";
    const lastUpdate = (item.githubRepo) ? item.lastUpdate || "N/A" : "N/A";
    return `| ${name} | ${description} | ${stars} | ${lastUpdate} |`;
}).join("\n");

output += header + rows;

const encoder = new TextEncoder();
const data = encoder.encode(output);
Deno.writeFileSync("./3rd-Party-Addons-Apps.md", data);
