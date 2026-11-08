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

# nginx serves the static output; the entrypoint keeps it fresh from GitHub.
FROM node:26-trixie-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx git rsync ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && rm -f /etc/nginx/sites-enabled/default

WORKDIR /app

# Reuse node_modules from the build stage so an update only reruns astro build.
COPY --from=build /repo/site ./site
COPY --from=build /repo/site/deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/site/deploy/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p /srv/www \
    && cp -a site/dist/. /srv/www/

ENV REPO_URL=https://github.com/louislam/uptime-kuma-wiki.git \
    BRANCH=master \
    INTERVAL=1800

EXPOSE 80
CMD ["/usr/local/bin/entrypoint.sh"]
