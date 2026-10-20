// @ts-check
import os from "node:os";
import path from "node:path";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { rehypeCode, remarkHeading } from "fumadocs-core/mdx-plugins";
import { rehypeCallouts, rehypeTableScroll } from "./src/lib/rehype-wiki.mjs";
import { BASE, SITE_URL } from "./site.config.mjs";

// Plain .md only, so just plugins that emit hast: heading ids, code highlighting, wiki fixes.
const remarkPlugins = [remarkHeading];
const rehypePlugins = [rehypeCode, rehypeCallouts, rehypeTableScroll];

export default defineConfig({
	site: SITE_URL,
	base: BASE,
	trailingSlash: "ignore",
	markdown: {
		processor: unified({
			syntaxHighlight: false,
			remarkPlugins,
			rehypePlugins,
		}),
	},
	integrations: [react(), sitemap()],
	// Navigation renders on click and waits for the HTML round trip; prefetch on hover.
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "hover",
	},
	vite: {
		plugins: [tailwindcss()],
		// Windows + Dropbox: EBUSY on node_modules/.vite, so build with a temp cache.
		cacheDir:
			process.platform === "win32" && process.env.NODE_ENV === "production"
				? path.join(os.tmpdir(), "uptime-kuma-docs-vite")
				: undefined,
	},
});
