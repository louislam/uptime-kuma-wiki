## Supervisión de un sitio web mediante Cloudflare

De forma predeterminada, Cloudflare no es compatible con API, incluido Uptime Kuma. Cloudflare puede bloquear las solicitudes de Uptime Kuma.

Debe deshabilitar "Verificación de integridad del navegador" en Cloudflare Dashboard.

Discusión relacionada: https://community.cloudflare.com/t/api-403-after-enabling-cloudflare/108078/6

## Cómo proxy Uptime Kuma a través de Cloudflare

Por favor, lea:
https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy#cloudflare
