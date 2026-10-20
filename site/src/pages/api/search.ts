import type { APIRoute } from "astro";
import { createFromSource } from "fumadocs-core/search/server";
import { getStructuredData, source } from "@/lib/source";

// Static export: the client downloads the index and searches locally.
const server = createFromSource(source, {
	buildIndex(page) {
		return {
			id: page.data._raw.id,
			title: page.data.title,
			description: page.data.description,
			structuredData: getStructuredData(page.data._raw),
			url: page.url,
		};
	},
});

export const GET: APIRoute = () => server.staticGET();
