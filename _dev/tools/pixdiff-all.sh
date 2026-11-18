#!/bin/bash
# Pixel-compare every designed page with its theme preview at 1440 and 390.
cd "$(dirname "$0")"
for pair in "index index" "services page.services" "insurance page.insurance" "enterprise page.enterprise" "student-discount page.student-discount" "reviews page.reviews" "new-orleans page.location" "merchandise collection"; do
  set -- $pair
  for w in ${WIDTHS:-1440 390}; do
    echo "== $1 @$w: $(node pixdiff.mjs http://localhost:8787/design/$1.html http://localhost:8787/$2.html $w --save=../shots/diff2 2>&1 | grep -E "differing ([1-9]|[0-9]{2})\.|worst|height" | tr "\n" " ")"
  done
done
