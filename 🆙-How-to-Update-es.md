## 🆙🐳 Estibador

Vuelva a extraer la última imagen de Docker y cree otro contenedor con el mismo volumen.

Para alguien que usó mis comandos "Cómo usar" para instalar Uptime Kuma, puede actualizar con esto:

```bash
docker pull louislam/uptime-kuma:1
docker stop uptime-kuma
docker rm uptime-kuma

# Default
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1

# If you are not using default value
# docker run -d --restart=always -p <YOUR PORT>:3001 -v <YOUR VOLUME>:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

PD: Para cada nueva versión, lleva algún tiempo construir la imagen de docker, tenga paciencia si aún no está disponible.

## Docker-Componer

```bash
cd "<YOUR docker-compose.yml DIRECTORY>"
docker pull louislam/uptime-kuma:1
docker stop uptime-kuma
docker-compose up -d --force-recreate
```

## 🆙 💪🏻 No Docker

```bash
cd <uptime-kuma-directory>

# Update from git
git fetch --all
git checkout 1.16.1 --force

# Install dependencies and prebuilt
npm install --production
npm run download-dist

# Restart
pm2 restart uptime-kuma
```
