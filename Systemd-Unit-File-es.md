Aparte de las instrucciones proporcionadas pm2. También puede usar systemd para habilitar y ejecutar Uptime-Kuma al iniciar el sistema más fácilmente.

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

Nota: Este archivo de unidad asume que está ejecutando el software como un usuario de "tiempo de actividad" separado. Si tiene node/npm instalado en una ruta diferente, deberá modificar la línea ExecStart para que coincida con esta.

Este archivo de unidad se puede instalar en /etc/systemd/system/uptime-kuma.service (o el nombre de servicio que prefiera)

Una vez instalado, emita los siguientes comandos para volver a cargar los archivos de la unidad systemd, habilítelo para que se inicie en el arranque e inícielo de inmediato:

```sh
systemctl daemon-reload
systemctl enable --now uptime-kuma
```
