*   [🚀 Instalador](#-installer-via-cli)
*   [🐳 Estibador](#-docker)
*   [💪🏻 Sin Docker](#-without-docker-recommended-for-x86x64-only)
*   [☁️ Opciones de instalación y alojamiento no oficiales](#unofficial--experimental)

## 🚀 Instalador a través de CLI

\[Ubuntu/CentOS] Instalador de CLI interactivo, compatible con Docker o sin Docker.

```bash
curl -o kuma_install.sh http://git.kuma.pet/install.sh && sudo bash kuma_install.sh
```

## Instalación avanzada

### 🐳 Estibador

```bash
# Create a volume
docker volume create uptime-kuma

# Start the container
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

Vaya a http://localhost:3001 después de iniciado.

Cambiar puerto y volumen

```bash
docker run -d --restart=always -p <YOUR_PORT>:3001 -v <YOUR_DIR OR VOLUME>:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

⚠️ Por favor, utilice un **volumen local** solamente. Otros tipos como NFS no son compatibles.

#### Docker Etiquetas Descripción

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

### 💪🏻 Sin Docker (recomendado solo para x86/x64)

Herramientas requeridas: Node.js >= 14, git y pm2.

(**No se recomienda para usuarios de CPU ARM.** Dado que no hay una versión prediseñada para node-sqlite3, es difícil ejecutarla)

```bash
# Update your npm to the latest version
npm install npm -g

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

Vaya a http://localhost:3001 después de iniciado.

    # Listen to different port or hostname
    pm2 start server/server.js --name uptime-kuma -- --port=80 --host=0.0.0.0

#### Comandos útiles

```bash
pm2 start uptime-kuma
pm2 stop uptime-kuma
pm2 restart uptime-kuma

# Run at startup
pm2 startup
```

### Ejemplo de Docker Compose

https://github.com/louislam/uptime-kuma/blob/master/docker/docker-compose.yml

## (Opcional) Un paso más para el proxy inverso

Esto es opcional para alguien que quiera hacer proxy inverso.

Improbable que sean otras aplicaciones web, Uptime Kuma se basa en WebSocket. Necesitas dos encabezados más **"Actualizar"** y **"Conexión"** para revertir el proxy WebSocket.

Por favor, lea la wiki para obtener más información:
https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy

## Videos

*   [Aprende Kuma en 5 minutos](https://www.youtube.com/watch?v=muZiPdH2JZ8) por DEVOPS UNLOCKED
    Instalar con el comando docker run
*   [Conozca Uptime Kuma, un elegante monitor de tiempo de actividad de código abierto](https://www.youtube.com/watch?v=r_A5NKkAqZM) por Techno Tim
    Instalar con docker-compose
*   [Supervisar el estado con Uptime Kuma - Instalemos Uptime Kuma con Docker](https://www.youtube.com/watch?v=rRKvDMGeeBA) por Geeked
    Instalar con Portainer

## No oficial y experimental

⚠ ⚠ ⚠ Advertencia: Generalmente, solo pruebo Docker y Node.js. Todos los métodos de instalación aquí pueden romperse en la versión futura. No los mantengo. Úselo bajo su propio riesgo.

### ☸️ Kubernetes (no oficial)

⚠ Advertencia: La implementación de K8s es proporcionada por los contribuyentes. No tengo experiencia con K8 y no puedo corregir errores en el futuro.

Ver más [aquí](https://github.com/louislam/uptime-kuma/tree/k8s-unofficial/kubernetes)

### Ansible (No oficial)

https://github.com/louislam/uptime-kuma/tree/ansible-unofficial/ansible

### Instalación en Synology NAS (no oficial)

Tutorial no oficial de Marius Bogdan Lixandru:

https://mariushosting.com/how-to-install-uptime-kuma-on-your-synology-nas/

### Alojamiento con un solo clic en PikaPods

Ejecutar con un solo clic en [PikaPods.com](https://www.pikapods.com/). Gratis durante unos 3 meses con crédito de bienvenida.

[![PikaPods](https://www.pikapods.com/static/run-button.svg)](https://www.pikapods.com/pods?run=uptime-kuma)

### Termux (No oficial/Experimento)

¿Tienes un teléfono Android antiguo? ¡Podrías instalar Uptime Kuma en él!

https://github.com/louislam/uptime-kuma/issues/423

### Instalación en Azure Container Instance con punto de conexión TLS

Tutorial no oficial de Stefan:
https://haci.io/posts/uptime-kuma-azure-container-instance/

### Instalación en Azure AppService Container

Tutorial no oficial de Leandro:
https://www.leandroscardua.com/blog/deploy-uptime-kuma-on-azure/
