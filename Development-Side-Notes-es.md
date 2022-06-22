Solo una nota para algunas trampas y cosas útiles para el desarrollo.

*   la imagen node-bullseye no funciona en Raspberry Pi (armv7), debe degradarse a node-buster.
*   La imagen node-alpine3.13 no funciona en Raspberry Pi (armv7), debe degradarse a alpine 3.12.
*   El dns de docker-alpine en realidad no es estable en algunos sistemas.
*   \[CSS] no usa ninguna fuente de interfaz de usuario del sistema, las fuentes serán diferentes en los idiomas de Windows diferentes
*   \[Prueba unitaria] Vue sugirió Jest, pero qué, no puede ejecutar la prueba en un navegador, es tan estúpido porque no se pueden probar todas las funciones del navegador (localStorage, DOM y más).
