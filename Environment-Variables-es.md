## Variables de entorno del servidor

| | de variables de entorno | de argumentos del servidor Descripción |    | predeterminada
| ------------------------------------------ | -------------------------- | --------------------------------------------------------------------- | ---------: |
| `DATA_DIR`                                 | `data-dir`                 | Establezca el directorio donde se deben almacenar los datos (podrían ser relativos) |  `./data/` |
| `UPTIME_KUMA_HOST` o `HOST`               | `host`                     | Host al que enlazar, podría ser una ip.                                      |       `::` |
| `UPTIME_KUMA_PORT` o `PORT`               | `port`                     | Puerto para escuchar |     `3001` |
| `UPTIME_KUMA_SSL_KEY` o `SSL_KEY`         | `ssl-key`                  | Ruta de acceso a la | de clave SSL            |
| `UPTIME_KUMA_SSL_CERT` o `SSL_CERT`       | `ssl-cert`                 | Ruta de acceso al | del certificado SSL            |
| `UPTIME_KUMA_CLOUDFLARED_TOKEN`        | `cloudflared-token`                 | Cloudflare Tunnel Token (disponible en 1.14.0) |            |
| `NODE_EXTRA_CA_CERTS`        |                  | Agregue sus certificados de ca autofirmados. (por ejemplo, /cert/path/CAcert.pem) [Leer más](https://github.com/louislam/uptime-kuma/issues/1380)                                            |            |
| `NODE_TLS_REJECT_UNAUTHORIZED`        |                  | Ignore todos los errores de TLS |    `0`        |

## Variables de entorno específicas de Docker

| | de variables de entorno Descripción | | predeterminada
| -------------------- | ----------------------------------- | ------: |
| `PUID`               | ID de usuario para acceder al | de almacenamiento de datos  `1000` |
| `PGID`               | Identificador de grupo para acceder al | de almacenamiento de datos  `1000` |

## Solo para desarrollo

| | de variables de entorno | de argumentos del servidor Descripción |    | predeterminada
| ------------------------------------------ | -------------------------- | --------------------------------------------------------------------- | ---------: |
| `NODE_ENV`                                 |                            | Establecer el indicador de entorno de NodeJS | | de producción
| `UPTIME_KUMA_DISABLE_FRAME_SAMEORIGIN`     | `disable-frame-sameorigin` | Evitar que un IFrame abra kuma desde otros hosts |    `false` |
| `UPTIME_KUMA_LOG_RESPONSE_BODY_MONITOR_ID` |                            | ID del monitor: si se proporciona, generará la respuesta del monitor a la consola |            |
| `UPTIME_KUMA_HIDE_LOG` |                            | (1.15.0) Ejemplos: debug_monitor,info_monitor,debug_cert,warn_monitor |            |
| `SQL_LOG` | | Poner `1` para habilitar | | |
