"""Split the two-tone portrait into three alpha masks: knockout, fill (shading) and line.

usage: python split_portrait.py <input.png> <out_dir> [left top size]

The optional crop (in source pixels) frames the head and shoulders so the
face fills the portrait, as on the reference site. The crop may reach past the
image edges; that part comes out empty.

If the input has a transparent background, its alpha is used as the knockout
(clean edges). Otherwise the figure is found by flood-filling the white paper.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

src, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)

img = Image.open(src).convert("RGBA")
has_alpha = np.asarray(img)[..., 3].min() < 255
if len(sys.argv) == 6:
    left, top, side = (int(v) for v in sys.argv[3:6])
    img = img.crop((left, top, left + side, top + side))
size = 900
# Keep the picture's shape (width 900).
img = img.resize((size, round(size * img.height / img.width)), Image.LANCZOS)
rgba = np.asarray(img).astype(np.float32) / 255.0
alpha = rgba[..., 3]
# Read the inks as if printed on white paper.
rgb = rgba[..., :3] * alpha[..., None] + (1.0 - alpha[..., None])
lum = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
dark = 1.0 - lum  # 0 = white paper, ~0.75 = outline ink


def clamp(a):
    return np.clip(a, 0.0, 1.0)


# Outline ink: the deep purple-blue strokes.
line = clamp((dark - 0.42) / 0.18)
# Shading ink: every tint of blue (light to mid); the line layer sits on top.
fill = clamp((dark - 0.04) / 0.22)

# Knockout: everything inside the figure, so stripes don't show through the face.
if has_alpha:
    knock = alpha
else:
    knock = None
ink = dark > 0.05
outside_seed = ~ink
labels, _ = ndimage.label(outside_seed)
border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
outside = np.isin(labels, border[border > 0])
inside = ~outside
inside = ndimage.binary_closing(inside, iterations=4)
inside = ndimage.binary_fill_holes(inside)
inside = ndimage.binary_erosion(inside, iterations=1)
if knock is None:
    knock = ndimage.gaussian_filter(inside.astype(np.float32), 0.8)


def save(alpha, name):
    a = (clamp(alpha) * 255).astype(np.uint8)
    rgba = np.dstack([np.full_like(a, 255)] * 3 + [a])
    Image.fromarray(rgba, "RGBA").save(out / name, optimize=True)


save(knock, "knock.png")
save(fill, "fill.png")
save(line, "line.png")
print("saved to", out)
