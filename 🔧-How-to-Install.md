## Installer via cli

```bash
curl -o kuma_install.sh https://raw.githubusercontent.com/louislam/uptime-kuma/master/install.sh && sudo bash kuma_install.sh
```

## Manual Installation

### 🐳 Docker

```bash
# Create a volume
docker volume create uptime-kuma

# Start the container
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

Browse to http://localhost:3001 after started.


If you want to change **port** and **volume**, or need to browse via a reserve proxy, please read <a href="https://github.com/louislam/uptime-kuma/wiki/Installation#docker">wiki</a>.

### 💪🏻 Without Docker (Recommended for x86/x64 only)

Required Tools: Node.js >= 14, git and pm2.

```bash
git clone https://github.com/louislam/uptime-kuma.git
cd uptime-kuma
npm run setup

# Option 1. Try it
npm run start-server

# (Recommended)
# Option 2. Run in background using PM2
# Install PM2 if you don't have: npm install pm2 -g
pm2 start npm --name uptime-kuma -- run start-server

```

Browse to http://localhost:3001 after started.

## (Optional) One more step for Reverse Proxy

This is optional for someone who want to do reverse proxy.

Unlikely other web apps, Uptime Kuma is based on WebSocket. You need two more headers **"Upgrade"** and **"Connection"** in order to reverse proxy WebSocket.

Please read wiki for more info:
https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy
