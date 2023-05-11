# Passing metrics to other platforms

If you already use [Prometheus.io](https://prometheus.io) or a platform that supports Prometheus exporter format, you can get the metrics about each monitoring target from `http://<your.installation>:<your_port>/metrics`.

Labels to filter by include:

| Label Name | Description |
|------------|-------------|
|monitor_name| The "Friendly Name" of the monitor |
|monitor_type| The type (HTTP, keyword, TCP) of monitoring check |
|monitor_url | The URL to be monitored (HTTP, keyword)
|monitor_hostname | The Hostname to be monitored (TCP) |
|monitor_port | The port to be monitored (TCP) |

# Prometheus Configuration

Put the following into your Prometheus config:

```
  - job_name: 'uptime'
    scrape_interval: 30s
    scheme: http
    metrics_path: '/metrics'
    static_configs:
      - targets: ['uptime-kuma.url']
    basic_auth: # Only needed if authentication is enabled (default) 
      username: <your user>
      password: <your password>
```

You should see the `monitor_response_time` and `monitor_status` metrics showing up in Prometheus

There is also a [Grafana Dashboard](https://grafana.com/grafana/dashboards/14847) available to import into your Grafana installation to get the metrics integrated with your other monitoring tools.

# Example PromQL queries

Assuming we have HTTP monitors in place for bbc.co.uk and google.com:

```
# Show all response rates gouped by site
sum(monitor_response_time) by (monitor_name)
# Show only the response time for BBC.co.uk
sum(monitor_reponse_time{monitor_url="https://www.bbc.co.uk/"})
# Show the current status of Google.com
monitor_status{monitor_name="Google"}
```
