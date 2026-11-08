#!/bin/sh
# Serve the baked build, then rebuild from GitHub when the wiki markdown moves.
set -eu

REPO_URL="${REPO_URL:-https://github.com/louislam/uptime-kuma-wiki.git}"
BRANCH="${BRANCH:-master}"
INTERVAL="${INTERVAL:-1800}"

cd /app

git init -q
git config user.name "docs-bot"
git config user.email "docs-bot@localhost"
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

rebuild() {
    git fetch -q --depth 1 origin "$BRANCH" || { echo "fetch failed"; return 1; }

    target=$(git rev-parse FETCH_HEAD)
    if [ "$target" = "$(cat .built 2>/dev/null)" ]; then
        return 0
    fi

    echo "updating docs to $target"
    lock_before=$(cksum site/package-lock.json)
    git reset -q --hard FETCH_HEAD

    if [ "$lock_before" != "$(cksum site/package-lock.json)" ]; then
        echo "dependencies changed, running npm ci"
        npm --prefix site ci --no-audit --no-fund --prefer-offline || return 1
    fi

    npm --prefix site run build || return 1

    rsync -a --delete site/dist/ /srv/www/
    echo "$target" > .built
    echo "docs updated to $target"
}

# nginx serves the baked copy from the image until the first rebuild finishes.
(
    while true; do
        rebuild || echo "keeping the current site, retrying in ${INTERVAL}s"
        sleep "$INTERVAL"
    done
) &

exec nginx -g "daemon off;"
