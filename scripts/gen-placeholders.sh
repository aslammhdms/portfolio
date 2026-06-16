#!/usr/bin/env bash
#
# gen-placeholders.sh — generate on-brand placeholder clips + posters so the
# scroll-scrub engine is fully demonstrable before the real Higgsfield clips
# exist. Procedural dark gradients in the Terminal Ink palette. These are
# committed stand-ins; running scripts/encode-videos.sh on the real exports
# (same filenames) overwrites them with the real clips.
#
# Requires ffmpeg on PATH. Run from the repo root: bash scripts/gen-placeholders.sh

set -euo pipefail

OUT_DIR="public/videos"
SIZE="1280x720"
DUR=8
RATE=30
GOP="-g 1 -keyint_min 1 -sc_threshold 0"

mkdir -p "$OUT_DIR"

# scene | gradient type | c1 (near color) | c2 (far color)
SCENES=(
  "hero|radial|0x1c1750|0x0a0c10"
  "about|linear|0x0c3a34|0x0a0c10"
  "skills|spiral|0x231a5a|0x0a0c10"
  "projects|linear|0x0e3b34|0x0a0c10"
  "contact|radial|0x1a1a55|0x0e3b34"
)

for entry in "${SCENES[@]}"; do
  IFS='|' read -r scene type c1 c2 <<< "$entry"
  echo "generating $scene ..."

  src="gradients=s=${SIZE}:c0=0x0a0c10:c1=${c1}:c2=${c2}:c3=0x0a0c10:type=${type}:nb_colors=4:speed=0.011:duration=${DUR}:rate=${RATE}:seed=7"

  ffmpeg -y -f lavfi -i "$src" -t $DUR \
    -vf "format=yuv420p,gblur=sigma=8" \
    -c:v libx264 -profile:v high -preset medium -crf 28 $GOP \
    -movflags +faststart "$OUT_DIR/${scene}.v1.mp4"

  ffmpeg -y -f lavfi -i "$src" -t $DUR \
    -vf "format=yuv420p,gblur=sigma=8" \
    -c:v libvpx-vp9 -b:v 0 -crf 40 $GOP -row-mt 1 -deadline good -cpu-used 5 \
    "$OUT_DIR/${scene}.v1.webm"

  ffmpeg -y -i "$OUT_DIR/${scene}.v1.mp4" \
    -vf "select=eq(n\,40),scale=${SIZE}" -frames:v 1 \
    "$OUT_DIR/${scene}.poster.webp"
done

echo "done. placeholders written to $OUT_DIR"
