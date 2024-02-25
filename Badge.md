(Version >= 1.16.0)

- [Description](#description)
- [Status badge](#status-badge)
- [Ping and uptime badge](#ping-and-uptime-badge)
- [Screenshots](#screenshots)


# Description

Status, ping and uptime badges, generated in node-js, no internet access required (based on [badge-maker](https://www.npmjs.com/package/badge-maker) aka. [shields.io](http://shields.io/))

There are three API endpoints that return an SVG graphic for a given (public) monitor:

**Status** `<kuma-url>/api/badge/:monitorID/status` e.g. `<kuma-url>/api/badge/1/status` returning sth like: ![image](img/badge/148052351-08a5713f-2bdf-4034-ab2a-29c7638cb25c.png)

**Ping** `<kuma-url>/api/badge/:monitorID/ping/:duration` e.g. `<kuma-url>/api/badge/1/ping` returning sth like: ![image](img/badge/148052406-55b55a76-f61b-4a2a-a036-53b557eebc49.png)

**Uptime** `<kuma-url>/api/badge/:monitorID/uptime/:duration` e.g. `<kuma-url>/api/badge/1/uptime/24` returning sth like: ![image](img/badge/147946965-5a706c7f-1efe-4056-b06b-b149904f87b5.png)

# Status badge

There are options to customize the **status** badge's appearance: `upLabel = Up`, `downLabel = Down`, `upColor`, `downColor`:

`<kuma-url>/api/badge/<monitorId>/status?upLabel=<upLabel>&downLabel=<downLabel>` ![image](img/badge/148053756-10d291bc-32d5-4b40-8b93-60ac625d11aa.png)

`<kuma-url>/api/badge/<monitorId>/status?upColor=white&downColor=black` ![image](img/badge/148053850-8817e676-3ed1-44f7-bc9f-f1c02a45d661.png)

# Ping and uptime badge

There are options to customize the **ping** and **uptime** badge's text: `labelPrefix`, `label`, `labelSuffix = h`, `prefix`, `suffix = ms / %`, `color`, `labelColor`:

`<kuma-url>/api/badge/<monitorId>/ping/24?labelPrefix=<labelPrefix>&label=<label>&labelSuffix=<labelSuffix>&prefix=<prefix>&suffix=<suffix>`

![image](img/badge/148053468-fcabedd6-eea0-49e4-84da-6501a006c0d2.png)

`<kuma-url>/api/badge/<monitorId>/uptime/24?labelPrefix=<labelPrefix>&label=<label>&labelSuffix=<labelSuffix>&prefix=<prefix>&suffix=<suffix>`

![image](img/badge/148052864-7cadbc15-6b70-45e2-beb7-9a4ecd3d1809.png)

The given time interval has to be in 'hours', but customizing options allow for a different display: `<kuma-url>/api/badge/1/uptime/720?label=30&labelSuffix=d`

![image](img/badge/147948951-f866b227-8043-4680-99f6-b1e5403e16f6.png)

The default uptime badge's color is based on the uptime percentage:

![image](img/badge/148054071-74bc95a2-5bf5-4a5e-817c-2112f02a4074.png)

but can be overwritten with predefined color or any other color in HEX code:

![image](img/badge/148054134-b58edfd1-bc28-42bd-9f1e-6d7bf8e33efb.png)

See https://shields.io/#colors for predefined colors.

Different badge styles as defined by https://shields.io/#styles are also supported. (thx @throwabird / [comment](https://github.com/louislam/uptime-kuma/pull/1119#issuecomment-1004760533) )

`<kuma-url>/api/badge/<monitorId>/status?style=flat-square`

Use of the following options to enable them: `flat` (default), `flat-square`, `plastic`, `for-the-badge`, `social`: ![image](img/badge/148061538-996e64dc-1c7c-43d4-9dbd-6496fdd6cc47.png)

# Screenshots

![image](img/badge/148055984-207036e3-4536-4db8-9a0e-035ab44cf89c.png)

Source: https://github.com/louislam/uptime-kuma/pull/1119