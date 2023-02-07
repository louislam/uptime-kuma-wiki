
## Uptime Kuma reports DOWN, but I can access.

If your Uptime Kuma reports DOWN of your service, sometimes you would like to know it is a bug of Uptime Kuma or your own Docker network issue.

Go into your container's bash.

```bash
docker exec -it uptime-kuma bash
```

Install `curl`

```bash
apt update && apt --yes install curl
```

Then you can test with these commands for example:
```bash
curl https://google.com
ping google.com
```

If running a ping results in a DNS-related error, try configuring your container to run using the host's network. To do this, run the `docker run` command with the `--network="host"` flag. For example:

```
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma --network="host" louislam/uptime-kuma:1
```

More information here: https://docs.docker.com/engine/reference/run/#network-host
