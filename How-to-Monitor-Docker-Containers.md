## If you are running Uptime Kuma Docker

By default, a docker container is self-contained, which means Uptime Kuma cannot access your host. You need to bind the /var/run/docker.sock to your container.

### (Method 1) Share docker.sock with Uptime Kuma Container

Command argument:
```bash
-v /var/run/docker.sock:/var/run/docker.sock:ro
```

docker-compose:

```yml
volumes:
   - /var/run/docker.sock:/var/run/docker.sock:ro
```

`:ro` (**r**ead**o**nly) is recommended.

### (Method 2) TCP - Bridge Mode

TODO

## Related Disscussion

- https://github.com/louislam/uptime-kuma/issues/2061