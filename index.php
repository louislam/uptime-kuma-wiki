<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Uptime Kuma Docs</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="description" content="Description">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/docsify/4.12.1/themes/vue.min.css">
    <link rel="icon" type="image/svg+xml" href="beans.svg">
    <link rel="canonical" href="https://<?=$_SERVER["HTTP_HOST"] . (isset($_SERVER["REDIRECT_URL"]) ? $_SERVER["REDIRECT_URL"] : "") ?>/docs/" />
    <style>
        .app-name-link img {
            width: 96px;
            border-radius: 32px;
            padding: 18px;
        }
    </style>
</head>
<body>
<div id="app"></div>
<script>
    window.$docsify = {
        name: 'Uptime Kuma Docs',
        repo: 'https://github.com/louislam/uptime-kuma',
        loadSidebar: true,
        auto2top: true,
        search: 'auto',
        routerMode: 'history',
        executeScript: true,
        logo: 'https://github.com/louislam/uptime-kuma/raw/master/public/icon.svg',
        relativePath: true,
        homepage: "Home.md"
    }
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/docsify/4.12.1/docsify.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/docsify/4.12.1/plugins/search.min.js"></script>
<script src=" https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-typescript.min.js"></script>

</body>
</html>
