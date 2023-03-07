For Alpine/postmarketOS/Gentoo/Artix, you can create an OpenRC service as
`/etc/init.d/uptime-kuma`:

```sh
#!/sbin/openrc-run

description="Uptime Kuma self-hosted monitoring tool"

# Change $directory to path to uptime-kuma
directory=${directory:-/usr/share/uptime-kuma}
pidfile=${pidfile:-/run/$RC_SVCNAME.pid}

log_dir="/var/log/$RC_SVCNAME"
logfile=${logfile:-$log_dir/$RC_SVCNAME.log}
output_log="${output_log:-$logfile}"
error_log="${error_log:-$logfile}"

command=${command:-/usr/bin/node}
command_args="$directory/server/server.js"
command_user=${command_user:-uptime-kuma:uptime-kuma}
command_background=true

depend() {
	need net
}

start_pre() {
	checkpath --owner=$command_user --directory $log_dir \
						    $directory/data \
						    $directory/data/upload
	checkpath --owner=$command_user --file $logfile \
					       $directory/data/error.log

	[ ! -e $directory/data/kuma.db ] &&
	cp $directory/db/kuma.db $directory/data/

	checkpath --owner=$command_user --mode 600 --file $directory/data/kuma.db*
}

start_post() {
	# Wait for the server to be started
	sleep 10
}
```

Set the script to executable.

```sh
sudo chmod 755 /etc/init.d/uptime-kuma
```

Create a user and group `uptime-kuma:uptime-kuma` for the service.

```sh
sudo addgroup -S uptime-kuma
sudo adduser -S -D -h /var/lib/uptime-kuma -s /sbin/nologin -G uptime-kuma -g uptime-kuma uptime-kuma
```

Start the service and add it to default runlevel if preferred.

```sh
sudo rc-service uptime-kuma start
sudo rc-update add uptime-kuma
```
