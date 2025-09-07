(Version >= 1.18.0)

## If you are running Uptime Kuma Docker

By default, a docker container is self-contained, which means Uptime Kuma cannot access your host. You need to bind the /var/run/docker.sock to your container.

### (Method 1) Share docker.sock with Uptime Kuma Container

Command argument:

```bash
-v /var/run/docker.sock:/var/run/docker.sock
```

docker-compose:

```yml
volumes:
    - /var/run/docker.sock:/var/run/docker.sock
```

### (Method 2) TCP - Bridge Mode

**Expose TCP port**\
To enable TCP monitoring, you need to first expose the Docker daemon on a TCP port. The primary documentation is available [here](https://docs.docker.com/config/daemon/) but the example below provides some quick options.

Update the daemon configuration located at `/etc/docker/daemon.json`:

```json
{
   #any additional parameters should be kept

   #Insecure option, only use this if you are running on a closed network
   "tls": false,
   "hosts": ["unix:///var/run/docker.sock", "tcp://<host IP address>:2375"]

   #Secure option
   "tls": true,
   "tlscacert": "/var/docker/ca.pem",
   "tlscert": "/var/docker/server.pem",
   "tlskey": "/var/docker/serverkey.pem",
   "hosts": ["unix:///var/run/docker.sock", "tcp://<host IP address>:2376"]
}
```

Restart the daemon using `sudo systemctl restart docker.service`.

If the daemon fails to start, it may be because there are duplicate keys, in this case hosts, -H, that is already part of the daemon configuration.

You can edit the startup configuration using `sudo systemctl edit docker.service`.

```toml
[Service]
#The blank ExecStart is required to clear the current entry point
ExecStart=
#Replace the existing ExecStart but only remove the properties that you have added into the daemon.json file, leave all else the same.
ExecStart=/usr/bin/dockerd --containerd=/run/containerd/containerd.sock
```

My original ExecStart was: `ExecStart=/usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock`, note the -H that would cause a duplicate property error.

> [!NOTE]
> If you installed docker using snap

Snap stores the `daemon.json` here: `/var/snap/docker/current/config/daemon.json`

use `sudo nano /var/snap/docker/current/config/daemon.json` to edit the file like

```diff
{
    "log-level":        "error",
    "storage-driver":   "overlay2",
+   "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
}
```

- Restart the service using `sudo systemctl restart snap.docker.dockerd.service`
- Check if the service is running using `sudo systemctl status snap.docker.dockerd.service`

The service should be running as usual, showing the docker snap service

![Screenshot showing the snap docker service working](https://github.com/louislam/uptime-kuma/assets/642149/8494c876-5580-4f87-9ceb-9a5974f1c977)

**Update uptime-kuma**\
Add a new Docker host and choose TCP as the option. Specify the IP address of the host and the TCP port you exposed, as seen below.

![Docker host monitor](img/docker-host.png)

**Configuring certificates for Docker TLS connection**

Assuming you have already properly configured your remote docker instance to listen securely for TLS connections as detailed [here](https://docs.docker.com/engine/security/protect-access/#use-tls-https-to-protect-the-docker-daemon-socket), you must configure Uptime-Kuma to use the certificates you've generated. The base path where certificates are looked for can be set with the `DOCKER_TLS_DIR_PATH` environmental variable or defaults to `data/docker-tls/`.

For running uptime-kuma inside docker, mount the parent directory to `/app/data/docker-tls`.

```
-v /docker-cert:/app/data/docker-tls
```

If a directory in this path exists with a name matching the FQDN of the docker host (e.g. the FQDN of `https://example.com:2376` is `example.com` so the directory `data/docker-tls/example.com/` would be searched for certificate files), then `ca.pem`, `key.pem` and `cert.pem` files are loaded and included in the agent options. File names can also be overridden via `DOCKER_TLS_FILE_NAME_(CA|KEY|CERT)`.

## Related Discussion

- https://github.com/louislam/uptime-kuma/issues/2061
