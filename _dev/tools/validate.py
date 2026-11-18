#!/usr/bin/env python3
"""Catch the schema mistakes that make Shopify reject an import or break the editor.

    python3 validate.py <theme-root>        # prints OK or one line per problem, exit 1 on problems

Checks:
  - range settings: default and every stored value on min + n*step, at most 101 steps
  - url settings: default only /collections or /collections/all
  - select settings: default is one of the options
  - settings_data.json "current" holds every theme setting that has a default
  - every section type used in templates/*.json and sections/*-group.json exists
  - JSON in section {% schema %} blocks parses
"""
import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
problems = []


def load(p):
    raw = p.read_text()
    if raw.lstrip().startswith("/*"):
        raw = raw.split("*/", 1)[1]
    return json.loads(raw)


def check_settings(settings, where):
    for s in settings or []:
        t, sid = s.get("type"), s.get("id")
        if t == "range":
            lo, hi, step, d = s["min"], s["max"], s["step"], s.get("default")
            n = (hi - lo) / step
            if abs(n - round(n)) > 1e-9 or round(n) > 101:
                problems.append(f"{where}: range '{sid}' has {n} steps (must be a whole number <= 101)")
            if d is not None and abs(((d - lo) / step) - round((d - lo) / step)) > 1e-9:
                problems.append(f"{where}: range '{sid}' default {d} is off the {lo}+n*{step} grid")
        if t == "url" and "default" in s and s["default"] not in ("/collections", "/collections/all"):
            problems.append(f"{where}: url '{sid}' default {s['default']!r} is not allowed (use type text)")
        if t == "select" and "default" in s and s["default"] not in [o["value"] for o in s.get("options", [])]:
            problems.append(f"{where}: select '{sid}' default {s['default']!r} is not an option")


# theme settings
schema = load(root / "config/settings_schema.json")
ids = set()
ranges = {}
for g in schema:
    check_settings(g.get("settings"), "settings_schema")
    for s in g.get("settings", []):
        if "id" in s and "default" in s:
            ids.add(s["id"])
            if s["type"] == "range":
                ranges[s["id"]] = s
data = load(root / "config/settings_data.json")
current = data.get("current", {})
if isinstance(current, dict):
    missing = sorted(i for i in ids if i not in current)
    if missing:
        problems.append(f"settings_data.json current is missing: {', '.join(missing)}")
    for k, s in ranges.items():
        v = current.get(k)
        if isinstance(v, (int, float)) and abs(((v - s["min"]) / s["step"]) - round((v - s["min"]) / s["step"])) > 1e-9:
            problems.append(f"settings_data.json: {k}={v} is off the range grid")

# section schemas
types = set()
for f in sorted((root / "sections").glob("*.liquid")):
    types.add(f.stem)
    m = re.search(r"{%-?\s*schema\s*-?%}(.*?){%-?\s*endschema\s*-?%}", f.read_text(), re.S)
    if not m:
        continue
    try:
        sch = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        problems.append(f"sections/{f.name}: schema JSON does not parse ({e})")
        continue
    check_settings(sch.get("settings"), f"sections/{f.name}")
    for b in sch.get("blocks", []):
        check_settings(b.get("settings"), f"sections/{f.name} block {b.get('type')}")

# templates and groups reference existing sections
for f in sorted(list((root / "templates").rglob("*.json")) + list((root / "sections").glob("*.json"))):
    try:
        t = load(f)
    except json.JSONDecodeError as e:
        problems.append(f"{f.relative_to(root)}: JSON does not parse ({e})")
        continue
    for key, sec in t.get("sections", {}).items():
        typ = sec.get("type", "")
        if typ.startswith("apps") or typ.startswith("shopify://"):
            continue
        if typ not in types:
            problems.append(f"{f.relative_to(root)}: section '{key}' uses missing type '{typ}'")

if problems:
    print("\n".join(problems))
    sys.exit(1)
print("OK")
