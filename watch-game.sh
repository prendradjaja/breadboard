#!/bin/sh
while true; do
  inotifywait -e modify public/js/game.js
  make game.js
done
