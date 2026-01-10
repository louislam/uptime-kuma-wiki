> [!WARNING]
> `latest` tag is deprecated, which is always pointing to `v1`. Please consider using Recommended Tags.

> [!NOTE]
> If you want to upgrade from `v1` to `v2`, be sure to read the [migration guide](https://github.com/louislam/uptime-kuma/wiki/Migration-From-v1-To-v2) first.

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
| next       | Latest version of Uptime Kuma                    |
| next-slim  | (Slim) Latest version of Uptime Kuma             |

### Rootless Tags

> [!WARNING]
> Rootless images are not recommended for upgrading from v1 to v2, you will likely run into startup issues.

> [!WARNING]
> ⚠️ Rootless images are for users who want to run Uptime Kuma without root privileges, but some features may not work as expected.


| Tag        | Description                                      |
|------------|--------------------------------------------------|
| 2-rootless | Latest version of v2 (Rootless)                  |
| 2-slim-rootless | (Slim) Latest version of v2 (Rootless)          |
| 2.x.x-rootless | Pinned to a specific release (Rootless)         |
| 2.x.x-slim-rootless | (Slim) Pinned to a specific release (Rootless) |

### Unstable Tags

#### Beta Tags

| Tag       | Description                                      |
| --------- | ------------------------------------------------ |
| beta      | The latest of Beta version of Uptime Kuma        |
| beta-slim | (Slim) The latest of Beta version of Uptime Kuma |

#### Other Beta Tags

| Tag               | Description                              |
| ----------------- | ---------------------------------------- |
| 2.x.x-beta.x      | Pinned to a specific beta release        |
| 2.x.x-beta-slim.x | (Slim) Pinned to a specific beta release |

#### Beta Rootless Tags

| Tag                        | Description                                                 |
| -------------------------- | ----------------------------------------------------------- |
| beta-rootless              | The latest of Beta version of Uptime Kuma (Rootless)        |
| beta-slim-rootless         | (Slim) The latest of Beta version of Uptime Kuma (Rootless) |
| 2.x.x-beta-rootless.x      | Pinned to a specific beta release (Rootless)                |
| 2.x.x-beta-slim-rootless.x | (Slim) Pinned to a specific beta release (Rootless)         |

#### Nightly Tags

Only for testing purposes.

| Tag               | Description                |
| ----------------- | -------------------------- |
| nightly2          | Development build (It will be updated daily)       |
| nightly2-rootless | Rootless development build (It will be updated daily) |



## Slim vs Full?

Slim version has a smaller image size, it is about ~300MB to ~400MB smaller than the full version.

| Full Version                                                                                                                | Slim Version                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| ✔️ Embedded MariaDB - Can be used as a low-maintenance, durable and performant storage backend                              | ❌ No embedded MariaDB - but you can still connect to an external MariaDB/MySQL database as storage backend                 |
| ✔️ Embedded Chromium - Can be used for the "Browser Engine" monitor type. Some fonts are also included to improve rendering | ❌ No embedded Chromium - for the "Browser Engine" monitor type, an external chromium instance or further setup is required |

Any big dependencies in the future may be included in the full version only too.

If you don't need the above features, you can use the slim version.

## Rootless vs Non-Rootless?

Rootless tags are for users who wants to run Uptime Kuma without root privileges, but some features may not work as expected.

Known issues:

- ⚠️ Not recommended for upgrading from v1 to v2.
- ⚠️ If file permission is not set correctly, Uptime Kuma will run into startup issues. You should make sure the ownership of the `data` directory is set to the `node:node (1000:1000)` user.
- Docker monitor will not work without proper configuration, as by default it requires root privileges.
- Embedded MariaDB doesn't seem to be working on Docker Desktop (Windows), if the `data` directory is mounted to a Windows folder.
