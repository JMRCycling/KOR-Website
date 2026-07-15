#!/usr/bin/env python3
"""Batch-convert a PNG frame sequence to alpha-preserving WebP for ScrollImageSequence.

Usage:
    python3 scripts/compress-scroll-sequence.py <src_dir> <out_dir> [--width 960] [--quality 80]
"""
import argparse
import glob
import os

from PIL import Image


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("src_dir")
    parser.add_argument("out_dir")
    parser.add_argument("--width", type=int, default=960)
    parser.add_argument("--quality", type=int, default=80)
    args = parser.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    frames = sorted(glob.glob(os.path.join(args.src_dir, "frame_*.png")))
    if not frames:
        raise SystemExit(f"No frame_*.png files found in {args.src_dir}")

    for i, path in enumerate(frames):
        im = Image.open(path).convert("RGBA")
        w, h = im.size
        new_h = round(h * (args.width / w))
        im.resize((args.width, new_h), Image.LANCZOS).save(
            os.path.join(args.out_dir, f"frame_{i:04d}.webp"),
            format="WEBP",
            quality=args.quality,
            method=6,
        )
        if i % 50 == 0:
            print(f"{i}/{len(frames)}")

    print(f"done: {len(frames)} frames written to {args.out_dir}")


if __name__ == "__main__":
    main()
