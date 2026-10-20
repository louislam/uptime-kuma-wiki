import type { APIRoute } from "astro";
import { generateOGImage } from "fumadocs-ui/og/takumi";
import { KumaLogo } from "@/components/kuma-logo";
import { source } from "@/lib/source";

export function getStaticPaths() {
	return source.getPages().map((page) => ({
		params: {
			slug: page.slugs.length > 0 ? page.slugs.join("/") : undefined,
		},
	}));
}

export const GET: APIRoute = ({ params }) => {
	const slugs = params.slug?.split("/").filter((item) => item.length > 0) ?? [];
	const page = source.getPage(slugs);

	if (!page) return new Response(undefined, { status: 404 });

	return generateOGImage({
		title: page.data.title,
		description: page.data.description,
		icon: KumaLogo({ size: 64 }),
		site: "Uptime Kuma Docs",
		primaryColor: "#5cdd8b",
		primaryTextColor: "#5cdd8b",
		format: "webp",
	});
};
