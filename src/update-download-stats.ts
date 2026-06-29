import * as cheerio from "npm:cheerio@~1.2.0";

const today = new Date();
const dateStr = today.toISOString().slice(0, 10);

async function fetchJSON(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

// GitHub stars
const repo = await fetchJSON("https://api.github.com/repos/louislam/uptime-kuma");
const stars: number = repo.stargazers_count;

// Docker Hub pulls
const dockerHub = await fetchJSON("https://hub.docker.com/v2/repositories/louislam/uptime-kuma/");
const dockerPulls: number = dockerHub.pull_count;


// GHCR pulls - scraped from the package page HTML
const ghcrPage = await fetch("https://github.com/louislam/uptime-kuma/pkgs/container/uptime-kuma");
const ghcrHtml = await ghcrPage.text();
const $ = cheerio.load(ghcrHtml);
const title = $('span:contains("Total downloads")').siblings("h3").attr("title");
let ghcrPulls = 0;
if (title) {
  ghcrPulls = parseInt(title, 10);
} else {
  console.error("Warning: could not parse GHCR total downloads from HTML");
}

const fmt = (n: number) => n.toLocaleString("en-US");

const dockerStr = `🐳(docker.io) ${fmt(dockerPulls)}`;
const ghcrStr = `+ (ghcr.io) ${fmt(ghcrPulls)}`;
const total = dockerPulls + ghcrPulls;
const line = `- (${dateStr}) ⭐${fmt(stars)} ${dockerStr} ${ghcrStr} = ${fmt(total)}`;

// Insert into Home.md at top of History list
const text = await Deno.readTextFile("Home.md");
const historyIdx = text.indexOf("## History");
if (historyIdx === -1) {
  console.error("Error: ## History section not found");
  Deno.exit(1);
}

const afterHeading = text.slice(historyIdx);
const firstListItemMatch = afterHeading.search(/\n- /);
if (firstListItemMatch === -1) {
  console.error("Error: No list items found in History section");
  Deno.exit(1);
}

const insertPos = historyIdx + firstListItemMatch + 1;
const newText = text.slice(0, insertPos) + line + "\n" + text.slice(insertPos);

await Deno.writeTextFile("Home.md", newText);
console.log(`Added: ${line}`);
