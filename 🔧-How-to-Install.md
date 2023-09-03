- [🚀 Installer](#-installer-via-cli)
- [🐳 Docker](#-docker)
- [💪🏻 Without Docker](#-without-docker-recommended-for-x86x64-only)
- [☁️ Unofficial Install- and Hosting Options](#unofficial--experimental)

## 🚀 Installer via CLI

[Ubuntu/CentOS] Interactive CLI installer, supports Docker or without Docker. 

```bash
curl -Lo kuma_install.sh https://git.kuma.pet/install.sh && sudo bash kuma_install.sh
```

## Advanced Installation

### 🐳 Docker

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

⚠️ Please use a **local volume** only. Other types such as NFS are not supported.

#### Docker Tags Description
<table>
    <thead>
      <tr>
<td>Tag(s)</td>
<td>Description </td>
</tr>
</thead>
<tbody>
<tr><td>latest, 1, 1.*</td><td>latest stable - debian</td></tr>
<tr><td>debian, 1-debian, 1.*-debian</td><td>latest stable - debian</td></tr>
<tr><td>❌alpine, 1-alpine, 1.*-alpine</td><td>(❌Deprecated due to DNS issues) latest stable - alpine</td></tr>
<tr><td>nightly*</td><td>development build, unstable</td></tr>
</tbody>
</table>

### 🐳 Docker Compose Example

https://github.com/louislam/uptime-kuma/blob/master/docker/docker-compose.yml


### 💪🏻 Without Docker (Recommended for x86/x64 only)

It should supports Linux/Windows/MacOS.

Required Tools: 
- [Node.js](https://nodejs.org/en/) >= 14  
- [Git](https://git-scm.com/downloads)
- [PM2](https://pm2.keymetrics.io/) 
- (Optional) [cloudflared](https://github.com/cloudflare/cloudflared)
- (Optional) [Apprise](https://github.com/caronc/apprise)


```bash
# Update your npm to the latest version
npm install npm -g

# Clone the repository
# If you don't want to install Uptime Kuma into your homefolder but instead into a more permanent location, follow the "Create app directory in /opt" steps under **Useful Commands** and then continue here.
git clone https://github.com/louislam/uptime-kuma.git
cd uptime-kuma
npm run setup

# Option 1. Try it
node server/server.js

# (Recommended)
# Option 2. Run in background using PM2
# Install PM2 if you don't have: npm install pm2 -g
pm2 start server/server.js --name uptime-kuma

```

Browse to http://localhost:3001 after started.

```
# Listen to different port or hostname
pm2 start server/server.js --name uptime-kuma -- --port=80 --host=0.0.0.0
```

#### Useful Commands

```bash
pm2 start uptime-kuma
pm2 stop uptime-kuma
pm2 restart uptime-kuma

# Run at startup
pm2 startup

# Create app directory in /opt for home-independent app storage
cd /opt
sudo mkdir uptime-kuma
sudo chown -R {username}:{username} uptime-kuma # Replace {username} with the username you are currently running the commands with
```

### 🪟 Windows Portable

![](https://user-images.githubusercontent.com/1336778/227160967-907ba113-c89d-4ec3-bb94-4c4ea6b7cb6f.png)


Requirement: 
- Arch: x64
- .NET 4.8 Runtime
- Internet for initialization (Download Node.js runtime and Uptime Kuma source code)

Download: https://github.com/louislam/uptime-kuma/files/11886108/uptime-kuma-win64-portable-1.0.1.zip

## (Optional) One more step for Reverse Proxy

This is optional for someone who want to use a reverse proxy.

Unlikely other web apps, Uptime Kuma is based on WebSocket. You need two more headers **"Upgrade"** and **"Connection"** in order to reverse proxy WebSocket.

Please read wiki for more info:
https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy

## Videos

- [Learn Uptime Kuma in 5 Minutes](https://www.youtube.com/watch?v=muZiPdH2JZ8) by DEVOPS UNLOCKED
  Install with the docker run command
- [Meet Uptime Kuma, a Fancy Open Source Uptime Monitor](https://www.youtube.com/watch?v=r_A5NKkAqZM) by Techno Tim
  Install with docker-compose
- [Monitor Status with Uptime Kuma - Let's install Uptime Kuma with Docker](https://www.youtube.com/watch?v=rRKvDMGeeBA) by Geeked
  Install with Portainer


## Unofficial & Experimental

⚠ ⚠ ⚠ Warning: Generally, I only test Docker and Node.js. All installation methods here may be broken in the future release. I don't maintain them. Use at your own risk.

### ☸️ OpenShift 4 and Kubernetes Helm 3 Chart (Unofficial)

> Note: This Chart relies on a repackaged OCI Container Image, which lets *uptime-kuma* run as **non-root** user. \
> The entire repackage process is automated via GitHub Actions and renovate-bot keeps everything up to date. (feel free to audit it yourself)

The Containerfile used to rebundle *uptime-kuma*: [rootless Containerfile](https://github.com/k3rnelpan1c-dev/uptime-kuma-helm/blob/main/container/Containerfile)

https://github.com/k3rnelpan1c-dev/uptime-kuma-helm

### Ansible (Unofficial)

https://github.com/louislam/uptime-kuma/tree/ansible-unofficial/ansible

### Home Assistant add-on (Unofficial)

https://github.com/hassio-addons/addon-uptime-kuma

[![Open this add-on in your Home Assistant instance.](https://my.home-assistant.io/badges/supervisor_addon.svg)](https://my.home-assistant.io/redirect/supervisor_addon/?addon=a0d7b954_uptime-kuma&repository_url=https%3A%2F%2Fgithub.com%2Fhassio-addons%2Frepository)

Also check out the corresponding custom integration: https://github.com/meichthys/uptime_kuma (WIP).

### Install on Synology NAS (Unofficial)

Unofficial tutorial by Marius Bogdan Lixandru:

https://mariushosting.com/how-to-install-uptime-kuma-on-your-synology-nas/

### One-Click Hosting on PikaPods

Run with one click on [PikaPods.com](https://www.pikapods.com/). Free for about 3 months with welcome credit.

[![PikaPods](https://www.pikapods.com/static/run-button.svg)](https://www.pikapods.com/pods?run=uptime-kuma)

### Termux (Unofficial/Experiment)

Do you have an old Android phone? You could install Uptime Kuma on it!

https://github.com/louislam/uptime-kuma/issues/423

### Install on Azure Container Instance with TLS endpoint

Unofficial tutorial by Stefan:
https://haci.io/posts/uptime-kuma-azure-container-instance/

### Install on Azure AppService Container

Unofficial tutorial by Leandro:
https://www.leandroscardua.com/blog/deploy-uptime-kuma-on-azure/

### Install on Azure AppService with persistent storage

Unofficial bicep deployment script by Yannick Zwijsen:
https://github.com/yzwijsen/deploy-uptime-kuma-azure

### SQLite S3 persistent storage with Litestream.io 
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/UfDasl?referralCode=373)

Run uptime-kuma with S3 persistent sqlite database:
https://github.com/fluential/litestream-uptime-kuma/

### Install on Zeabur

Run with one click on [Zeabur](https://zeabur.com/).
https://docs.zeabur.com/marketplace/umami
