# Build the docs site from the wiki markdown at the repo root.
FROM node:26-trixie-slim AS build

WORKDIR /repo

COPY site/package.json site/package-lock.json ./site/
RUN cd site && npm ci --no-audit --no-fund

COPY *.md ./
COPY img ./img
COPY star-history.svg ./
COPY site ./site

RUN cd site && npm run build

# Serve the static output; nginx.conf strips the /docs prefix.
FROM nginx:stable-trixie

COPY site/deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/site/dist /srv/www

EXPOSE 80
