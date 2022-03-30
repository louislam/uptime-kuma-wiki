## Description

This is the easiest reverse proxy that I have ever seen so far. You don't even need to expose Docker port!

Despite a lot of reverse proxy methods in the world, unfortunately, none of them are actually easy-to-use in my opinion. As in the past, many Uptime Kuma users kept asking how to config a reverse proxy.

Recently, I just discovered that Cloudflare has added a web GUI for Cloudflare Tunnel which make it super easy to use. You can expose your Uptime Kuma to the Internet without so many configs!

For Docker users, you just need to provide a Cloudflare Tunnel token in the Settings. Then it is ready to be browsed from the Internet. 

Read more about cloudflared:
https://www.reddit.com/r/selfhosted/comments/tp0nqg/cloudflare_has_added_a_web_gui_for_controlling/

Pros:
- Free of charge
- Full GUI, zero-config files
- You can put your Uptime Kuma behind firewall
- No need to expose your real ip
- Expose Docker port is optional
- No need nginx, caddy, traefik etc
- Zero-config SSL
- Free SSL

Cons:
- (Not a con if you are already using Cloudflare) You domain's nameserver have to move to Cloudflare.
- add 30MB to the docker base image

## Requirements

- Your domain name's DNS is managed by Cloudflare.
- For Docker, it is supported by Debian base only. The Alpine base is not supported yet.
- For non-Docker, you need to download and install `cloudflared`. https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
- For non-Docker Windows users, you can download the msi installer on their Github release: https://github.com/cloudflare/cloudflared/releases/latest

## TL;DR

1. Create a tunnel on [Cloudflare Zero Trust](https://dash.teams.cloudflare.com/).
2. Get your tunnel token and set it into your Uptime Kuma instance.
3. Map to http://localhost:3001.
3. Profit.

## Details

1. Go to [Cloudflare Zero Trust](https://dash.teams.cloudflare.com/).


![image](https://user-images.githubusercontent.com/1336778/160821358-aff29332-6383-447e-a552-dbdeba014a77.png)
