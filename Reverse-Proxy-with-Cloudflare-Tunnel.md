## Description

This is the easiest reverse proxy that I have ever seen so far!

Despite a lot of reverse proxy methods in the world, unfortunately, none of them are actually easy-to-use in my opinion. As in the past, many Uptime Kuma users kept asking how to config a reverse proxy.

Recently, I just discovered that Cloudflare has added a web GUI for Cloudflare Tunnel which make it super easy to use. You can expose your Uptime Kuma to the Internet without so many configs!

For Docker users, you just need to provide a Cloudflare Tunnel token in the Settings, then you can browse Uptime Kuma on the Internet. 

Read more about cloudflared:
https://www.reddit.com/r/selfhosted/comments/tp0nqg/cloudflare_has_added_a_web_gui_for_controlling/

Pros:
- Free of charge
- Full GUI, zero-config files
- You can put your Uptime Kuma behind firewall
- No need to expose your real IP
- Expose Docker port is optional
- No need a reverse proxy software such as Nginx, Caddy or Traefik
- Zero-config SSL
- Free SSL

Cons:
- (Not a con if you are already using Cloudflare) You domain's nameserver have to move to Cloudflare.
- Added 30MB to the docker base image

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

## Step by step

The steps are actually very simple. However, since the concept is pretty new to anyone, it may be good to write it in detail. 

But trust me, once you learn, you will remember how to configure a cloudflare tunnel without this guide! (for Nginx or Traefik, I could never remember how to configure them without googling it)



1. Go to [Cloudflare Zero Trust](https://dash.teams.cloudflare.com/).
2. `Network` > `Tunnels` > `Create a Tunnel`

   <img src="https://github.com/louislam/uptime-kuma-wiki/assets/26258709/6ca4062b-12b8-4516-a1dd-e64a94ae6a4b" width="800" />

3. `Cloudflared` > `Next`

   <img src="https://github.com/louislam/uptime-kuma-wiki/assets/26258709/222f8eba-b807-488b-8059-fb975fb554da" width="800" />

4. Type a `Tunnel name` such as `uptime-kuma` and save tunnel.
5. Click the clipboard icon to copy the run command.
   <img src="https://github.com/louislam/uptime-kuma-wiki/assets/26258709/2853ee57-cc50-4ae6-9688-e102038d9f57" width="800" />

6. Paste that into a text editor so you can copy the token from the end of the command.
   ```cmd
   cloudflared.exe service install eyJhIjoiZDA4ZGNiMTUXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   `` `
7. Go to your Uptime Kuma instance. 

   <img src="https://user-images.githubusercontent.com/1336778/160821358-aff29332-6383-447e-a552-dbdeba014a77.png" width="800" />

6. `Settings` > `Reverse Proxy`
7. Paste the token into the `Cloudflare Tunnel Token` field.
8. Click `Start cloudflared`
9. Go back to `Cloudflare Zero Trust`, if you see your connector, then click `Next`

    <img src="https://user-images.githubusercontent.com/1336778/160883516-66c059db-442d-4e2c-845a-c8eaf7a7f992.png" width="800" />

10. Choose your favorite domain name and map to `http://localhost:3001`

    <img src="https://user-images.githubusercontent.com/1336778/160883898-24217c46-d833-463d-8e0e-e5dc22a35d48.png" width="800" />

11. Click `Save` and go to your domain name `https://<your domain name>` and profit!
    Yeah, it also automatically gives you SSL!

    <img src="https://user-images.githubusercontent.com/1336778/160884606-a6a9db7f-68a6-4083-ac75-6f06f4930c52.png" width="500" />


## How to Stop

- Option 1. You can remove the map on Cloudflare.
- Option 2. You can click `Stop cloudflared` and `Remove Token` in your Uptime Kuma.


## Environment Variable

Alternatively, you can set the token via a environment variable. cloudflared will be started automatically.

With this approach, you don't even need to expose your container port to the host machine.  

UPTIME_KUMA_CLOUDFLARED_TOKEN=`<your token>`

