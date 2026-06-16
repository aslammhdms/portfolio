#!/usr/bin/env bash
#
# encode-videos.sh — turn raw Higgsfield exports into seek-optimized web clips.
#
# Higgsfield exports are long-GOP "delivery" MP4s that seek (scrub) badly. This
# re-encodes them ALL-KEYFRAME so every scroll position lands on a decodable
# frame, fronts the moov atom for fast/range loading, strips audio, and emits a
# WebM sibling + a WebP poster.
#
# Usage:
#   1. Put the raw exports in public/videos/src/ named <scene>_raw.mp4
#      scenes: hero about skills projects contact
#   2. From the repo root:  bash scripts/encode-videos.sh
#   3. Bump the version in src/scenes/clips.ts (v1 -> v2) if you re-export.
#
# Requires ffmpeg on PATH.

set -euo pipefail

SRC_DIR="public/videos/src"
OUT_DIR="public/videos"
SCENES=(hero about skills projects contact)

# Target height (use 720 to shave bytes; 1080 for the hero if you want it crisp).
HEIGHT=1080
# -g 1 = every frame a keyframe (smoothest scrub, biggest file).
# If clips get too large, switch to: GOP="-g 10 -keyint_min 10"
GOP="-g 1 -keyint_min 1"

mkdir -p "$OUT_DIR"

for scene in "${SCENES[@]}"; do
  raw="$SRC_DIR/${scene}_raw.mp4"
  if [[ ! -f "$raw" ]]; then
    echo "skip: $raw not found"
    continue
  fi
  echo "encoding $scene ..."

  # MP4 — all-keyframe H.264 + faststart
  ffmpeg -y -i "$raw" -an \
    -vf "scale=-2:${HEIGHT}:flags=lanczos,format=yuv420p" \
    -c:v libx264 -profile:v high -preset slow -crf 23 $GOP -sc_threshold 0 \
    -movflags +faststart "$OUT_DIR/${scene}.v1.mp4"

  # WebM — VP9 sibling
  ffmpeg -y -i "$raw" -an \
    -vf "scale=-2:${HEIGHT}:flags=lanczos,format=yuv420p" \
    -c:v libvpx-vp9 -b:v 0 -crf 32 $GOP -row-mt 1 -deadline good \
    "$OUT_DIR/${scene}.v1.webm"

  # Poster — a representative mid frame
  ffmpeg -y -i "$OUT_DIR/${scene}.v1.mp4" \
    -vf "select=eq(n\,30),scale=-2:${HEIGHT}" -frames:v 1 \
    "$OUT_DIR/${scene}.poster.webp"
done

echo "done. clips written to $OUT_DIR"
