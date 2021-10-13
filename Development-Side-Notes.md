Just a note for some traps and useful things for development.

- node-bullseye image is not working on Raspberry Pi (armv7), need to downgrade to node-buster.
- node-alpine3.13 image is not working on Raspberry Pi (armv7), need to downgrade to alpine 3.12.
- docker-alpine's dns is actually not stable in some systems.
- [CSS] do not use any system-ui fonts, the fonts will be difference in difference Windows Languages
- [Unit Test] Vue suggested Jest, but what, you cannot run the test in a browser, it is so stupid because all browser functions cannot be tested (localStorage, DOM and more).