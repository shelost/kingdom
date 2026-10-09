#!/bin/sh
# usage: shot.sh <cdp-json> <name>
cd "$(dirname "$0")" && node decode.mjs "$1" "$2.jpg" && rm -f "$1"
