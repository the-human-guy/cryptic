#/usr/bin/env bash

newV=$(date +%s)
sed -Ei "s/\?cryptic-version=([0-8a-z])/\\?cryptic\-version\=$newV/g" ./index.html

