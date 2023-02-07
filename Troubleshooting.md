
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
