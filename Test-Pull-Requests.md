Now you can test pull requests without setting up any development environment.

You just need to use this docker image with specified pr repo name.

(2025-06-23) New shorten command:

```bash
npx kuma-pr <PR REPO, YOU CAN COPY>
# Example: npx kuma-pr Ionys320:fix/maintenance_drift
```

If you don't have Node.js (`npx`) installed, you can use the following command to run the docker container directly.

```bash
docker run --rm -it -p 3000:3000 -p 3001:3001 --pull always -e 'UPTIME_KUMA_GH_REPO=<PR REPO, YOU CAN COPY>' louislam/uptime-kuma:pr-test2
```

Example: UPTIME_KUMA_GH_REPO=`chakflying:fix/beat-schedule-delay`

You can copy the name from here easily:

<img src="https://user-images.githubusercontent.com/1336778/189304667-f0dbce41-95d1-4828-a0e4-e210859a160c.png" width=500 />

Add `-v uptime-kuma-pr-test:/app/data` if you need a persistent storage.

After started, go to http://localhost:3000 (⚠️ not port 3001)

The last message in the console will be `Open xxx:3001 in your browser`. I know it is confusing, but please use port 3000 instead. It is because the vite dev server is running on port 3000.

### Slow during `npm install`?

Sometimes if the test image is too old, `npm install` will be slow because it is trying to update those dependencies.

Update the image might help:

```bash
docker pull louislam/uptime-kuma:pr-test2
```

### Test v1.X PRs

```bash
docker run --rm -it -p 3000:3000 -p 3001:3001 --pull always -e 'UPTIME_KUMA_GH_REPO=<PR REPO, YOU CAN COPY>' louislam/uptime-kuma:pr-test
```
