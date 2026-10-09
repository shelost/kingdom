#!/bin/sh
# usage: snap.sh <name> — decodes the newest CDP screenshot response into v2/<name>.jpg
cd "$(dirname "$0")"
f=$(ls -t /Users/heewon/.cursor/browser-logs/cdp-response-Page.captureScreenshot-*.json | head -1)
node decode.mjs "$f" "v2/$1.jpg" && rm -f "$f"
