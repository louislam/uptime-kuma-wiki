# Pasar métricas a otras plataformas

Si ya usas [Prometheus.io](https://prometheus.io) o una plataforma que admita el formato de exportador de Prometheus, puede obtener las métricas sobre cada objetivo de monitoreo de `http://<your.installation>:<your_port>/metrics`.

Las etiquetas por las que se debe filtrar incluyen:

| Nombre de la etiqueta | Descripción |
|------------|-------------|
|monitor_name| El "nombre descriptivo" del monitor |
|monitor_type| El tipo (HTTP, palabra clave, TCP) de comprobación de supervisión |
|monitor_url | La URL que se va a supervisar (HTTP, palabra clave)
|monitor_hostname | El nombre de host que se va a supervisar (TCP) |
|monitor_port | El puerto que se va a supervisar (TCP) |

# Configuración de Prometheus

Coloque lo siguiente en su configuración de Prometheus:

      - job_name: 'uptime'
        scrape_interval: 30s
        scheme: http
        static_configs:
          - targets: ['uptime-kuma.url']
        basic_auth: # Only needed if authentication is enabled (default) 
          username: <your user>
          password: <your password>

Debería ver el `monitor_response_time` y `monitor_status` métricas que aparecen en Prometheus

También hay un [Panel de Control de Grafana](https://grafana.com/grafana/dashboards/14847) disponible para importar en su instalación de Grafana para integrar las métricas con sus otras herramientas de monitoreo.

# Ejemplo de consultas PromQL

Suponiendo que tengamos monitores HTTP en su lugar para bbc.co.uk y google.com:

    # Show all response rates gouped by site
    sum(monitor_response_time) by (monitor_name)
    # Show only the response time for BBC.co.uk
    sum(monitor_reponse_time{monitor_url="https://www.bbc.co.uk/"})
    # Show the current status of Google.com
    monitor_status{monitor_name="Google"}
