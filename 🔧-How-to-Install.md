### 🐳 Docker

```bash
docker run -d --restart=unless-stopped -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

Uptime Kuma is now running on http://localhost:3001

> [!WARNING]
> Filesystem support for POSIX file locks is required to avoid SQLite database corruption. Be aware of possible [file locking problems](https://www.sqlite.org/howtocorrupt.html#_file_locking_problems) such as those [commonly encountered with NFS](https://www.sqlite.org/faq.html#q5). **Please map the `/app/data`-folder to a local directory or volume.**

Browse to http://localhost:3001 after started.

#### Changing Port or Volume

```bash
docker run -d --restart=unless-stopped -p <YOUR_PORT>:3001 -v <YOUR_DIR OR VOLUME>:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

#### Docker Tags Description

<table>
    <thead>
      <tr>
<td>Tag(s)</td>
<td>Description </td>
</tr>
</thead>
<tbody>
<tr><td>1</td><td>Latest stable (👍Recommended Tag)</td></tr>
<tr><td>latest, 1, 1.*</td><td>Latest stable - debian</td></tr>
<tr><td>debian, 1-debian, 1.*-debian</td><td>Latest stable - debian</td></tr>
<tr><td>❌alpine, 1-alpine, 1.*-alpine</td><td>(❌Deprecated due to DNS issues) Latest stable - alpine</td></tr>
<tr><td>nightly*</td><td>Development build, unstable</td></tr>
</tbody>
</table>

### 🐳 Docker Compose

Example docker-compose template: [https://github.com/louislam/uptime-kuma/blob/1.23.X/docker/docker-compose.yml](https://github.com/louislam/uptime-kuma/blob/1.23.X/docker/docker-compose.yml)

```bash
docker compose up -d
```

### 💪🏻 Non-Docker

Requirements:

- Platform
  - ✅ Major Linux distros such as Debian, Ubuntu, CentOS, Fedora and ArchLinux etc.
  - ✅ Windows 10 (x64), Windows Server 2012 R2 (x64) or higher
  - ❌ Replit / Heroku
- [Node.js](https://nodejs.org/en/download/) 14 / 16 / 18 / 20.4
- [npm](https://docs.npmjs.com/cli/) >= 9
- [Git](https://git-scm.com/downloads)
- [pm2](https://pm2.keymetrics.io/) - For running Uptime Kuma in the background

```bash
git clone https://github.com/louislam/uptime-kuma.git
cd uptime-kuma
npm run setup

# Option 1. Try it
node server/server.js

# (Recommended) Option 2. Run in the background using PM2
# Install PM2 if you don't have it:
npm install pm2 -g && pm2 install pm2-logrotate

# Start Server
pm2 start server/server.js --name uptime-kuma
```

Uptime Kuma is now running on http://localhost:3001

More useful PM2 Commands

```bash
# If you want to see the current console output
pm2 monit

# If you want to add it to startup
pm2 save && pm2 startup
```

## (Optional) One more step for Reverse Proxy

This is optional for someone who want to use a reverse proxy.

Unlikely other web apps, Uptime Kuma is based on WebSocket. You need two more headers **"Upgrade"** and **"Connection"** in order to reverse proxy WebSocket.

Please read wiki for more info: https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy

## Videos

- [Learn Uptime Kuma in 5 Minutes](https://www.youtube.com/watch?v=muZiPdH2JZ8) by DEVOPS UNLOCKED Install with the docker run command
- [Meet Uptime Kuma, a Fancy Open Source Uptime Monitor](https://www.youtube.com/watch?v=r_A5NKkAqZM) by Techno Tim Install with docker-compose
- [Monitor Status with Uptime Kuma - Let's install Uptime Kuma with Docker](https://www.youtube.com/watch?v=rRKvDMGeeBA) by Geeked Install with Portainer

## Unofficial

> [!WARNING]
> The following installation methods are provided by the community. They are not tested officially and may be broken in the future release. Use at your own risk.

### Deployment Tools

#### ☸️ OpenShift 4 and Kubernetes Helm 3 Chart (Unofficial)

> [!NOTE]
> This Chart relies on a repackaged OCI Container Image, which lets _uptime-kuma_ run as **non-root** user. The entire repackage process is automated via GitHub Actions and renovate-bot keeps everything up to date. (feel free to audit it yourself)

The Containerfile used to rebundle _uptime-kuma_: [rootless Containerfile](https://github.com/k3rnelpan1c-dev/uptime-kuma-helm/blob/main/container/Containerfile)

https://github.com/k3rnelpan1c-dev/uptime-kuma-helm

#### Ansible (Unofficial)

https://github.com/louislam/uptime-kuma/tree/ansible-unofficial/ansible

#### Home Assistant add-on (Unofficial)

https://github.com/hassio-addons/addon-uptime-kuma

[![Open this add-on in your Home Assistant instance.](https://my.home-assistant.io/badges/supervisor_addon.svg)](https://my.home-assistant.io/redirect/supervisor_addon/?addon=a0d7b954_uptime-kuma&repository_url=https%3A%2F%2Fgithub.com%2Fhassio-addons%2Frepository)

Also check out the corresponding custom integration: https://github.com/meichthys/uptime_kuma (WIP).

#### Install on Synology NAS (Unofficial)

Unofficial tutorial by Marius Bogdan Lixandru:

https://mariushosting.com/how-to-install-uptime-kuma-on-your-synology-nas/

### Server Hosting platforms

#### One-Click Hosting on PikaPods

Run with one click on [PikaPods.com](https://www.pikapods.com/). Free for about 3 months with welcome credit. PikaPods have produced a [getting started video](https://www.youtube.com/watch?v=gbbcnNKPi8M) if you like consuming information in this form.

[![PikaPods](https://www.pikapods.com/static/run-button.svg)](https://www.pikapods.com/pods?run=uptime-kuma)

#### Install on Azure Container Instance with TLS endpoint

Unofficial tutorial by Stefan: https://haci.io/posts/uptime-kuma-azure-container-instance/

#### Install on Azure AppService Container

Unofficial tutorial by Leandro: https://www.leandroscardua.com/blog/deploy-uptime-kuma-on-azure/

Or with persistent storage: bicep deployment script by Yannick Zwijsen: https://github.com/yzwijsen/deploy-uptime-kuma-azure

#### SQLite S3 persistent storage with Litestream.io

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/UfDasl)

Run uptime-kuma with S3 persistent sqlite database: https://github.com/fluential/litestream-uptime-kuma/

#### One-Click Deployment on Alibaba Cloud

[![Deploy on AlibabaCloud ComputeNest](https://service-info-public.oss-cn-hangzhou.aliyuncs.com/computenest-en.svg)](https://computenest.console.aliyun.com/service/instance/create/default?type=user&ServiceName=Higress社区版)

Follow the deployment guide to deploy Uptime Kuma on Alibaba Cloud. Both domestic site and internationl sites are supported.

- [Deployment Guide in English](https://computenest.console.aliyun.com/service/detail/ap-southeast-1/service-6a4ce994c30c49b1ae6b/2?type=user&isRecommend=true)
- [中文部署文档](https://computenest.console.aliyun.com/service/detail/cn-hangzhou/service-34d66f31479747cd9957/2?type=user&isRecommend=true)

### Install on Zeabur

Run with one click on [Zeabur](https://zeabur.com/).

[![Deploy on Zeabur](https://github.com/louislam/uptime-kuma-wiki/assets/22755963/c1e546a0-f313-44fd-8550-f3ec4fc64ab0)](https://zeabur.com/docs/marketplace/uptime-kuma)

[https://docs.zeabur.com/marketplace/uptime-kuma](https://zeabur.com/docs/marketplace/uptime-kuma)

### One-Click Deployment on Sealos

Run with one click on [Sealos](https://sealos.io/).

[![Deploy on Sealos](https://sealos.io/Deploy-on-Sealos.svg)](https://template.sealos.io/deploy?templateName=uptime-kuma)

## Deploy to Fly.io

You can host uptime-kuma [with a single command at Fly.io](https://community.fly.io/t/hosting-uptime-kuma-on-fly-io/14352) and run on its included Hobby Plan usage.

## Deploy to FlashPanel

You can [host uptime-kuma](https://flashpanel.io/docs/v2/en/tutorial/uptime-kuma.html) with [FlashPanel](https://flashpanel.io) (a server management control panel) for free on one server with up to 10 websites.

### Others

### uptime-kuma-helper

[@mkgeeky](https://github.com/mkgeeky/) has created [uptime-kuma-helper](https://github.com/mkgeeky/uptime-kuma-helper) a bash script to install and update easy

## Uptime Kuma On Pi Deploy Android

See [this guide](https://nanonotables.blogspot.com/2025/04/uptime-kuma-on-pi-deploy-tutorial.html) on how to convert a rooted android smartphone into an uptime kuma instance.
