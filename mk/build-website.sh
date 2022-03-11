#!/bin/bash
set -e
set -o pipefail

mkdir -p public
tar cJf public/NDNts-NFD-status-page.txz -C dist .

cp dist/* public/
mv public/index.html public/demo.html

echo '<meta http-equiv="refresh" content="0;URL=https://yoursunny.com/p/NDNts/NFD-status-page/">' >public/index.html
