> [!WARNING]
> It is a major version update. It contains some breaking changes. Please read the migration guide carefully if you want to upgrade from v1 to v2.


> [!NOTE]
> # Before You Start
> 
> Stop your Uptime Kuma and:
> - Backup your `data` directory.
> - Make sure you have a backup of your `data` directory again.
> - Make sure you have a backup of your `data` directory again and again.
>
> The migration process could take some time to complete, depending on the size of your database.
> This is because we need to aggregate the heartbeat table into the new, more optimised format.
>
> - You should be able to view logs of the migration process in the console.
> - Do NOT interrupt the migration process. *If the migration process is interrupted, you must restore from backup and retry the upgrade.*
> - FYI: My Uptime Kuma had 20 monitors and 90 days of data, and it took around 7 minutes to migrate.
>   *On slower hardware or with more monitors, this can take hours.*

## Breaking Changes

- The `:duration` of these badge endpoints now accept values `24`, `24h`, `30d`, `1y` only
  - `<kuma-url>/api/badge/:monitorID/ping/:duration`
  - `<kuma-url>/api/badge/:monitorID/uptime/:duration`
- Dropped support for legacy browsers
- Removed deprecated feature [Backup/Restore from JSON](https://github.com/louislam/uptime-kuma/pull/3892). Backing up the `data` directory is currently the only supported backup method.
- Removed deprecated feature [DNS Cache for HTTP monitors](https://github.com/louislam/uptime-kuma/issues/3762). Consider using the bundled `nscd` for docker installation.
- Updated default retries for **NEWLY** created monitors from `1` to `0` to prevent user confusion
- Switched `Email (SMTP)` notification subject/body templating from a custom-regex to [LiquidJS](https://liquidjs.com/). In LiquidJS,
  - variables are now **case-sensitive**, and
  - **all non-matching variables are ignored**.
  - These are the supported variables: `name`, `msg`, `status`, `heartbeatJSON`, `monitorJSON`, `hostnameOrUrl`. We don't have documentation for these yet, but you can refer to the [source code](https://github.com/louislam/uptime-kuma/blob/master/server/model/monitor.js) for the data structure.

### Docker only Breaking Changes

- Dropped support for Alpine based docker images (But you still can migrate to v2)
- If your host is using Debian / Raspbian Buster, you should not upgrade. Due to a bug in the libseccomp2 library, it will run into a startup problem. Read more: https://github.com/louislam/uptime-kuma/issues/41#issuecomment-896164516

### Non Docker Breaking Changes

- Dropped support for Node.js 14, 16 and 18. The minimum supported version of Node.js is 20.4.

## Docker Tags

See https://github.com/louislam/uptime-kuma/wiki/Docker-Tags

## Migration Steps (Docker)

1. Stop your Uptime Kuma container.

```bash
docker stop uptime-kuma
```

2. Backup your `data` directory.
3. Change the image tag to `louislam/uptime-kuma:2`.

```bash
docker run -d --restart=unless-stopped -p <YOUR_PORT>:3001 -v <YOUR_DIR OR VOLUME>:/app/data --name uptime-kuma louislam/uptime-kuma:2
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

3. Change the image tag to `louislam/uptime-kuma:2`.

```yaml
services:
    uptime-kuma:
        image: louislam/uptime-kuma:2
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


1. Stop your Uptime Kuma.

```bash
pm2 stop uptime-kuma
```

2. Backup your `data` directory.
3. Check your Node.js version, Node.js >= 20.4 is required.

```bash
node --version
```

4. Follow https://github.com/louislam/uptime-kuma/wiki/%F0%9F%86%99-How-to-Update#--non-docker to update

## FAQ

### Can I migrate my existing SQLite database to MariaDB?

 Cannot be done directly and is not supported by us.
You will need to export your data from SQLite and import it into MariaDB using 3rd party tools such as [sqlite3tomysql](https://github.com/harshavmb/sqlite3tomysql).

> [!IMPORTANT]
> We don't have the capacity to deal with issues that come from such migrations.
> If you run into any issues afterwards, please reproduce that your issue is caused by us and not the migration you did using a fresh installation first.
