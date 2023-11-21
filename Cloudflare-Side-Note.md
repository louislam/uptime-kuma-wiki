## Monitoring a website using Cloudflare

By default, Cloudflare is not API friendly including Uptime Kuma. Cloudflare may block requests from Uptime Kuma.

You need to disable or bypass "Browser Integrity Check" in Cloudflare Dashboard.

At least three methods exist to bypass the Browser Integrity Check:
-(Easiest) Add your Uptime Kuma host IP address to IP Access rules as an Allowed address, optionally across every domain in your Cloudflare account: https://developers.cloudflare.com/waf/tools/ip-access-rules/
-Allow Uptime Kuma to bypass the check via WAF Custom Rules, only applies to one domain at a time: https://developers.cloudflare.com/waf/custom-rules/skip/
-Use a Configuration Rule to disable the check for your Uptime Kuma IP address: https://developers.cloudflare.com/rules/configuration-rules/

Related discussion: https://community.cloudflare.com/t/api-403-after-enabling-cloudflare/108078/6


## How to proxy Uptime Kuma via Cloudflare

Please read:
https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy#cloudflare
