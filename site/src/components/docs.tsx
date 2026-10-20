import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsPage, type DocsPageProps } from "fumadocs-ui/layouts/docs/page";
import type { Root } from "fumadocs-core/page-tree";
import type { ReactNode } from "react";
import { navigate } from "astro:transitions/client";
import { RootProvider } from "fumadocs-ui/provider/astro";
import type { AstroProviderProps } from "fumadocs-core/framework/astro";
import { BASE } from "@/lib/base";
import SearchDialog from "./search";

function GitHubIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-2.1c-3.2.7-3.88-1.4-3.88-1.4-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.24 2.76.12 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
		</svg>
	);
}

export function Docs({
	tree,
	children,
	pathname,
	params,
	page,
}: {
	tree: Root;
	children: ReactNode;
	pathname: string;
	params: AstroProviderProps["params"];
	page?: DocsPageProps;
}) {
	return (
		<RootProvider pathname={pathname} params={params} navigate={navigate} search={{ SearchDialog }}>
			<DocsLayout
				tree={tree}
				nav={{
					url: `${BASE}/`,
					title: (
						<span className="uk-brand">
							<img src={`${BASE}/icon.svg`} alt="" width={28} height={28} />
							<span className="uk-brand-name">Uptime Kuma</span>
							<span className="uk-brand-sub">Docs</span>
						</span>
					),
				}}
				links={[
					{
						type: "main",
						text: "Website",
						url: "https://uptime.kuma.pet",
						external: true,
					},
					{
						type: "main",
						text: "GitHub",
						url: "https://github.com/louislam/uptime-kuma",
						external: true,
						icon: <GitHubIcon />,
					},
				]}
			>
				<DocsPage {...page}>{children}</DocsPage>
			</DocsLayout>
		</RootProvider>
	);
}
