# Deploying the docs site

`git push kuma-pet master` deploys. The deploy server checks this repo out at
`/opt/stacks/uptime-kuma-wiki` and runs `docker compose up -d --build` there, so:

- `Dockerfile` (repo root) builds the site and bakes `dist/` into an nginx image.
- `compose.yaml` (repo root) runs it as the `docs` service (container
  `uptime-kuma-wiki-docs-1`), joined to the `uptime-kuma-website_default` network where
  `cloudflared` lives.
- `site/deploy/nginx.conf` is copied into the image and serves the tree under `/docs`.

A push therefore rebuilds the image (~1-2 min) and recreates the container: a couple of
seconds where nginx is not answering.

```bash
git push kuma-pet master
```

## Cloudflare

The docs share `uptime.kuma.pet` with the website, so the tunnel needs a path route:

- path `^/docs(/|$)` -> `http://uptime-kuma-docs:80`
- it must sit **before** the catch-all `uptime.kuma.pet` -> `http://website:80` rule

Until that route exists, `/docs` still reaches the website, and `server.ts` there still
redirects it to the GitHub wiki.

## Checking a deploy

```bash
ssh -p 2022 root@100.64.138.65 "docker ps --format '{{.Names}}\t{{.Status}}'"
ssh -p 2022 root@100.64.138.65 \
  "docker compose -f /opt/stacks/uptime-kuma-wiki/compose.yaml logs --tail 50"
curl -sI https://uptime.kuma.pet/docs/ | head -1
```

## Rolling back

Redeploy the previous commit:

```bash
git revert --no-edit <sha> && git push kuma-pet master
# or, to ship an exact older tree:
git push --force kuma-pet <sha>:master
```

## Local check without deploying

```bash
cd site && npm run build   # content pipeline + astro build + link check
npm run preview            # http://localhost:4321/docs
```
