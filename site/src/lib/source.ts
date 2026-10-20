import type { StaticSource } from "fumadocs-core/source";
import { loader } from "fumadocs-core/source";
import { type CollectionEntry, getCollection } from "astro:content";
import * as path from "node:path";
import { structure, type StructuredData } from "fumadocs-core/mdx-plugins";
import { BASE } from "@/lib/base";

export const source = loader({
	source: await createWikiSource(),
	baseUrl: BASE,
});

export function getStructuredData(entry: CollectionEntry<"docs">): StructuredData {
	// drop GitHub alert markers and quote prefixes from the search text
	const body = (entry.body ?? "")
		.replace(/^>\s*\[!(?:NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*$/gim, "")
		.replace(/^>\s?/gm, "");

	return structure(body);
}

async function createWikiSource() {
	const out: StaticSource<{
		metaData: CollectionEntry<"meta">["data"];
		pageData: CollectionEntry<"docs">["data"] & {
			_raw: CollectionEntry<"docs">;
		};
	}> = {
		files: [],
	};

	for (const page of await getCollection("docs")) {
		out.files.push({
			type: "page",
			path: path.relative("content/docs", page.filePath!),
			data: {
				...page.data,
				_raw: page,
			},
		});
	}

	for (const meta of await getCollection("meta")) {
		out.files.push({
			type: "meta",
			path: path.relative("content/docs", meta.filePath!),
			data: meta.data,
		});
	}

	return out;
}
