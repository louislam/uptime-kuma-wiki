## Description

This is the easiest reverse proxy that I have ever seen so far. 

You don't even need to expose Docker port!

## Requirements

- Your domain name's DNS is managed by Cloudflare.
- For Docker, it is supported by Debian base only. The Alpine base is not supported yet.
- For non-Docker, you need to download and install `cloudflared`. https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

## TL;DR

1. Create a tunnel on [Cloudflare Zero Trust](https://dash.teams.cloudflare.com/).
2. Get your tunnel token and set it into your Uptime Kuma instance.
3. Map to http://localhost:3001.
3. Profit.

## Details

1. Go to [Cloudflare Zero Trust](https://dash.teams.cloudflare.com/).


![image](https://user-images.githubusercontent.com/1336778/160821358-aff29332-6383-447e-a552-dbdeba014a77.png)
