Aside from the provided pm2 instructions. You can also use systemd to enable and run Uptime-Kuma at system startup more easily.

```ini
[Unit]
Description=Uptime-Kuma - A free and open source uptime monitoring solution
Documentation=https://github.com/louislam/uptime-kuma
After=network.target

[Service]
Type=simple
User=uptime
WorkingDirectory=/home/uptime/uptime-kuma
ExecStart=/usr/bin/npm run start-server
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

> [!NOTE]
> This unit file assumes that you are running the software as a separate 'uptime' user. If you have node/npm installed in a different path, you will need to alter the ExecStart line to match this.

This unit file may be installed to /etc/systemd/system/uptime-kuma.service (Or whatever service name you'd prefer)

Once installed, issue the following commands to reload systemd unit files, enable it to start on boot, and start it immediately:

```bash
systemctl daemon-reload
systemctl enable --now uptime-kuma
```
