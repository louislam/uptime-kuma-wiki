## 🆙🐳 Docker

Re-pull the latest docker image and create another container with the same volume.

For someone who used my "How-to-use" commands to install Uptime Kuma, you can update by this:

```bash
docker pull louislam/uptime-kuma:1
docker stop uptime-kuma
docker rm uptime-kuma

# Default
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1

# If you are not using default value
# docker run -d --restart=always -p <YOUR PORT>:3001 -v <YOUR VOLUME>:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

PS: For every new release, it takes some time to build the docker image, please be patient if it is not available yet.

## Docker-Compose

```bash
cd "<YOUR docker-compose.yml DIRECTORY>"
docker pull louislam/uptime-kuma:1
docker stop uptime-kuma
docker-compose up -d --force-recreate
```

## 🆙 💪🏻 Non-Docker with JQ (oneliner)

This oneliner require jq command 

```bash
cd <uptime-kuma-directory> && git fetch --all && git checkout $(curl --silent "https://api.github.com/repos/louislam/uptime-kuma/releases/latest" | jq -r '.tag_name') --force && npm install --omit=dev && npm run download-dist
```

## 🆙 💪🏻 Non-Docker

```bash
cd <uptime-kuma-directory>

# Update from git
git fetch --all
git checkout 1.19.2 --force

# Install dependencies and prebuilt
npm install --omit=dev
npm run download-dist

# Restart
pm2 restart uptime-kuma
```
