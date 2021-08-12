## Monitoring a website using Cloudflare

By default, Cloudflare is not API friendly including Uptime Kuma. Cloudflare may blocks requests from Uptime Kuma.

You need to disable "Browser Integrity Check" in Cloudflare Dashboard.

Related discussion: https://community.cloudflare.com/t/api-403-after-enabling-cloudflare/108078/6


## Proxy via Cloudflare

Please read:
https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy#cloudflare