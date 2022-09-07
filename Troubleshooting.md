
## Uptime Kuma reports DOWN, but I can access.

If your Uptime Kuma reports DOWN of your service, sometimes you would like to know it is a bug of Uptime Kuma or your own Docker network issue.

Go into your container's bash.

```
docker exec -it uptime-kuma bash
```

Then you can test with these commands for example:
```
curl https://google.com
ping google.com
```
