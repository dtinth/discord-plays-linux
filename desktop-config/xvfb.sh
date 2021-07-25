#!/bin/sh

# `-ac -listen tcp` makes Xvfb accept connection from anyone.
exec /usr/bin/Xvfb :1 -screen 0 1280x720x24 -ac -listen tcp
