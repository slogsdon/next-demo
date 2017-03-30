#!/bin/bash -e

ADDR=${ADDR:-'http://localhost:3000'}
DEST=${DEST:-'dist'}
PAGES_DIR=${PAGES_DIR:-'pages'}

echo "clearing destination..."
rm -rf "$DEST"

echo "starting server..."
npm run build 2>&1 > /dev/null
npm run start 2>&1 > /dev/null &

echo "downloading static assets..."
wget --html-extension \
     --recursive \
     --convert-links \
     --page-requisites \
     --no-parent \
     --directory-prefix "$DEST" \
     --no-host-directories \
     --restrict-file-names=unix \
     --retry-connrefused \
     --quiet \
     --waitretry 2 \
     --tries 5 \
     -i <(find "$PAGES_DIR" -type f | \
              sed "s:^$PAGES_DIR\(.*\)\.js\$:\1:g" | \
              sed 's:/index$:/:g' | \
              sed "s,\(.*\),$ADDR\1,g")

echo "closing server..."
killall node 2>&1 > /dev/null
wait

echo "done"
