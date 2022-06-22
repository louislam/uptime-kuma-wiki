Para exponer Uptime Kuma a la web de forma segura, se recomienda proxy detrás de un servidor web tradicional como nginx o Apache. A continuación se muestran algunas configuraciones de ejemplo que podría usar.

A diferencia de otras aplicaciones web, Uptime Kuma se basa en WebSocket. Necesitas dos encabezados más **"Actualizar"** y **"Conexión"** con el fin de **proxy inverso WebSocket**.

Tiempo de actividad Kuma **no admite un subdirectorio** como `http://example.com/uptimekuma`. Por favor, prepare un dominio o subdominio para hacer eso.

*   [Nginx](#nginx)
*   [Apache](#apache)
*   [Caddy](#caddy)
*   [Caddy con Docker-Compose](#caddy-with-docker-compose)
*   [Portal Https](#https-portal)
*   [Administrador de proxy Nginx](#nginx-proxy-manager)
*   [Proxy inverso integrado de Synology](#synology-builtin-reverse-proxy)
*   [Traefik](#Traefik)
*   [Cloudflare](#cloudflare)
*   [Túneles Cloudflare](#cloudflare-tunnels)
*   [OpenLiteSpeed](#openlitespeed)
*   [HAProxy](#haproxy)
*   Otros
    *   [SSL/HTTPS](#sslhttps)

# Nginx

Con SSL:

```nginx
server {
  listen 443 ssl http2;
  server_name sub.domain.com;
  ssl_certificate     /path/to/ssl/cert/crt;
  ssl_certificate_key /path/to/ssl/key/key;

  location / {
    proxy_set_header   X-Real-IP $remote_addr;
    proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass         http://localhost:3001/;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection "upgrade";
  }
}
```

Sin SSL:

```nginx
server  {
    listen 80;
    server_name    sub.domain.com;
    location / {
        proxy_pass         http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host $host;
    }
}
```

# Apache

Con SSL:

```apache
<VirtualHost *:443>
  ServerName sub.domain.com
  SSLEngine On
  SSLCertificateFile /path/to/ssl/cert/crt
  SSLCertificateKeyFile /path/to/ssl/key/key
  # Protocol 'h2' is only supported on Apache 2.4.17 or newer.
  Protocols h2 http/1.1

  ProxyPass / http://localhost:3001/
  RewriteEngine on
  RewriteCond %{HTTP:Upgrade} websocket [NC]
  RewriteCond %{HTTP:Connection} upgrade [NC]
  RewriteRule ^/?(.*) "ws://localhost:3001/$1" [P,L]
</VirtualHost>
```

Sin SSL:

```apache
<VirtualHost *:80>
  ServerName sub.domain.com

  ProxyPass / http://localhost:3001/
  RewriteEngine on
  RewriteCond %{HTTP:Upgrade} websocket [NC]
  RewriteCond %{HTTP:Connection} upgrade [NC]
  RewriteRule ^/?(.*) "ws://localhost:3001/$1" [P,L]
</VirtualHost>
```

# Caddy

```nginx
subdomain.domain.com {
    reverse_proxy 127.0.0.1:3001
}
```

# Caddy con Docker-compose

Si ejecuta Uptime Kuma con Docker-Compose y aún no tiene un proxy inverso, esta es una forma sencilla de configurar Caddy. Solo necesita reemplazar 'status.example.org' con su dominio.

```yml
version: '3'
networks:
  default:  
    name: 'proxy_network'
services:
  uptime-kuma:
    image: louislam/uptime-kuma:1
    restart: unless-stopped
    volumes:  
      - /srv/uptime:/app/data
    labels:   
      caddy: status.example.org
      caddy.reverse_proxy: "* {{ '{{upstreams 3001}}'}}"
  caddy:
    image: "lucaslorentz/caddy-docker-proxy:ci-alpine"
    ports:    
      - "80:80" 
      - "443:443"
    volumes:  
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /srv/caddy/:/data
    restart: unless-stopped
    environment:
      - CADDY_INGRESS_NETWORKS=proxy_network
```

# Portal Https

Habilitar "WEBSOCKET=true", o el equivalente en sus variables de entorno docker hará el truco.\
Enlace a https-portal Websocket en [Uso avanzado](https://github.com/SteveLTN/https-portal#configure-nginx-through-environment-variables).

Ejemplo de archivo docker-compose.yml con Https-Portal:

    version: '3.3'

    services:
      https-portal:
        image: steveltn/https-portal:1
        ports:
          - '80:80'
          - '443:443'
        links:
          - uptime-kuma
        restart: always
        environment:
          DOMAINS: 'status.domain.com -> http://uptime-kuma:3001'
          STAGE: 'production' # Don't use production until staging works
          # FORCE_RENEW: 'true'
          WEBSOCKET: 'true'
        volumes:
          - https-portal-data:/var/lib/https-portal

      uptime-kuma:
        image: louislam/uptime-kuma:1
        container_name: uptime-kuma
        volumes:
          - ./uptime-kuma:/app/data
        ports:
          - 3001:3001

    volumes:
      https-portal-data:

Solo cambia "status.domain.com" a tu dominio

# Administrador de proxy Nginx

Por favor, habilite "WebSockets Supports"

# Proxy inverso integrado de Synology

https://mlohr.com/websockets-for-synology-dsm/

# Traefik

    labels:
        - "traefik.enable=true"
        - "traefik.http.routers.uptime-kuma.rule=Host(`YourOwnHostname`)"
        - "traefik.http.routers.uptime-kuma.entrypoints=https"
        - "traefik.http.routers.uptime-kuma.tls=true"
        - "traefik.http.routers.uptime-kuma.tls.certresolver=myresolver"
        - "traefik.http.services.uptime-kuma.loadBalancer.server.port=3001"

Agregue lo anterior a su `docker-compose.yml` y reemplace "YourOwnHostname" con el nombre de host que desea usar. Cuando se configura correctamente, Traefik puede obtener automáticamente un certificado Let's Encrypt para su servicio.

# Cloudflare

Debe habilitar "WebSockets" en Cloudflare Dashboard:

Cloudflare Dashboard -> Network -> Habilitar WebSockets

Leer más:
https://github.com/louislam/uptime-kuma/issues/138#issuecomment-890485229

# Túneles Cloudflare

Es la forma más fácil en mi opinión.

Leer más: https://github.com/louislam/uptime-kuma/wiki/Reverse-Proxy-with-Cloudflare-Tunnel

# OpenLiteSpeed

Cree un nuevo host virtual a través del administrador gráfico como lo haría normalmente.

**Pestaña Básica**

*   Nombre: `uptime-kuma`
*   Raíz de host virtual:	`/path/to/uptime-kuma`
*   Habilitar Scripts/ExtApps:	`Yes`

**Pestaña Aplicación externa**

*   Añadir un `web server` tipo de aplicación
*   Nombre: `uptime-kuma`
*   Dirección:	`http://localhost:3001`

**Pestaña Contexto**

*   Añadir un `proxy` contexto
*   URI:	`/`
*   Servidor web:	`[VHost Level]: uptime-kuma`
*   Operaciones de encabezado:
        Upgrade websocket
        Connection upgrade
*   Acceso permitido:	`*`

**Ficha Proxy de socket web**

*   Añadir un `Web Socket Proxy Setup`
*   URI:	`/`
*   Dirección: `127.0.0.1:3001`

**Pestaña SSL (si es necesario)**

*   Archivo de clave privada: `/path/to/ssl/key/privkey.pem`
*   Archivo de certificado: `/path/to/ssl/cert/fullchain.pem`
*   Certificado encadenado: `yes`

Realice un reinicio elegante y inicie el tiempo de actividad-kuma.

# HAProxy

No se requiere ninguna configuración especial cuando se utiliza HAProxy como reverso
proxy aunque es posible que desee agregar el `timeout tunnel` opción a:
el `defaults`, `listen`o `backend` Secciones. Si utiliza el `timeout
tunnel` opción, también se recomienda establecer `timeout client-fin` Para
controlar las instancias en las que el cliente deja de responder.

Leer más:
http://cbonte.github.io/haproxy-dconv/2.4/configuration.html#4.2-timeout%20tunnel

# Otros

## SSL/HTTPS

Se recomienda utilizar SSL (HTTPS) con su servidor web para evitar ataques MiTM cuando se está en una red pública. Si se utiliza caddy, estos certificados se generarán y actualizarán automáticamente.

Si usa Apache o NGINX, se recomienda usar CertBot para administrar SSL de forma gratuita, usa Let's Encrypt para obtener sus certificados y los mantiene renovados. También puede usar sus propios certificados y colocarlos como se muestra arriba. Si usa CertBot, use la configuración "Sin SSL" y luego ejecute certbot en él y configurará automáticamente la redirección automática de HTTPS.
