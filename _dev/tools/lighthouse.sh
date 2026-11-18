#!/usr/bin/env bash
# Lighthouse mobile scores for preview pages, served with compression the way
# Shopify's CDN serves them. Usage: ./lighthouse.sh index product collection cart
set -euo pipefail
cd "$(dirname "$0")/../preview"
npx --yes serve@14.2.4 -l 8788 . >/dev/null 2>&1 & SERVE=$!
trap 'kill $SERVE 2>/dev/null' EXIT
sleep 3
OUT=$(mktemp -d)
for t in "$@"; do
  CHROME_PATH="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}" npx --yes lighthouse@12.2.1 "http://localhost:8788/$t" --quiet --chrome-flags="--headless=new" \
    --only-categories=performance,accessibility,best-practices,seo --output=json --output-path="$OUT/$t.json" >/dev/null 2>&1 || true
  node -e "const r=require('$OUT/$t.json');const c=r.categories,a=r.audits;console.log('$t',Object.fromEntries(Object.entries(c).map(([k,v])=>[k,Math.round(v.score*100)])),'LCP',a['largest-contentful-paint'].displayValue,'CLS',a['cumulative-layout-shift'].displayValue)"
done
