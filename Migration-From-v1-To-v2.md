# Migration from v1 to v2

## Before You Start

- Stop your Uptime Kuma and:
   - Backup your `data` directory.
   - Make sure you have a backup of your `data` directory again.
   - Make sure you have a backup of your `data` directory again again.
- The migration process could take some time to complete, depending on the size of your database.
   - You should be able to view the logs of the migration process in the console.
   - Do not interrupt the migration process.
   - FYI: My Uptime Kuma had 20 monitors and 90 days of data, and it took around 7 minutes to migrate.
- Beta version is not stable and may contain bugs, especially for the first beta release.


## Breaking Changes

- The `:duration` of these endpoints accepts `24`, `24h`, `30d`, `1y` only
  - <kuma-url>/api/badge/:monitorID/ping/:duration
  - <kuma-url>/api/badge/:monitorID/uptime/:duration
- Dropped support for legacy browsers
- The deprecated backup feature is completely removed now

### Docker only
- Dropped support for Alpine base docker image (But you still can migrate to the v2)
- If your host are using Debian / Raspbian Buster, you should not upgrade. Due to the bug of libseccomp2, it will be running into a startup problem.

### Non Docker
- Dropped support for Node.js 14 and 16. The minimum supported version of Node.js is 18. Node.js 20 is recommended.

## Docker Tags

### Recommended Tags

| Tag        | Description                                      |
|------------|--------------------------------------------------|
| 2          | Latest version of v2 (Recommended)               |
| 2-slim     | (Slim) Latest version of v2                      |

### Other Tags

| Tag        | Description                                      |
|------------|--------------------------------------------------|
| 2.x.x      | Version pinned to a specific release             |
| 2.x.x-slim | (Slim) Latest version of v2 pinned to a specific release |
| next       | Lastest version of Uptime Kuma                   |
| next-slim  | (Slim) Latest version of Uptime Kuma             |

### Rootless Tags

⚠️ Rootless tags are for users who want to run Uptime Kuma without root privileges, but some features may not work as expected.

| Tag        | Description                                      |
|------------|--------------------------------------------------|
| 2-rootless | Latest version of v2 (Rootless)                  |
| 2-slim-rootless | (Slim) Latest version of v2 (Rootless)          |
| 2.x.x-rootless | Pinned to a specific release (Rootless)         |
| 2.x.x-slim-rootless | (Slim) Pinned to a specific release (Rootless) |


### Unstable Tags

| Tag               | Description                               |
|-------------------|-------------------------------------------|
| beta              | The latest of Beta version of Uptime Kuma |
| 2.x.x-beta.x | Pinned to a specific beta release         |
| nightly2          | Development build                         |
| nightly2-rootless | Rootless development build                |

## Slim vs Full?

Slim version is a smaller image size, it is about ~300MB to ~400MB smaller than the full version.

Full version includes:
- Embedded MariaDB
- Embedded Chromium
- Embedded some fonts for Chromium
- Any big dependencies in the future may be included in the full version only too

If you don't need the above features, you can use the slim version.

## Rootless vs Non-Rootless?

Rootless tags are for users who want to run Uptime Kuma without root privileges, but some features may not work as expected.

Known issues:
#- nscd cannot be started, which means DNS caching will not work. nscd is important for Uptime Kuma, as it will reduce the amount of DNS queries and lookup time.
- Docker monitor will not work without proper configure, as by default, it requires root privileges.
- If file permission is not set correctly, it may cause some issues.
- Unable to use embedded MariaDB, you will need to use external MariaDB.

## Migration Steps (Docker)

1. Stop your Uptime Kuma container.

```bash
docker stop uptime-kuma
```

2. Backup your `data` directory.
3. Change the image tag to `louislam/uptime-kuma:2-beta`.

```bash
docker run -d --restart=unless-stopped -p <YOUR_PORT>:3001 -v <YOUR_DIR OR VOLUME>:/app/data --name uptime-kuma louislam/uptime-kuma:2-beta
```

4. Check the logs to see the migration process.

```bash
docker logs -f uptime-kuma
```

## Migration Steps (Docker Compose)

1. Stop your Uptime Kuma stack.

```bash
docker compose down
```

2. Backup your `data` directory.

3. Change the image tag to `louislam/uptime-kuma:2-beta`.

```yaml
services:
  uptime-kuma:
    image: louislam/uptime-kuma:2-beta
    ....
```

4. Start your Uptime Kuma stack.

```bash
docker compose up -d
```

5. Check the logs to see the migration process.

```bash
docker compose logs -f
```

## Migration Steps (Non-Docker)

TODO

## FAQ

### Can I migrate my existing SQLite database to MariaDB?

Cannot be done directly. You will need to export your data from SQLite and import it into MariaDB using 3rd party tools.
