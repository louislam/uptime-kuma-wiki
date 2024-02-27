(Version >= 1.16.0)
With https://github.com/louislam/uptime-kuma/pull/1119

- [Description](#description)
- [Open Badge Generator](#open-badge-generator)
- [Badge Type Options](#badge-type-options)
  - [Status badge](#status-badge)
  - [Ping, uptime, avg-response and response badge](#ping-uptime-avg-response-and-response-badge)
    - [Badge Duration at ping, uptime and avg-response](#badge-duration-at-ping-uptime-and-avg-response)
  - [Certificate Expire badge](#certificate-expire-badge)
- [Badge Styles](#badge-styles)


# Description

`status`, `ping`, `uptime`, `avg-response`, `cert-exp` and `response`-badges are generated locally.
The server does this for all monitors which have been added to status pages and have thus been published.
The design is based on [badge-maker](https://www.npmjs.com/package/badge-maker) aka. [shields.io](http://shields.io/).

These are the endpoints that return an SVG graphic for a given (public) monitor:

| Badge Type     | URL scheme                                              | URL example                           | Graphic example                              |
|----------------|---------------------------------------------------------|---------------------------------------|----------------------------------------------|
| `status`       | `<kuma-url>/api/badge/:monitorID/status`                | `<kuma-url>/api/badge/1/status`       | ![image](img/badge/status-example.png)       |
| `uptime`       | `<kuma-url>/api/badge/:monitorID/uptime:duration`       | `<kuma-url>/api/badge/1/uptime`       | ![image](img/badge/uptime-example.png)       |
| `ping`         | `<kuma-url>/api/badge/:monitorID/ping:duration`         | `<kuma-url>/api/badge/1/ping`         | ![image](img/badge/ping-example.png)         |
| `avg-response` | `<kuma-url>/api/badge/:monitorID/avg-response:duration` | `<kuma-url>/api/badge/1/avg-response` | ![image](img/badge/avg-response-example.png) |
| `cert-exp`     | `<kuma-url>/api/badge/:monitorID/cert-exp`              | `<kuma-url>/api/badge/1/cert-exp`     | ![image](img/badge/cert-exp-example.png)     |
| `response`     | `<kuma-url>/api/badge/:monitorID/response`              | `<kuma-url>/api/badge/1/response`     | ![image](img/badge/response-example.png)     |

# Open Badge Generator

> [!TIP]
> We have an Badge Generator integrated which makes this configuration more interactive.
> 
> You can use said generator via: 
> - navigating to a status page in edit mode
> - <details><summary>Clicking on the settings icon</summary>
>   <p>
>   
>   ![image](img/badge/settings-button.png)
>   
>   </p>
>   </details>
> - <details><summary>Clicking on the <code>Open Badge Maker</code>-button</summary>
>   <p>
>   
>   ![image](img/badge/settings.png)
>   
>   </p>
>   </details>
> - <details><summary>filling out the form to create your own badge</summary>
>   <p>
>   
>   ![image](img/badge/open-badge-generator.png)
>   
>   </p>
>   </details>

# Badge Type Options

## Status badge

There are options to customize the **status** badge's appearance: 
- `upLabel`,Default value: Up
- `downLabel`, Default value: Down
- `upColor` 
- `downColor`

**Example**

`<kuma-url>/api/badge/<monitorId>/status?upLabel=<upLabel>&downLabel=<downLabel>` ![image](img/badge/status-label.png)

`<kuma-url>/api/badge/<monitorId>/status?upColor=white&downColor=black` ![image](img/badge/status-bw.png)

## Ping, uptime, avg-response and response badge

There are options to customize the **ping**, **uptime**, **avg-response** and **response** badge's text:
- `labelPrefix`
- `label`
- `labelSuffix`, Default: value: uptime, ping & avg-response 	image= `h`
- `prefix`
- `suffix`, Default value: uptime= `%`, ping, avg-response & response= `ms`
- `color`
- `labelColor`

**Example**

`<kuma-url>/api/badge/<monitorId>/ping/24?labelPrefix=<labelPrefix>&label=<label>&labelSuffix=<labelSuffix>&prefix=<prefix>&suffix=<suffix>`

![image](img/badge/ping-label.png)

`<kuma-url>/api/badge/<monitorId>/uptime/24?labelPrefix=<labelPrefix>&label=<label>&labelSuffix=<labelSuffix>&prefix=<prefix>&suffix=<suffix>`

![image](img/badge/uptime-label.png)

`<kuma-url>/api/badge/<monitorId>/avg-response/24?labelPrefix=<labelPrefix>&label=<label>&labelSuffix=<labelSuffix>&prefix=<prefix>&suffix=<suffix>`

The default uptime badge's color is based on the uptime percentage:

![image](img/badge/uptime-color.png)

but can be overwritten with predefined color or any other color in HEX code:

![image](img/badge/custom-colours.png)

See https://www.npmjs.com/package/badge-maker#colors for predefined colors.

### Badge Duration at ping, uptime and avg-response

The given time interval at `Badge Duration (in hours)` has to be in 'hours', but customizing options allow for a different display: 

`<kuma-url>/api/badge/1/uptime/720?label=30&labelSuffix=d`

![image](img/badge/duration.png)

## Certificate Expire badge

There are the same options like **ping**, **uptime** and **avg-response** and additional to customize the **cert-exp** badge's text: 
- `upColor`
- `downColor` 
- `warnDays` 
- `downDays`

# Badge Styles

The different badge styles as defined by https://shields.io/#styles. (thx @throwabird / [comment](https://github.com/louislam/uptime-kuma/pull/1119#issuecomment-1004760533) )

- `flat` (default)
- `flat-square`
- `plastic`
- `for-the-badge`
- `social`

**Example**

`<kuma-url>/api/badge/<monitorId>/status?style=flat-square`

![image](img/badge/badge-style.png)
