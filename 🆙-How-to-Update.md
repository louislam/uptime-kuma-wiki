## 🆙🐳 Docker

Re-pull the latest docker image and create another container with the same volume.

For someone who used my "How-to-use" commands to install Uptime Kuma, you can update by this:

```bash
docker pull louislam/uptime-kuma:1
docker stop uptime-kuma
docker rm uptime-kuma
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

PS: For every new release, it takes some time to build the docker image, please be patient if it is not available yet.

## 🆙 💪🏻 Non-Docker

```bash
cd <uptime-kuma-directory>

# Update from git
git fetch --all
git checkout 1.11.4 --force

# Install dependenies and prebuilt
npm ci --production
npm run download-dist

# Restart
pm2 restart uptime-kuma
```
