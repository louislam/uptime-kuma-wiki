#!/usr/bin/env node
// Root wiki markdown -> site/content/docs (generated). Read-only for the wiki files:
// slugs (emoji stripped), Home.md -> index, meta.json from _Menu.md, images and links rewritten.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BASE } from "../site.config.mjs";

const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = path.resolve(SITE_ROOT, "..");
const CONTENT_DIR = path.join(SITE_ROOT, "content", "docs");
const PUBLIC_DIR = path.join(SITE_ROOT, "public");

/** Wiki nav file parsed for titles and order. */
const NAV_FILE = "_Menu.md";

/** Group for pages _Menu.md does not list. */
const MORE_GROUP = "More";

/** _Menu.md links to these files, which do not exist under that name. */
const PAGE_ALIASES = {
	"README.md": "Home.md",
	"API-Documentation.md": "Internal-API.md",
};

const ROOT_HOME = "Home.md";
const IMAGE_FILES = ["star-history.svg"];

const warnings = [];

function warn(message) {
	warnings.push(message);
}

function read(file) {
	return fs.readFileSync(file, "utf8");
}

/** Recursive delete with a short retry: Dropbox/Defender can hold a handle on Windows (EBUSY). */
function removeDir(target) {
	for (let attempt = 0; ; attempt++) {
		try {
			fs.rmSync(target, { recursive: true, force: true });
			return;
		} catch (error) {
			if (attempt >= 5) throw error;
			Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300 * (attempt + 1));
		}
	}
}

/** Strip emoji and other non-ASCII characters, collapse the leftover dashes. */
function toSlug(fileName) {
	const name = fileName.replace(/\.md$/i, "");
	const slug = name
		.replace(/[^\x20-\x7e]/g, "")
		.replace(/^[\s._-]+|[\s._-]+$/g, "")
		.replace(/[\s_]+/g, "-")
		.replace(/-{2,}/g, "-");
	return slug || "page";
}

function isWikiContent(fileName) {
	return fileName.endsWith(".md") && !fileName.startsWith("_");
}

function escapeFrontmatter(value) {
	return JSON.stringify(value);
}

function truncate(text, max) {
	if (text.length <= max) return text;
	const cut = text.slice(0, max);
	const lastSpace = cut.lastIndexOf(" ");
	return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}\u2026`;
}

function stripInlineMarkdown(text) {
	return text
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/<[^>]+>/g, "")
		.replace(/`([^`]*)`/g, "$1")
		.replace(/(\*\*|__)(.*?)\1/g, "$2")
		.replace(/(\*|_)(.*?)\1/g, "$2")
		.replace(/\s+/g, " ")
		.trim();
}

/** First real paragraph of the body, used as the meta description. */
function extractDescription(body) {
	const lines = body.split("\n").slice(0, 20);
	let inFence = false;
	let paragraph = [];

	const flush = () => {
		const text = stripInlineMarkdown(paragraph.join(" "));
		paragraph = [];
		if (text.length < 40) return "";
		// skip command output like "running on http://localhost:3001"
		if (text.includes("://")) return "";
		return truncate(text, 160);
	};

	for (const raw of lines) {
		const line = raw.trim();
		if (/^(```|~~~)/.test(line)) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;
		if (line === "") {
			const text = flush();
			if (text) return text;
			continue;
		}
		if (
			line.startsWith("#") ||
			line.startsWith(">") ||
			line.startsWith("|") ||
			line.startsWith("- ") ||
			line.startsWith("* ") ||
			line.startsWith("!") ||
			line.startsWith("<") ||
			line.startsWith(":::") ||
			/^\[!/.test(line)
		) {
			const text = flush();
			if (text) return text;
			continue;
		}
		paragraph.push(line);
	}

	return flush();
}

function titleFromFileName(fileName) {
	return fileName
		.replace(/\.md$/i, "")
		.replace(/[^\x20-\x7e]/g, "")
		.replace(/^[\s._-]+|[\s._-]+$/g, "")
		.replace(/[-_]+/g, " ")
		.trim();
}

function decodeLinkTarget(target) {
	try {
		return decodeURIComponent(target);
	} catch {
		return target;
	}
}

// navigation (_Menu.md)

function parseNav(source, pagesByFile) {
	const groups = [];
	const seen = new Set();
	let group = null;

	for (const raw of source.split("\n")) {
		const groupMatch = raw.match(/^\s*-\s+\*\*(.+?)\*\*\s*$/);
		if (groupMatch) {
			group = { title: groupMatch[1].trim(), pages: [] };
			groups.push(group);
			continue;
		}

		const linkMatch = raw.match(/^\s*-\s+\[(.+?)\]\((.+?)\)\s*$/);
		if (!linkMatch) continue;

		const title = linkMatch[1].trim();
		let target = decodeLinkTarget(linkMatch[2].trim()).split("#")[0];
		if (!target || /^[a-z]+:/i.test(target)) continue;

		target = path.basename(target);
		const aliased = PAGE_ALIASES[target] ?? target;
		if (aliased !== target) {
			warn(`${NAV_FILE}: "${target}" does not exist, using ${aliased} (see PAGE_ALIASES)`);
		}

		const page = pagesByFile.get(aliased.toLowerCase());
		if (!page) {
			warn(`${NAV_FILE}: skipping "${target}" (no such page in the repo)`);
			continue;
		}
		if (seen.has(page.file)) continue;

		seen.add(page.file);
		page.title = title;
		if (!group) {
			group = { title: MORE_GROUP, pages: [] };
			groups.push(group);
		}
		group.pages.push(page);
	}

	if (groups.length === 0) warn(`${NAV_FILE}: no groups found, using the ${MORE_GROUP} group only`);

	return groups;
}

// link and image rewriting

function pageUrl(page) {
	return page.isIndex ? BASE : `${BASE}/${page.slug}`;
}

function rewriteImageUrl(url) {
	if (/^(?:[a-z]+:|\/\/)/i.test(url)) return url;
	const cleaned = url.replace(/^\.?\//, "");
	if (cleaned === "star-history.svg") return `${BASE}/star-history.svg`;
	if (cleaned.startsWith("img/")) return `${BASE}/${cleaned}`;
	warn(`image not found in img/ or public/: ${url}`);
	return url;
}

function rewriteLinkUrl(url, ctx) {
	if (/^(?:mailto:|tel:|#)/i.test(url)) return url;
	if (/^\/\//.test(url)) return url;
	if (url.startsWith(`${BASE}/`) || url === BASE) return url;

	// github.com/louislam/uptime-kuma/wiki/<Page>#<anchor>
	const wiki = url.match(
		/^https?:\/\/(?:www\.)?github\.com\/louislam\/uptime-kuma(?:\/wiki(?:\/([^?#]*))?)?\/?(?:[?#](.*))?$/i,
	);
	if (wiki) {
		const pageName = wiki[1] ? decodeLinkTarget(wiki[1]).replace(/\/+$/, "") : "";
		const anchor = wiki[2] ? `#${wiki[2]}` : "";
		if (!pageName) return `${BASE}${anchor}`;
		const page = ctx.bySlug.get(toSlug(pageName).toLowerCase());
		if (!page) {
			warn(`wiki link kept as-is, no such page: ${url}`);
			return url;
		}
		return `${pageUrl(page)}${anchor}`;
	}

	if (/^[a-z]+:\/\//i.test(url)) return url;

	// relative link to another wiki page: ./Foo.md#anchor, Foo.md
	const relative = url.match(/^(?:\.\/)?([^/]+?)\.md(?:#(.*))?$/i);
	if (relative) {
		const page = ctx.byFile.get(`${relative[1].toLowerCase()}.md`);
		if (!page) {
			warn(`link kept as-is, no such page: ${url}`);
			return url;
		}
		const anchor = relative[2] ? `#${relative[2]}` : "";
		return `${pageUrl(page)}${anchor}`;
	}

	return url;
}

const URL_REWRITE = /(!?\[[^\]]*\]\()([^)\s]+)((?:\s+"[^"]*")?\))/g;

function rewriteMarkdown(body, ctx) {
	let inFence = false;
	let fenceMarker = "";

	const rewriteLine = (line) => {
		const fence = line.match(/^\s*(`{3,}|~{3,})/);
		if (fence) {
			if (!inFence) {
				inFence = true;
				fenceMarker = fence[1][0];
			} else if (fence[1][0] === fenceMarker) {
				inFence = false;
			}
			return line;
		}
		if (inFence) return line;

		let out = line.replace(URL_REWRITE, (_match, open, url, close) => {
			const isImage = open.startsWith("!");
			const next = isImage ? rewriteImageUrl(url) : rewriteLinkUrl(url, ctx);
			if (next === url) return `${open}${url}${close}`;
			return `${open}${next}${close}`;
		});

		// bare wiki URLs in running text: point them at the docs site and make them clickable
		out = out.replace(
			/(^|[\s(])(https?:\/\/(?:www\.)?github\.com\/louislam\/uptime-kuma\/wiki(?:\/[^\s)<>`]*)?)/gi,
			(_match, lead, url) => {
				const trailing = url.match(/[.,;:]+$/)?.[0] ?? "";
				const candidate = trailing ? url.slice(0, -trailing.length) : url;
				const next = rewriteLinkUrl(candidate, ctx);
				if (next === candidate) return `${lead}${url}`;
				return `${lead}[${next}](${next})${trailing}`;
			},
		);

		// raw <img src="img/..."> in the markdown (docsify content does this)
		out = out.replace(/<img([^>]*?)src=(["'])([^"']+)\2/gi, (match, before, quote, src) => {
			const next = rewriteImageUrl(src);
			if (next === src) return match;
			return `<img${before}src=${quote}${next}${quote}`;
		});

		return out;
	};

	return body.split("\n").map(rewriteLine).join("\n");
}

// static assets

function copyRecursive(from, to) {
	if (!fs.existsSync(from)) return 0;
	let count = 0;
	const stat = fs.statSync(from);
	if (stat.isDirectory()) {
		fs.mkdirSync(to, { recursive: true });
		for (const entry of fs.readdirSync(from)) {
			count += copyRecursive(path.join(from, entry), path.join(to, entry));
		}
		return count;
	}
	fs.mkdirSync(path.dirname(to), { recursive: true });
	fs.copyFileSync(from, to);
	return 1;
}

// main

function main() {
	// The docs folder and the copied assets are fully generated, start clean.
	const copiedAssets = ["img", ...IMAGE_FILES].filter((name) => fs.existsSync(path.join(PUBLIC_DIR, name)));
	removeDir(CONTENT_DIR);
	for (const name of copiedAssets) removeDir(path.join(PUBLIC_DIR, name));
	fs.mkdirSync(CONTENT_DIR, { recursive: true });

	const files = fs.readdirSync(REPO_ROOT).filter(isWikiContent);
	if (files.length === 0) throw new Error(`no wiki markdown found in ${REPO_ROOT}`);

	const pages = files.map((file) => {
		const isIndex = file === ROOT_HOME;
		const slug = isIndex ? "index" : toSlug(file);
		return {
			file,
			slug,
			isIndex,
			title: titleFromFileName(file),
			group: MORE_GROUP,
		};
	});

	const byFile = new Map(pages.map((page) => [page.file.toLowerCase(), page]));
	const bySlug = new Map(pages.map((page) => [page.slug.toLowerCase(), page]));

	const nav = parseNav(read(path.join(REPO_ROOT, NAV_FILE)), byFile);
	const listed = new Set(nav.flatMap((group) => group.pages.map((page) => page.file)));
	const rest = pages
		.filter((page) => !listed.has(page.file) && !page.isIndex)
		.sort((a, b) => a.title.localeCompare(b.title));

	const groups = nav.map((group) => ({ title: group.title, pages: [...group.pages] })).filter((group) => group.pages.length > 0);
	if (rest.length > 0) {
		const more = groups.find((group) => group.title === MORE_GROUP);
		if (more) more.pages.push(...rest);
		else groups.push({ title: MORE_GROUP, pages: rest });
	}

	const ordered = groups.flatMap((group) => group.pages);
	const missing = pages.filter((page) => !ordered.includes(page));
	if (missing.length > 0) throw new Error(`pages missing from the sidebar: ${missing.map((page) => page.file).join(", ")}`);

	const ctx = { byFile, bySlug };
	const written = [];

	for (const page of pages) {
		const body = rewriteMarkdown(read(path.join(REPO_ROOT, page.file)), ctx);
		const description = extractDescription(body);
		const frontmatter = [
			"---",
			`title: ${escapeFrontmatter(page.title)}`,
			...(description ? [`description: ${escapeFrontmatter(description)}`] : []),
			"---",
			"",
		].join("\n");

		const target = path.join(CONTENT_DIR, `${page.slug}.md`);
		fs.writeFileSync(target, `${frontmatter}${body.trim()}\n`);
		written.push(page);
	}

	const metaPages = [];
	for (const group of groups) {
		metaPages.push(`---${group.title}---`);
		for (const page of group.pages) metaPages.push(page.slug);
	}

	fs.writeFileSync(
		path.join(CONTENT_DIR, "meta.json"),
		`${JSON.stringify({ title: "Docs", pages: metaPages }, null, "\t")}\n`,
	);

	const imageCount = copyRecursive(path.join(REPO_ROOT, "img"), path.join(PUBLIC_DIR, "img"));
	for (const name of IMAGE_FILES) {
		const from = path.join(REPO_ROOT, name);
		if (fs.existsSync(from)) fs.copyFileSync(from, path.join(PUBLIC_DIR, name));
	}

	console.log(
		`content: ${written.length} pages, ${groups.length} sidebar groups, ${imageCount} images -> ${path.relative(REPO_ROOT, CONTENT_DIR)}`,
	);
	for (const group of groups) {
		console.log(`  ${group.title}: ${group.pages.map((page) => page.slug).join(", ")}`);
	}
	for (const message of warnings) console.warn(`  warning: ${message}`);
	if (warnings.length > 0) console.log(`content: ${warnings.length} warning(s) above`);
}

main();
