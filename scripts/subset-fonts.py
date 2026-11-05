#!/usr/bin/env python3
"""Cut the two tiny, renamed Mona Sans subsets the site ships.

  AM Display  only the glyphs of "Aslam Muhammed", wdth + wght axes kept.
              Inlined as a data: URI in index.html (font-display: block) so the
              LCP heading never waits for a network font.
  AM Figures  0-9, + ~ . , and the en dash (report figures such as "100+", "~90"
              and "2–3", and the project indices in Work).
              Written to public/fonts/am-figures.woff2.

Why renamed: Mona Sans is licensed under the SIL OFL with the Reserved Font
Name "Mona". A modified (subset) version must not use that name, so every name
record except the copyright (name ID 0) is rewritten and checked.

The source is the exact-pinned @fontsource-variable/mona-sans@5.3.0 "standard"
file (wdth + wght). The lockup constants in the CSS (3.595 / 17.909 em) depend on
these exact metrics, so the script refuses to run against any other version.

This is a maintenance tool, not a build step: its outputs are committed and
`npm run build` never needs Python.

Usage (needs fontTools + brotli, e.g. `pip install fonttools brotli`):
    python3 scripts/subset-fonts.py            # write fonts, update index.html, print base64
    python3 scripts/subset-fonts.py --no-inject
"""
from __future__ import annotations

import argparse
import base64
import io
import json
import re
import sys
from pathlib import Path

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
except ImportError:  # pragma: no cover - friendly message for a missing tool
    sys.exit("subset-fonts: needs fontTools and brotli (pip install fonttools brotli)")

ROOT = Path(__file__).resolve().parent.parent
PKG = ROOT / "node_modules" / "@fontsource-variable" / "mona-sans"
SOURCE = PKG / "files" / "mona-sans-latin-standard-normal.woff2"
PINNED_VERSION = "5.3.0"

PUBLIC_FONTS = ROOT / "public" / "fonts"
INDEX_HTML = ROOT / "index.html"
INJECT_START = "<!-- am-display:start -->"
INJECT_END = "<!-- am-display:end -->"

NAME_TEXT = "Aslam Muhammed"
FIGURES_TEXT = "0123456789+~.,\u2013"


def check_source() -> None:
    if not SOURCE.exists():
        sys.exit(f"subset-fonts: {SOURCE} not found. Run `npm ci` first.")
    version = json.loads((PKG / "package.json").read_text())["version"]
    if version != PINNED_VERSION:
        sys.exit(
            f"subset-fonts: expected @fontsource-variable/mona-sans {PINNED_VERSION}, found {version}. "
            "The lockup constants depend on exact metrics; re-measure before changing the version."
        )


def rename(font: TTFont, family: str) -> None:
    """Rewrite every name record except the copyright so 'Mona' never appears."""
    ps_family = family.replace(" ", "")
    fixed = {
        1: family,
        2: "Regular",
        3: f"{font['head'].fontRevision:.3f};{ps_family}-Regular;subset",
        4: family,
        6: f"{ps_family}-Regular",
        16: family,
        17: "Regular",
        21: family,
        22: "Regular",
        25: ps_family,
    }
    table = font["name"]
    for rec in list(table.names):
        if rec.nameID == 0:
            continue  # copyright: must be kept as is
        if rec.nameID in fixed:
            rec.string = fixed[rec.nameID]
            continue
        text = rec.toUnicode()
        text = text.replace("Mona Sans", family).replace("MonaSans", ps_family).replace("Mona", "AM")
        rec.string = text
    # Trademark records (if a future version adds one) would still name the original font.
    table.names = [r for r in table.names if r.nameID != 7]

    leftovers = [
        (r.nameID, r.toUnicode())
        for r in table.names
        if r.nameID != 0 and "mona" in r.toUnicode().lower()
    ]
    if leftovers:
        sys.exit(f"subset-fonts: 'Mona' still present in {family}: {leftovers}")


def cut(text: str, family: str, features: list[str]) -> tuple[bytes, TTFont]:
    # Keep head.modified from the source so the output is byte-for-byte reproducible.
    font = TTFont(SOURCE, recalcTimestamp=False)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = features
    options.name_IDs = ["*"]  # keep all, then rename (instances and STAT refer to them)
    options.name_languages = ["*"]
    options.notdef_outline = True
    options.hinting = False
    options.desubroutinize = True
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    rename(font, family)
    axes = [a.axisTag for a in font["fvar"].axes]
    if axes != ["wdth", "wght"]:
        sys.exit(f"subset-fonts: {family} lost an axis: {axes}")
    font.flavor = "woff2"
    buf = io.BytesIO()
    font.save(buf)
    return buf.getvalue(), font


def font_face_css(b64: str) -> str:
    # unicode-range lists exactly the characters of the name (plus the space), so
    # the face can never be picked for any other text.
    codepoints = sorted({ord(c) for c in NAME_TEXT})
    ranges = ",".join(f"U+{cp:X}" for cp in codepoints)
    return (
        '<style>@font-face{font-family:"AM Display";'
        f"src:url(data:font/woff2;base64,{b64}) format(\"woff2\");"
        "font-weight:200 900;font-stretch:75% 125%;font-style:normal;font-display:block;"
        f"unicode-range:{ranges}}}</style>"
    )


def inject(css: str) -> None:
    html = INDEX_HTML.read_text()
    pattern = re.compile(re.escape(INJECT_START) + r".*?" + re.escape(INJECT_END), re.S)
    if not pattern.search(html):
        sys.exit(f"subset-fonts: markers {INJECT_START} … {INJECT_END} not found in index.html")
    html = pattern.sub(lambda _: f"{INJECT_START}\n    {css}\n    {INJECT_END}", html, count=1)
    INDEX_HTML.write_text(html)


def write_license() -> None:
    licence = (PKG / "LICENSE").read_text()
    header = (
        "AM Display and AM Figures are modified versions (subsets) of Mona Sans 2.000,\n"
        f"taken from @fontsource-variable/mona-sans {PINNED_VERSION}. As the SIL Open Font\n"
        'License requires for a font with the Reserved Font Name "Mona", the modified\n'
        "versions are renamed. The original copyright notice and licence follow.\n\n"
    )
    (PUBLIC_FONTS / "OFL.txt").write_text(header + licence)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--no-inject", action="store_true", help="do not update the inline @font-face in index.html")
    args = parser.parse_args()

    check_source()
    PUBLIC_FONTS.mkdir(parents=True, exist_ok=True)

    display, display_font = cut(NAME_TEXT, "AM Display", ["kern"])
    figures, figures_font = cut(FIGURES_TEXT, "AM Figures", ["kern"])
    (PUBLIC_FONTS / "am-figures.woff2").write_bytes(figures)
    write_license()

    b64 = base64.b64encode(display).decode("ascii")
    if not args.no_inject:
        inject(font_face_css(b64))

    for label, data, font in (("AM Display", display, display_font), ("AM Figures", figures, figures_font)):
        print(
            f"{label}: {len(data):,} B woff2, {len(font.getGlyphOrder())} glyphs, "
            f"axes {[a.axisTag for a in font['fvar'].axes]}",
            file=sys.stderr,
        )
    print(f"AM Display base64: {len(b64):,} chars{' (injected into index.html)' if not args.no_inject else ''}", file=sys.stderr)
    print(b64)


if __name__ == "__main__":
    main()
