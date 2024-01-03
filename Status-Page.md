
## Things You Should Know

- Status page is intended for public users to check the status of your services
- Status page will cache results for 5 minutes
- Status page is just like a traditional web page. Updates won't be as responsive as the dashboard.
- Status page will refresh the page every 5 minutes
- `default` is a special slug
- `http://example.com/status` is pointing to `http://example.com/status/default`

## Multiple Status Pages
(Version >= 1.13.0)

## Domain Names for Status Pages
(Version >= 1.14.0)

Now you can show different status pages based on the domain names.

<img src="https://user-images.githubusercontent.com/1336778/163301604-1d5f8817-ae64-4e79-b6fc-0a517cc8ab81.png" width="300" />

### Steps

1. If you are not using a reverse proxy, you should expose your Uptime Kuma in port 80.
2. If you are using a reverse proxy, add your domain name in your reverse proxy and point to Uptime Kuma.

    (⚠️ PS: For such as Apache or nginx, you need to forward the header `X-Forwarded-Host` or `Host` to Uptime Kuma, otherwise Uptime Kuma do not know the current domain name)

3. Add a A/CNAME record for your domain name in your DNS management.
4. Add your domain name in your status page settings sidebar.

This is my example, they both are from the same instance:
- https://status.louislam.net
- https://status.kuma.pet

## Custom Subdirectory / custom html on status pages

> [!CAUTION]
> For the following to work the [environment variable `UPTIME_KUMA_DISABLE_FRAME_SAMEORIGIN=true`](https://github.com/louislam/uptime-kuma/wiki/Environment-Variables) needs to be set.
> This allows other pages to include Uptime Kuma as an `iframe` and makes you vulnerable to [`clickjacking`](https://en.wikipedia.org/wiki/Clickjacking). 

Changing the subdirectory of Uptime Kuma is tracked in https://github.com/louislam/uptime-kuma/pull/1092
Embedding `script`s/`meta`-tags/... into Uptime Kuma is tracked in https://github.com/louislam/uptime-kuma/issues/3115

A solution to get around this limitation is to utilise an `iframe`.
Here is an example of how to configure this (replacing `INSERT_{...}_HERE` with your own values):

```html
<html data-lt-installed="true"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
  	<meta name="description" content="INSERT_DESCRIPTION_HERE">
    <title>INSERT_TITLE_HERE</title>
</head>
<body style="height: 100vh;margin: 0;padding: 0;overflow: hidden;">
    <iframe src="INSERT_UPTIME_KUMA_URL_HERE" frameborder="0" width="100%" height="100%" allowtransparency="yes" style="overflow:hidden;margin: 0; border: none;"></iframe>
</body>
</html>
```
