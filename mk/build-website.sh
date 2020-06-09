#!/bin/bash
set -e
set -o pipefail

TARBALL=NDNts-NFD-status-page_$(git describe --match=NeVeRmAtCh --always --abbrev=40 --dirty).txz

mkdir -p public
tar cJf public/$TARBALL -C dist .

cp dist/* public/
mv public/index.html public/demo.html

cp src/favicon.ico src/style.css public/
sed 's/TARBALL/'$TARBALL'/' mk/website-index.html > public/index.html
