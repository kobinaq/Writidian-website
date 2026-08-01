"""Matte a soundscape foreground to RGBA matching journaling style.

Usage:
  python scripts/matte_foreground.py <src.png> <dst.png> [--size W H]
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PIL import Image


def luminance_matte(im: Image.Image) -> Image.Image:
    """Fallback: treat near-white / flat backdrop as transparent."""
    rgba = im.convert("RGBA")
    px = rgba.load()
    assert px is not None
    w, h = rgba.size
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            # White / blown sky → transparent; soft falloff for edges
            if lum > 245 and abs(r - g) < 18 and abs(g - b) < 18:
                alpha = 0
            elif lum > 210 and abs(r - g) < 28 and abs(g - b) < 28:
                alpha = int(max(0, min(255, (245 - lum) * 7)))
            else:
                alpha = 255
            px[x, y] = (r, g, b, alpha)
    return rgba


def rembg_matte(im: Image.Image) -> Image.Image:
    from rembg import remove

    return remove(im.convert("RGBA"))


def fit_canvas(im: Image.Image, size: tuple[int, int]) -> Image.Image:
    target_w, target_h = size
    canvas = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    # Cover-fit, center crop
    scale = max(target_w / im.width, target_h / im.height)
    nw, nh = max(1, int(im.width * scale)), max(1, int(im.height * scale))
    resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - target_w) // 2
    top = (nh - target_h) // 2
    cropped = resized.crop((left, top, left + target_w, top + target_h))
    canvas.paste(cropped, (0, 0), cropped)
    return canvas


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("src")
    parser.add_argument("dst")
    parser.add_argument("--size", nargs=2, type=int, default=[1448, 1086])
    parser.add_argument("--method", choices=["rembg", "luma", "auto"], default="auto")
    args = parser.parse_args()

    src = Path(args.src)
    dst = Path(args.dst)
    im = Image.open(src)
    method = args.method

    if method == "auto":
        try:
            out = rembg_matte(im)
            method = "rembg"
        except Exception as exc:  # noqa: BLE001
            print("rembg failed:", exc, file=sys.stderr)
            out = luminance_matte(im)
            method = "luma"
    elif method == "rembg":
        out = rembg_matte(im)
    else:
        out = luminance_matte(im)

    out = fit_canvas(out, (args.size[0], args.size[1]))
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, "PNG")

    a = out.split()[-1].histogram()
    print(
        f"saved {dst} via {method} | transparent={a[0]} opaque={a[255]} "
        f"partial={sum(a[1:255])} size={out.size}"
    )


if __name__ == "__main__":
    main()
