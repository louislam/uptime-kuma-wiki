En la versión 1.13.0 se admiten varias páginas de estado.

especial: `default`

`/status` está apuntando a `/status/default`.

## Nombres de dominio para páginas de estado

(1.14.0)

Ahora puede mostrar diferentes páginas de estado basadas en los nombres de dominio.

<img src="https://user-images.githubusercontent.com/1336778/163301604-1d5f8817-ae64-4e79-b6fc-0a517cc8ab81.png" width="300" />

### Pasos

1.  Si no está utilizando un proxy inverso, debe exponer su Uptime Kuma en el puerto 80.

2.  Si está utilizando un proxy inverso, agregue su nombre de dominio en su proxy inverso y apunte a Uptime Kuma.

    ( ⚠️ PD: Para como Apache o nginx, debe reenviar el encabezado `X-Forward-Host` o `Host` a Uptime Kuma, de lo contrario Uptime Kuma no conoce el nombre de dominio actual)

3.  Agregue un registro A/CNAME para su nombre de dominio en su administración de DNS.

4.  Agregue su nombre de dominio en la barra lateral de configuración de su página de estado.

Este es mi ejemplo, ambos son de la misma instancia:

*   https://status.louislam.net
*   https://status.kuma.pet
