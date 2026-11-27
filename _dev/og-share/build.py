#!/usr/bin/env python3
"""Render the 1200 x 630 link-preview cards into assets/.

  python3 _dev/og-share/build.py            # all cards
  python3 _dev/og-share/build.py chip adas  # only these

Each card: brand logo, red tag, display headline, URL badge, photo on the right.
snippets/meta-tags.liquid picks og-<template suffix>.jpg for service pages and
og-share.jpg everywhere else. Needs Google Chrome; uses sips (macOS) for JPEG.
"""
import subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "assets"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# bg: CSS background position/size for the photo. Square service photos sit on the right.
CARDS = {
    "share": dict(photo="hero.jpg", bg="130px -70px/1250px auto",
                  tag="Serving all of Louisiana", h1="We come<br>to you.", size=104),
    "service-windshield": dict(photo="svc-windshield.jpg", bg="right center/700px auto",
                  tag="Windshield replacement", h1="We come<br>to you.", size=104),
    "service-chip": dict(photo="svc-chip.jpg", bg="right center/700px auto",
                  tag="Windshield chip repair", h1="Fix the chip<br>before it<br>spreads.", size=80),
    "service-back-glass": dict(photo="svc-back.jpg", bg="right center/700px auto",
                  tag="Back glass replacement", h1="A clear<br>rear view.", size=96),
    "service-adas": dict(photo="svc-adas.jpg", bg="right center/700px auto",
                  tag="ADAS recalibration", h1="Cameras<br>that see<br>straight.", size=80),
    "service-door-glass": dict(photo="svc-door.jpg", bg="right center/700px auto",
                  tag="Door glass replacement", h1="Side window,<br>replaced<br>fast.", size=80),
}

def html(c):
    a = ASSETS.as_uri()
    hero = c["photo"] == "hero.jpg"
    fade = ("rgba(10,10,11,1) 0%,rgba(10,10,11,.95) 34%,rgba(10,10,11,.5) 50%,rgba(10,10,11,0) 64%" if hero else
            "rgba(10,10,11,1) 0%,rgba(10,10,11,1) 40%,rgba(10,10,11,.6) 50%,rgba(10,10,11,0) 62%")
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:D;src:url("{a}/display-400.woff2")}}
@font-face{{font-family:T;src:url("{a}/text-var.woff2");font-weight:500 700}}
*{{margin:0;box-sizing:border-box}}
html,body{{width:1200px;height:630px;overflow:hidden;background:#0a0a0b}}
.bg{{position:absolute;inset:0;background:url("{a}/{c['photo']}") {c['bg']} no-repeat}}
.sh{{position:absolute;inset:0;background:linear-gradient(90deg,{fade}),linear-gradient(0deg,rgba(10,10,11,.6) 0%,rgba(10,10,11,0) 28%),linear-gradient(180deg,rgba(10,10,11,.55) 0%,rgba(10,10,11,0) 22%)}}
.c{{position:absolute;left:64px;top:0;bottom:0;width:580px;display:flex;flex-direction:column;justify-content:center}}
.logo{{width:330px;margin-bottom:22px}}
.tag{{align-self:flex-start;background:#e20000;color:#fff;font:400 24px D;text-transform:uppercase;padding:8px 16px 6px;letter-spacing:.01em}}
h1{{font:400 {c['size']}px/.92 D;color:#fff;text-transform:uppercase;margin-top:16px;letter-spacing:-.01em;white-space:nowrap}}
.url{{position:absolute;right:56px;top:52px;font:700 20px T;letter-spacing:.12em;color:#fff;text-transform:uppercase;background:rgba(10,10,11,.6);padding:10px 16px;border-left:4px solid #e20000}}
</style></head><body><div class="bg"></div><div class="sh"></div>
<div class="c"><img class="logo" src="{a}/logo.png">
<span class="tag">{c['tag']}</span><h1>{c['h1']}</h1></div>
<div class="url">geauxautoglass.net</div></body></html>"""

def render(name, c):
    out = ASSETS / f"og-{name}.jpg"
    with tempfile.TemporaryDirectory() as t:
        page, png = Path(t, "card.html"), Path(t, "card.png")
        page.write_text(html(c))
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                        "--allow-file-access-from-files", "--force-device-scale-factor=1",
                        "--window-size=1200,630", f"--screenshot={png}", page.as_uri()],
                       check=True, capture_output=True)
        subprocess.run(["sips", "-s", "format", "jpeg", "-s", "formatOptions", "85",
                        str(png), "--out", str(out)], check=True, capture_output=True)
    print(out.relative_to(ROOT))

for name in sys.argv[1:] or CARDS:
    render(name, CARDS[name])
