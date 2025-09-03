#!/usr/bin/env bash
set -e
export PATH="$PATH:$(pwd)/node_modules/.bin"

http-server -c-1 -p 8080 dist &
chokidar \
    '**/*.{json,html,css,md,js}' \
    -i 'dist/**' -i 'node_modules/**' \
    --debounce 1000 --throttle 3000 \
    -c 'npm run build' &

wait

