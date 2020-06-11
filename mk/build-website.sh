#!/bin/bash
set -e
set -o pipefail

TARBALL=NDNts-NFD-status-page_$(git describe --match=NeVeRmAtCh --always --abbrev=40 --dirty).txz

mkdir -p public
tar cJf public/$TARBALL -C dist .

cp dist/* public/
mv public/index.html public/demo.html

echo '<meta http-equiv="refresh" content="0;URL=https://yoursunny.com/p/NDNts/NFD-status-page/">' >public/index.html
echo '<meta http-equiv="refresh" content="0;URL='$TARBALL'">' >public/tarball.html
echo $TARBALL >public/tarball.txt
