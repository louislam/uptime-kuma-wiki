## Monitoring a website using Cloudflare

By default, Cloudflare is not API friendly including Uptime Kuma. Cloudflare may block requests from Uptime Kuma.

You need to disable or bypass "Browser Integrity Check" in Cloudflare Dashboard via one of these methods:

- (Easiest) Add your Uptime Kuma host IP address to [IP Access rules](https://developers.cloudflare.com/waf/tools/ip-access-rules/) as an Allowed address, optionally across every domain in your Cloudflare account
- Allow Uptime Kuma to [bypass the check via WAF Custom Rules](https://developers.cloudflare.com/waf/custom-rules/skip/), and special header. E.g. lets add to the Kuma request header (please replace `kuma-qwerty123456` with your own random value):
  ```json
  {
      "kumaping": "kuma-qwerty123456"
  }
  ```
  Now create a rule where you will bypass JS challenge if header is presented. You can also add multiple domains after `or` E.g.
  ```
  (http.host eq "domain1" and all(http.request.headers["kumaping"][*] ne "kuma-qwerty123456")) or (http.host eq "domain2" and all(http.request.headers["kumaping"][*] ne "qwerty123456"))
  ```
  and at the end of the rule JS challenge. Now challenge will be only triggered if `kumaping` header is not presented or it has a wrong value.
- Use a [Configuration Rule](https://developers.cloudflare.com/rules/configuration-rules/) to disable the check for your Uptime Kuma IP address

Related discussion: https://community.cloudflare.com/t/api-403-after-enabling-cloudflare/108078/6

## How to proxy Uptime Kuma via Cloudflare

Please read: https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy#cloudflare
