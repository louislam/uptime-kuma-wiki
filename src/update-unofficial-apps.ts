import obj from "./unofficial-apps.json" with { type: "json" };

let output = `A list of 3rd party addons or applications, plugins or related side projects.

Feel free to add your project here by making a pull request in [this wiki's repo](https://github.com/louislam/uptime-kuma-wiki). You should add your project to \`./src/unofficial-apps.json\`.

`

if (new Date(obj.lastUpdate).getTime() < new Date().getTime() - 7 * 24 * 60 * 60 * 1000) {
    console.log("Updating unofficial apps data...");

    // Update github star count
    for (const item of obj.apps) {
        if (item.githubRepo) {
            console.log(`Fetching data for ${item.githubRepo}...`);
            const url = item.githubRepo.replace("https://github.com/", "https://api.github.com/repos/");
            try {
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    item.githubStars = data.stargazers_count;
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
// | [Name](GitHub Repo) | Description | GitHub Stars |
const header = `| Name | Description | GitHub Stars |\n| --- | --- | --- |\n`;

// Markdown table rows
const rows = obj.apps.map(item => {
    const name = item.githubRepo ? `[${item.name}](${item.githubRepo})` : item.name;
    const description = item.description || "";
    const stars = (item.githubRepo) ? item.githubStars || 0 : "N/A";
    return `| ${name} | ${description} | ${stars} |`;
}).join("\n");

output += header + rows;

const encoder = new TextEncoder();
const data = encoder.encode(output);
Deno.writeFileSync("./3rd-Party-Addons-Apps.md", data);
