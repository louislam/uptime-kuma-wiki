> [!WARNING]
> **`3.0.0-beta.0` is a beta release.**
>
> Do not upgrade production yet. Test on a copy.
>
> Report bugs at https://github.com/louislam/uptime-kuma/issues.
>
> This guide may change before the final 3.0.0 release.

> [!WARNING]
> This is a major version update. It has breaking changes. Read this guide first.

> [!NOTE]
>
> # Before You Start
>
> Stop Uptime Kuma first.
>
> - Back up the whole `data` directory. Include `kuma.db` and `db-config.json`.
> - Test that the backup restores.
> - Keep another copy.
>
> v3 upgrades the database in place. There is no downgrade path. The backup is the only way back.

## Breaking Changes

- Prometheus: `/metrics` is disabled by default. Enable it in **Settings** → **General** → **Prometheus API**.
- (Docker) 32-bit ARM images are gone. Only `linux/amd64` and `linux/arm64` are published.
- (Non-Docker) Node.js 26.2.0 or newer is required.
- (Non-Docker) Start with `node --run start`. Plain `node server/server.js` no longer works.
- (Non-Docker) PM2 users should use `pm2 start` instead of `pm2 start server/server.js`.

## Docker Tags

v3 has its own beta tags. They are separate from the v2 tags.

| Tag                  | Description                              |
| -------------------- | ---------------------------------------- |
| `beta`               | Latest v3 beta (recommended for testing) |
| `3.0.0-beta.0`       | Pinned to this beta release              |
| `beta-slim`          | (Slim) Latest v3 beta                    |
| `beta-rootless`      | Latest v3 beta (Rootless)                |
| `beta-slim-rootless` | (Slim) Latest v3 beta (Rootless)         |

## Migration Steps (Docker)

1. Stop the container.

```bash
docker stop uptime-kuma
```

2. Back up the `data` directory.
3. Change the image tag to `louislam/uptime-kuma:beta`.

```bash
docker run -d --restart=unless-stopped -p <YOUR_PORT>:3001 -v <YOUR_DIR OR VOLUME>:/app/data --name uptime-kuma louislam/uptime-kuma:beta
```

4. Watch the logs.

```bash
docker logs -f uptime-kuma
```

5. Open the web UI and log in.

## Migration Steps (Docker Compose)

1. Stop the stack.

```bash
docker compose down
```

2. Back up the `data` directory.
3. Change the image tag to `louislam/uptime-kuma:beta`.

```yaml
services:
    uptime-kuma:
        image: louislam/uptime-kuma:beta
....
```

4. Start the stack.

```bash
docker compose up -d
```

5. Watch the logs.

```bash
docker compose logs -f
```

6. Open the web UI and log in.

## Migration Steps (Non-Docker)

1. Stop Uptime Kuma.

```bash
pm2 stop uptime-kuma
```

2. Back up the `data` directory.
3. Check Node.js. Version 26.2.0 or newer is required.

```bash
node --version
```

4. Update the source to the beta tag.

```bash
git fetch --all --tags
git checkout 3.0.0-beta.0 --force
```

5. Install dependencies and the prebuilt frontend.

```bash
npm install --omit dev --no-audit
npm run download-dist
```

6. Restart with `node --run start`.

7. (Optional) PM2 users: remove the existing process first.

```bash
pm2 delete uptime-kuma
```

The old `pm2 start server/server.js` no longer works. Start it with this:

```bash
pm2 start
pm2 save
```

8. Open the web UI and log in.

## FAQ

### Can I upgrade directly from v1 to v3?

Yes. The v1 to v2 and v2 to v3 migrations both run.

Back up the `data` directory first.

### Can I downgrade to v2?

No. The database is upgraded in place. Restore the backup you made before upgrading. Then run the v2 image.

### Which Docker tag should I use?

Use `louislam/uptime-kuma:beta` during the beta. Or pin `louislam/uptime-kuma:3.0.0-beta.0`.

### Why did my armv7 device stop working?

v3 does not publish `linux/arm/v7` images. Stay on v2, or move to a 64-bit OS.
