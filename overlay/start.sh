#!/bin/bash -e
source ~/.profile
cd /opt/overlay
exec /opt/overlay/node_modules/electron/dist/electron --enable-transparent-visuals main.js
