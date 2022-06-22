## Descripción

¡Este es el proxy inverso más fácil que he visto hasta ahora!

A pesar de una gran cantidad de métodos de proxy inverso en el mundo, desafortunadamente, ninguno de ellos es realmente fácil de usar en mi opinión. Como en el pasado, muchos usuarios de Uptime Kuma seguían preguntando cómo configurar un proxy inverso.

Recientemente, acabo de descubrir que Cloudflare ha agregado una GUI web para Cloudflare Tunnel que lo hace súper fácil de usar. ¡Puede exponer su Uptime Kuma a Internet sin tantas configuraciones!

Para los usuarios de Docker, solo necesita proporcionar un token de túnel de Cloudflare en la Configuración, luego puede navegar por Uptime Kuma en Internet.

Lea más sobre cloudflared:
https://www.reddit.com/r/selfhosted/comments/tp0nqg/cloudflare_has_added_a_web_gui_for_controlling/

Pros:

*   Gratuito
*   GUI completa, archivos de configuración cero
*   Puede poner su Uptime Kuma detrás del firewall
*   No hay necesidad de exponer su IP real
*   El puerto Expose Docker es opcional
*   No necesita un software de proxy inverso como Nginx, Caddy o Traefik
*   SSL de configuración cero
*   SSL gratuito

Contras:

*   (No es una desventaja si ya está utilizando Cloudflare) El servidor de nombres de su dominio debe moverse a Cloudflare.
*   Se agregaron 30 MB a la imagen base de Docker

## Requisitos

*   El DNS de su nombre de dominio es administrado por Cloudflare.
*   Para Docker, solo es compatible con la base de Debian. La base alpina aún no es compatible.
*   Para los que no son docker, debe descargar e instalar `cloudflared`. https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
*   Para los usuarios que no son de Docker Windows, puede descargar el instalador msi en su versión de Github: https://github.com/cloudflare/cloudflared/releases/latest

## TL;DR

1.  Crear un túnel en [Cloudflare Confianza Cero](https://dash.teams.cloudflare.com/).
2.  Obtenga su token de túnel y configúrelo en su instancia de Uptime Kuma.
3.  Mapa a http://localhost:3001.
4.  Beneficio.

## Paso a paso

Los pasos son realmente muy simples. Sin embargo, dado que el concepto es bastante nuevo para cualquiera, puede ser bueno escribirlo en detalle.

Pero créeme, una vez que hayas aprendido, ¡recordarás cómo configurar sin esta guía nuevamente! Mientras que para Nginx o Traefik, nunca pude recordar cómo configurar sin buscarlo en Google.

1.  Vete a [Cloudflare Confianza Cero](https://dash.teams.cloudflare.com/).

2.  `Access` > `Tunnels` > `Create Tunnel`

    <img src="https://user-images.githubusercontent.com/1336778/160877346-01fe89f0-b55d-4417-92f7-fe7509656255.png" width="800" />

3.  Escriba un `Tunnel name` como `uptime-kuma` y salvar túnel.

4.  Haga clic en el token para copiarlo.

    <img src="https://user-images.githubusercontent.com/1336778/160879200-642609d7-7264-41ea-8b16-b99f95e7f446.png" width="800" />

5.  Vaya a su instancia de Uptime Kuma.

    <img src="https://user-images.githubusercontent.com/1336778/160821358-aff29332-6383-447e-a552-dbdeba014a77.png" width="800" />

6.  `Settings` > `Reverse Proxy`

7.  Pegue el token en el `Cloudflare Tunnel Token` campo.

8.  Clic `Start cloudflared`

9.  Volver a `Cloudflare Zero Trust`, si ve el conector, haga clic en `Next`

     <img src="https://user-images.githubusercontent.com/1336778/160883516-66c059db-442d-4e2c-845a-c8eaf7a7f992.png" width="800" />

10. Elija su nombre de dominio favorito y asigne a `http://localhost:3001`

    <img src="https://user-images.githubusercontent.com/1336778/160883898-24217c46-d833-463d-8e0e-e5dc22a35d48.png" width="800" />

11. Clic `Save` y ve a tu nombre de dominio `https://<your domain name>` y ganancia!
    Sí, ¡también te da SSL automáticamente!

    <img src="https://user-images.githubusercontent.com/1336778/160884606-a6a9db7f-68a6-4083-ac75-6f06f4930c52.png" width="500" />

## Cómo parar

*   Opción 1. Puede eliminar el mapa en Cloudflare.
*   Opción 2. Puede hacer clic en `Stop cloudflared` y `Remove Token` en tu Uptime Kuma.

## Variable de entorno

Alternativamente, puede establecer el token a través de una variable de entorno. cloudflared se iniciará automáticamente.

Con este enfoque, ni siquiera necesita exponer su puerto de contenedor a la máquina host.

UPTIME_KUMA_CLOUDFLARED_TOKEN=`<your token>`
