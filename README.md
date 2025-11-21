# Uptime Kuma Wiki

This repository contains the documentation wiki for [Uptime Kuma](https://github.com/louislam/uptime-kuma).

## Automatic Sync

This repository automatically syncs with the upstream GitHub wiki at https://github.com/louislam/uptime-kuma.wiki.git every hour via GitHub Actions.

The sync workflow:
- Runs automatically every hour
- Can be manually triggered from the Actions tab
- Fetches and merges changes from the upstream wiki
- Automatically pushes merged changes

If you need to manually trigger the sync, go to the [Actions](../../actions/workflows/sync-upstream.yml) tab and click "Run workflow".

## Contributing

You can contribute to this wiki by making pull requests to this repository. See [Home.md](Home.md) for more information.
