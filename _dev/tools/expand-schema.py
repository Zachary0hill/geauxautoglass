#!/usr/bin/env python3
"""Expand shared option lists in section schemas. Sections are authored with
"options": "@actions" / "@photos"; Shopify needs the full arrays. Idempotent.
    python3 _dev/tools/expand-schema.py"""
import json, re
from pathlib import Path
root = Path(__file__).resolve().parents[2]
LISTS = {
  "@actions": [("quote","Quote form"),("call_lafayette","Call Lafayette"),("call_new_orleans","Call New Orleans"),("text_lafayette","Text Lafayette"),("email","Email"),("enterprise_email","Enterprise email"),("enterprise_form","Enterprise claim form"),("enterprise_photo","Enterprise photo upload"),("shop","Merchandise (all products)"),("google_lafayette","Google, Lafayette"),("google_new_orleans","Google, New Orleans"),("custom","Custom link (below)")],
  "@photos": [("none","None"),("hero","Vans at the Lafayette shop"),("trust","Technicians lifting a windshield"),("svc-windshield","Windshield going on a Ford"),("svc-chip","Star chip close up"),("svc-back","Tesla, back glass out"),("svc-adas","ADAS targets"),("svc-door","Shattered door glass"),("svc-fleet","Sprinter van in the shop"),("svc-mobile","Black van outside the shop"),("bleed-insurance","Windshield on a red SUV"),("story","Fleet outside the storefront"),("loc-lafayette","Lafayette shop front"),("loc-kenner","Kenner shop entrance"),("loc-nola-van","New Orleans van"),("ba-before","Jeep, glass out"),("ba-after","Jeep, glass in")],
}
n = 0
for f in sorted((root / "sections").glob("*.liquid")):
    s = f.read_text()
    for key, opts in LISTS.items():
        arr = "[" + ", ".join(json.dumps({"value": v, "label": l}) for v, l in opts) + "]"
        t = s.replace(f'"options": "{key}"', f'"options": {arr}')
        if t != s:
            n += 1; s = t
    f.write_text(s)
print(f"expanded {n} lists")
