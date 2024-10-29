Now you can test pull requests without setting up any development environment.

You just need to use this docker image with specified pr repo name:

v2.x.x

```bash
docker run --rm -it -p 3000:3000 -p 3001:3001 --pull always -e 'UPTIME_KUMA_GH_REPO=<PR REPO, YOU CAN COPY>' louislam/uptime-kuma:pr-test2
```

v1.23.x
```bash
docker run --rm -it -p 3000:3000 -p 3001:3001 --pull always -e 'UPTIME_KUMA_GH_REPO=<PR REPO, YOU CAN COPY>' louislam/uptime-kuma:pr-test
```

Example:
UPTIME_KUMA_GH_REPO=`chakflying:fix/beat-schedule-delay`

You can copy the name from here easily:

<img src="https://user-images.githubusercontent.com/1336778/189304667-f0dbce41-95d1-4828-a0e4-e210859a160c.png" width=500 />



Add `-v uptime-kuma-pr-test:/app/data` if you need a persistent storage.


After started, go to http://localhost:3000