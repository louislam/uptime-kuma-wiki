Multiple status pages is supported in 1.13.0.

Special slug: `default`

`/status` is pointing to `/status/default`.

## Domain Names for Status Pages
(1.14.0)

Now you can show different status pages based on the domain names.

<img src="https://user-images.githubusercontent.com/1336778/163301604-1d5f8817-ae64-4e79-b6fc-0a517cc8ab81.png" width="300" />

### Steps

1. If you are not using a reverse proxy, you should expose your Uptime Kuma in port 80.
2. If you are using a reverse proxy, add your domain name in your reverse proxy and point to Uptime Kuma.

    (⚠️ PS: For such as Apache or nginx, you need to forward the header `X-Forward-Host` or `Host` to Uptime Kuma, otherwise Uptime Kuma do not know the current domain name)

3. Add a A/CNAME record for your domain name in your DNS management.
4. Add your domain name in your status page settings sidebar.

This is my example, they both are from the same instance:
- https://status.louislam.net
- https://status.kuma.pet