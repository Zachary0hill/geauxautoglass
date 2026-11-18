#!/usr/bin/env python3
"""Regenerate config/settings_data.json 'current' from settings_schema.json defaults.
Run after adding theme settings:  python3 _dev/tools/sync-settings.py"""
import json, sys
from pathlib import Path
root = Path(__file__).resolve().parents[2]
schema = json.loads((root / "config/settings_schema.json").read_text())
defaults = {}
name = "Default"
for g in schema:
    if g.get("name") == "theme_info":
        name = g.get("theme_name", name)
    for x in g.get("settings", []):
        if "id" in x:
            d = x.get("default", "" if x["type"] in ("text", "textarea", "url", "richtext") else None)
            if d is not None:
                defaults[x["id"]] = d
p = root / "config/settings_data.json"
raw = p.read_text()
head = ""
if raw.lstrip().startswith("/*"):
    head, raw = raw.split("*/", 1)
    head += "*/\n"
data = json.loads(raw)
cur = data.get("current", {}) if isinstance(data.get("current"), dict) else {}
keep = {k: v for k, v in cur.items() if k in ("sections", "content_for_index")}
data["current"] = {**defaults, "sections": keep.get("sections", {"cart-drawer": {"type": "cart-drawer", "settings": {}}}), "content_for_index": keep.get("content_for_index", [])}
data["presets"] = {name: defaults}
p.write_text(head + json.dumps(data, indent=2, ensure_ascii=False) + "\n")
print(f"settings_data.json: {len(defaults)} settings")
