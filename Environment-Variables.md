# Server environment variables

| Environment variable                       | Server argument            | Description                                                           |    Default |
| ------------------------------------------ | -------------------------- | --------------------------------------------------------------------- | ---------: |
| `NODE_ENV`                                 |                            | Set the NodeJS environment flag                                       | production |
| `DATA_DIR`                                 | `data-dir`                 | Set the directory where the data should be stored (could be relative) |  `./data/` |
| `UPTIME_KUMA_HOST` or `HOST`               | `host`                     | Host to bind to, could be an ip.                                      |       `::` |
| `UPTIME_KUMA_PORT` or `PORT`               | `port`                     | Port to listen to                                                     |     `3001` |
| `UPTIME_KUMA_SSL_KEY` or `SSL_KEY`         | `ssl-key`                  | Path to SSL key                                                       |            |
| `UPTIME_KUMA_SSL_CERT` or `SSL_CERT`       | `ssl-cert`                 | Path to SSL certificate                                               |            |
| `UPTIME_KUMA_DISABLE_FRAME_SAMEORIGIN`     | `disable-frame-sameorigin` | Prevent kuma from being opened by an IFrame from other hosts          |    `false` |
| `UPTIME_KUMA_LOG_RESPONSE_BODY_MONITOR_ID` |                            | Log beat event to STDOUT ("1" to enable)                              |            |

# Docker specific environment variables

| Environment variable | Description                         | Default |
| -------------------- | ----------------------------------- | ------: |
| `PUID`               | User id to access the data storage  |  `1000` |
| `GUID`               | Group id to access the data storage |  `1000` |
