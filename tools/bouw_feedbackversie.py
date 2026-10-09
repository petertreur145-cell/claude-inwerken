#!/usr/bin/env python3
"""Bouwt de feedbackversie van Claude inwerken.

Neemt claude-inwerken.html en voegt de feedbacklaag uit feedback/ toe. De app zelf blijft gelijk.

    python3 tools/bouw_feedbackversie.py                 # -> claude-inwerken-feedback.html
    python3 tools/bouw_feedbackversie.py --artifact UIT  # zelfde inhoud zonder <html>/<head>/<body>,
                                                         #    om als artifact op claude.ai te publiceren

Draai dit opnieuw na elke wijziging in claude-inwerken.html of feedback/.
"""
import argparse
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
TITLE = "Claude inwerken feedbackversie"


def build() -> str:
    html = (ROOT / "claude-inwerken.html").read_text(encoding="utf-8")
    css = (ROOT / "feedback" / "feedback.css").read_text(encoding="utf-8")
    js = (ROOT / "feedback" / "feedback.js").read_text(encoding="utf-8")

    # De CSP van de offline app blokkeert de koppeling met claude.ai; de feedbackversie heeft die nodig.
    html, n = re.subn(r'<meta http-equiv="Content-Security-Policy"[^>]*>\n?', "", html)
    assert n == 1, "CSP-regel niet gevonden"
    html, n = re.subn(r"<title>[^<]*</title>", f"<title>{TITLE}</title>", html, count=1)
    assert n == 1, "<title> niet gevonden"

    head_end = html.index("</head>")
    html = html[:head_end] + f"<style>\n{css}</style>\n" + html[head_end:]
    body_end = html.rindex("</body>")
    html = html[:body_end] + f"<script>\n{js}</script>\n" + html[body_end:]
    return html


def as_fragment(html: str) -> str:
    """Zonder documentskelet: claude.ai zet zelf <!doctype>, <head> en <body> eromheen."""
    head = html[html.index("<head>") + 6 : html.index("</head>")]
    body = html[html.index("<body>") + 6 : html.rindex("</body>")]
    head = re.sub(r"<meta [^>]*>\n?", "", head)
    title = re.search(r"<title>.*?</title>\n?", head).group(0)
    head = head.replace(title, "")
    return title + head.strip() + "\n" + body.strip() + "\n"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--artifact", metavar="UIT", help="schrijf ook een artifact-versie naar dit pad")
    args = ap.parse_args()

    html = build()
    out = ROOT / "claude-inwerken-feedback.html"
    out.write_text(html, encoding="utf-8")
    print(f"{out.relative_to(ROOT)}  ({len(html.encode()) // 1024} KB)")
    if args.artifact:
        frag = as_fragment(html)
        pathlib.Path(args.artifact).write_text(frag, encoding="utf-8")
        print(f"{args.artifact}  ({len(frag.encode()) // 1024} KB)")


if __name__ == "__main__":
    main()
