## Monitor reports `DOWN` with HTTP `429`

`429` is rate limiting rather than bot protection, and it is frequently applied per route, because rendering a full page costs the origin much more than serving a small file. Changing the User-Agent, switching to the Real Browser monitor type or lowering the check interval often does not help, because the limit may be shared with other customers of your hosting provider.

To find out, request two different paths and compare:

```bash
curl -o /dev/null -w '%{http_code}\n' https://example.com/
curl -o /dev/null -w '%{http_code}\n' https://example.com/robots.txt
```

If one path returns `200` while the other returns `429`, only the route differs, so your client is not blocked. Point the monitor at a lighter endpoint that is still served by the application rather than from a cache, and that is not disallowed in the site's `robots.txt`. If you administer the monitored site yourself, a dedicated health endpoint excluded from rate limiting is the better fix.

The response body usually identifies the limiter and is worth reading:

```bash
curl -i https://example.com/
```

> [!TIP]
> Since 2.1.0, enabling **Save error response** on the monitor retains the body of a failed check and makes it available to notification templates.

> [!CAUTION]
> Adding `429` to **Accepted Status Codes** hides the alert instead of fixing it. The monitor will then report `UP` during a real outage that returns `429`.

## Uptime Kuma reports `DOWN`, but the service can be accessed

> [!TIP]
> In case you did not know: docker has [more than one network type](https://youtu.be/bKFMS5C4CG0) with only some of them allowing access to the local network and some not even allowing access to remote networks

If your Uptime Kuma reports `DOWN` of your service, knowing if it is a bug of Uptime Kuma / a docker network misconfiguration or a firewall is a good start to fixing the issue.

To debug this, go into your container's bash via

```bash
docker exec -it uptime-kuma bash
```

Install `curl`

```bash
apt update && apt --yes install curl
```

Then you can debug this issue with commands like `ping`, `curl`, ... Examples:

```bash
curl https://google.com
ping google.com
```

### IPv6

If you are running Uptime Kuma on top of Docker and the service can only be access via IPv6. Please follow the Docker's [official wiki](https://docs.docker.com/config/daemon/ipv6/) to enable IPv6 support.\
IPv6 are not supported out of the box on Docker.

For docker compose, this is as simple as adding a network with IPv6 enabled to your compose file. Upating the template from the project would look like this:

```diff
  services:
    uptime-kuma:
      image: louislam/uptime-kuma:2
      volumes:
        - ./data:/app/data
      ports:
        # <Host Port>:<Container Port>
        - 3001:3001
      restart: unless-stopped
+     networks:
+       - uptime-kuma-net
+ networks:
+   uptime-kuma-net:
+     enable_ipv6: true
```

The network is created at the bottom, with `enable_ipv6: true` and then added to the service. 