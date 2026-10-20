# Uptime Kuma docs site

Static documentation site for Uptime Kuma, built from the wiki markdown at the repository
root. Served at <https://uptime.kuma.pet/docs>.

- Astro 7 + Fumadocs (`fumadocs-ui` on Base UI), fully static, `base: '/docs'`.
- The wiki markdown at the repo root stays the source of truth. The site never edits it, and
  the two-way GitHub wiki sync (`push-to-wiki` / `sync-upstream`) keeps working.

## Commands

```bash
cd site
npm install
npm run dev      # http://localhost:4321/docs
npm run build    # content pipeline + astro build + link check -> dist/
npm run preview  # serve dist/ at http://localhost:4321/docs
```

`npm run build` fails on a broken internal link, so a content change that breaks navigation
cannot be deployed.

## How the content gets in

`scripts/build-content.mjs` reads the repo root and writes `content/docs/` (gitignored):

| Step | What it does |
| --- | --- |
| Slugs | `🔧-How-to-Install.md` -> `How-to-Install.md`, emoji stripped, `Home.md` -> `index.md` |
| Titles + order | Parsed from `_Menu.md`, filename as the fallback title |
| Sidebar | `content/docs/meta.json`, one `---Group---` separator per `_Menu.md` group |
| Frontmatter | `title`, plus a `description` taken from the page's first paragraph |
| Images | `img/` and `star-history.svg` copied to `public/`, references rewritten to `/docs/...` |
| Links | `Foo.md#bar` and `github.com/louislam/uptime-kuma/wiki/Foo` -> `/docs/Foo#bar` |
| Alerts | `> [!WARNING]` etc. become styled callouts in `src/lib/rehype-wiki.mjs` |

Pages that `_Menu.md` does not list end up in a `More` group. `README.md` and
`API-Documentation.md` are aliased to `Home.md` and `Internal-API.md` because those are the
filenames that actually exist (see `PAGE_ALIASES`).

Nothing in the pipeline writes outside `site/content/docs`, `site/public/img`,
`site/public/star-history.svg` and `site/dist`.

## Base path

Everything assumes `/docs`:

- `astro.config.mjs` -> `base`
- `src/lib/base.ts` -> Fumadocs `baseUrl`, image URLs, the search endpoint
- `site.config.mjs` -> `BASE`, used by the pipeline and the link checker

Cloudflare Tunnel path routes do not strip the path, so the site must serve under `/docs`
itself. nginx (`deploy/nginx.conf`) strips the prefix again for the static tree.

Fumadocs' search dialog defaults to `/api/search` (host root), so it is passed
`/docs/api/search` explicitly in `src/components/search.tsx`.

## Layout

```
site/
├── scripts/build-content.mjs   wiki markdown -> content/docs + public/
├── scripts/check-links.mjs     internal link + anchor check (runs after build)
├── content/docs/               generated, gitignored
├── src/pages/[...slug].astro   one page per wiki page
├── src/pages/api/search.ts     static search index (dist/api/search)
├── src/pages/og/docs/...       generated OG cards
├── src/components/docs.tsx     Fumadocs layout, nav, links
├── src/styles/global.css       Uptime Kuma palette, callouts, tables
├── public/icon.svg             Uptime Kuma logo
└── deploy/nginx.conf           nginx config baked into the image by ../Dockerfile
```

## Theming

Colours come from Uptime Kuma itself
([`src/assets/vars.scss`](https://github.com/louislam/uptime-kuma/blob/master/src/assets/vars.scss)):
`#5cdd8b` primary, `#f8a306` warning, `#dc3545` danger, `#0d1117` dark background,
`#1d2634` dark border. Light mode uses a darker green for text contrast.
