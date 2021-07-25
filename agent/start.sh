#!/bin/bash -e
source ~/.profile
cd /opt/agent
exec /opt/agent/node_modules/electron/dist/electron --enable-transparent-visuals main.js
