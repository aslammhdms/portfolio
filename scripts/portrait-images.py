#!/usr/bin/env python3
"""Resize public/images/aslam.jpg into the hero portrait derivatives.

  aslam-620.{webp,jpg}   desktop portrait at 1x (the frame is about 310 px wide)
  aslam-1240.{webp,jpg}  desktop portrait at 2x
  aslam-128.webp         the 64 x 80 phone thumbnail at 2x
  aslam-256.webp         the same thumbnail at 3x (phones with a 3x screen)

The aspect ratio of the source is kept; the page crops with object-fit: cover and
object-position: 50% 30%. Outputs are committed, so the build never needs Python.

Usage (needs Pillow): python3 scripts/portrait-images.py
"""
from __future__ import annotations

import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover
    sys.exit("portrait-images: needs Pillow (pip install pillow)")

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "public" / "images" / "aslam.jpg"
OUT = ROOT / "public" / "images"


def main() -> None:
    src = ImageOps.exif_transpose(Image.open(SOURCE)).convert("RGB")
    for width, formats in ((620, ("webp", "jpg")), (1240, ("webp", "jpg")), (128, ("webp",)), (256, ("webp",))):
        height = round(src.height * width / src.width)
        img = src.resize((width, height), Image.Resampling.LANCZOS)
        for fmt in formats:
            path = OUT / f"aslam-{width}.{fmt}"
            if fmt == "webp":
                img.save(path, "WEBP", quality=80, method=6)
            else:
                img.save(path, "JPEG", quality=82, optimize=True, progressive=True)
            print(f"{path.relative_to(ROOT)}: {width}x{height}, {path.stat().st_size:,} B")


if __name__ == "__main__":
    main()
