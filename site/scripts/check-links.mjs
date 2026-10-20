import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BASE } from "../site.config.mjs";

const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(SITE_ROOT, "content", "docs");
const DIST_DIR = path.join(SITE_ROOT, "dist");
const contentOnly = process.argv.includes("--content-only");

// Anchors already broken in the wiki (a <details> summary, not a heading).
const KNOWN_BROKEN = new Set([`${BASE}/Reverse-Proxy#cloudflare`]);

function walk(dir) {
	if (!fs.existsSync(dir)) return [];
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		return entry.isDirectory() ? walk(full) : [full];
	});
}

/** "" for the index, "/Foo" for a page, null when the URL leaves the docs base. */
function stripBase(url) {
	if (url === BASE || url === `${BASE}/`) return "";
	if (url.startsWith(`${BASE}/`)) return url.slice(BASE.length);
	return null;
}

function readAnchors(html) {
	const ids = new Set();
	for (const match of html.matchAll(/\sid=["']([^"']+)["']/g)) ids.add(match[1]);
	for (const match of html.matchAll(/<a[^>]*\sname=["']([^"']+)["']/g)) ids.add(match[1]);
	return ids;
}

function distTargetFor(cleanPath) {
	const trimmed = cleanPath.replace(/\/+$/, "").replace(/^\//, "");
	const candidates = [
		path.join(DIST_DIR, trimmed, "index.html"),
		path.join(DIST_DIR, trimmed),
		path.join(DIST_DIR, `${trimmed}.html`),
	];
	return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

function main() {
	if (!contentOnly && !fs.existsSync(DIST_DIR)) {
		throw new Error("dist/ not found, run `npm run build` first (or pass --content-only)");
	}

	const files = contentOnly
		? fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith(".md")).map((file) => path.join(CONTENT_DIR, file))
		: walk(DIST_DIR).filter((file) => file.endsWith(".html"));

	const problems = [];
	const known = [];
	const checked = new Set();
	let checkedLinks = 0;

	for (const file of files) {
		const html = fs.readFileSync(file, "utf8");
		const label = contentOnly
			? path.relative(CONTENT_DIR, file)
			: path.relative(DIST_DIR, file).replace(/\\/g, "/");

		const urls = contentOnly
			? [...html.matchAll(/\]\(([^)\s]+)\)/g), ...html.matchAll(/<img[^>]*\bsrc=["']([^"']+)["']/g)].map((m) => m[1])
			: [...html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)].map((m) => m[1]);

		for (const raw of urls) {
			const url = raw.trim().replace(/&amp;/g, "&");
			// Only absolute links matter: everything the pipeline emits is absolute.
			if (!url.startsWith("/") || url.startsWith("//")) continue;
			if (url.startsWith(`${BASE}/_astro/`)) continue;

			checkedLinks++;
			const key = `${label} -> ${url}`;
			if (checked.has(key)) continue;
			checked.add(key);

			const clean = stripBase(url.split("#")[0].split("?")[0]);
			if (clean === null) {
				problems.push(`${label} -> ${url} (points outside ${BASE})`);
				continue;
			}

			if (contentOnly) continue;

			const anchor = url.includes("#") ? url.split("#")[1] : "";
			const target = distTargetFor(clean);
			if (!target) {
				problems.push(`${label} -> ${url} (nothing built at this path)`);
				continue;
			}
			if (anchor && target.endsWith(".html")) {
				if (!readAnchors(fs.readFileSync(target, "utf8")).has(anchor)) {
					const message = `${label} -> ${url} (missing anchor)`;
					if (KNOWN_BROKEN.has(`${BASE}${clean}#${anchor}`)) known.push(message);
					else problems.push(message);
				}
			}
		}
	}

	for (const message of known) console.warn(`  known-broken (upstream): ${message}`);
	if (problems.length > 0) {
		for (const message of problems) console.error(`  broken: ${message}`);
		throw new Error(`${problems.length} broken internal link(s)`);
	}

	console.log(
		`links: ${checkedLinks} checked in ${files.length} ${contentOnly ? "generated pages" : "built pages"}${known.length > 0 ? `, ${known.length} known-broken upstream` : ""}`,
	);
}

main();
