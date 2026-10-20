import { createGetUrl } from "fumadocs-core/source";
import { BASE } from "@/lib/base";

export const docsImageRoute = `${BASE}/og/docs`;

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
	const segments = [...page.slugs, "image.webp"];

	return { segments, url: getImageUrl(segments, page.locale) };
}
