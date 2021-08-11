## Manual Installation

### Docker

```bash
# Create a volume
docker volume create uptime-kuma

# Start the container
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

Browse to http://localhost:3001 after started.

Change Port and Volume

```bash
docker run -d --restart=always -p <YOUR_PORT>:3001 -v <YOUR_DIR OR VOLUME>:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

### Without Docker (x86/x64 only)

Required Tools: Node.js >= 14, git and pm2.

(**Not recommanded for ARM CPU users.** Since there is no prebuilt for node-sqlite3, it is hard to get it running)

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

# Listen to different port or hostname
pm2 start npm --name uptime-kuma -- run start-server -- --port=80 --hostname=0.0.0.0

```

More useful commands if you have installed.

```bash
pm2 start uptime-kuma
pm2 restart uptime-kuma
pm2 stop uptime-kuma
```

Browse to http://localhost:3001 after started.

### (Optional) One more step for Reverse Proxy

This is optional for someone who want to do reverse proxy.

Unlikely other web apps, Uptime Kuma is based on WebSocket. You need two more headers **"Upgrade"** and **"Connection"** in order to reverse proxy WebSocket.

Please read wiki for more info:
https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy
