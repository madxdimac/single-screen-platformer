"""
process_sprites.py
Processes reference PNG images for the single-screen platformer.
- Finds the white/near-white background (BFS from border pixels)
- Soft-mattes background pixels: alpha fades with brightness and the white is
  un-premultiplied out of edge colours, so sprites have no light halo
- Drops small detached blobs (artist signature, stray ground-shadow specks)
- Auto-crops to character bounds
- Resizes to consistent height (TARGET_H pixels) maintaining aspect ratio
- Encodes as base64 PNG data URL
- Outputs js/sprites_data.js with const SPRITE_DATA = { ... } and SPRITE_META
"""

import os
import base64
import io
from collections import deque
from PIL import Image

# Map from output key -> source filename
SPRITE_MAP = {
    'champion':      'champion_reference.png',
    'ranger':        'ranger_reference.png',
    'savage':        'savage_reference.png',
    'banditThug':    'bandit_thug_reference.png',
    'banditArcher':  'bandit_archer_reference.png',
    'banditBoss':    'bandit_king_reference.png',
    'goblinWarrior': 'goblin_warrior_reference.png',
    'goblinShaman':  'goblin_shaman_reference.png',
    'goblinBoss':    'goblin_warchief_reference.png',
    'orcBrute':      'orc_brute_reference.png',
    'orcArcher':     'orc_archer_reference.png',
    'orcBoss':       'orc_warlord_reference.png',
}

TARGET_H = 128        # target sprite height in pixels
# Distances are max per-channel difference from the paper (border) colour.
MATTE_LO = 9          # at/below this -> fully transparent
MATTE_HI = 50         # at/above this -> fully opaque (and where the flood stops)
HOLE_DIST = 10        # enclosed regions this close to the paper colour...
HOLE_MIN_AREA = 150   # ...and at least this many source pixels are gaps, not highlights
MIN_BLOB_FRAC = 0.01  # keep detached blobs with area >= this fraction of the main body

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR    = os.path.join(SCRIPT_DIR, '..', 'character_references')
OUT_FILE   = os.path.join(SCRIPT_DIR, '..', 'js', 'sprites_data.js')


def _neighbours4(x, y, w, h):
    if x > 0: yield x - 1, y
    if x < w - 1: yield x + 1, y
    if y > 0: yield x, y - 1
    if y < h - 1: yield x, y + 1


def border_colour(img):
    """Median border colour — the paper colour (not always pure white)."""
    w, h = img.size
    px = img.load()
    samples = [px[x, y][:3] for x in range(w) for y in (0, h - 1)]
    samples += [px[x, y][:3] for y in range(h) for x in (0, w - 1)]
    return tuple(sorted(s[c] for s in samples)[len(samples) // 2] for c in range(3))


def remove_background(img):
    """Flood the paper colour from the border and from large enclosed gaps
    (e.g. between legs); soft-matte those pixels against the paper colour."""
    img = img.convert('RGBA')
    w, h = img.size
    px = img.load()
    bg = border_colour(img)

    def dist(p):
        return max(abs(p[0] - bg[0]), abs(p[1] - bg[1]), abs(p[2] - bg[2]))

    # Core paper pixels: very close to the paper colour.
    core = bytearray(w * h)
    for y in range(h):
        for x in range(w):
            p = px[x, y]
            if p[3] < 10 or dist(p) <= HOLE_DIST:
                core[y * w + x] = 1

    # Seeds: core regions touching the border, or enclosed ones big enough to
    # be a gap rather than a highlight/eye-shine.
    seen = bytearray(w * h)
    seeds = []
    for start in range(w * h):
        if not core[start] or seen[start]:
            continue
        seen[start] = 1
        comp, queue, touches = [], deque([start]), False
        while queue:
            i = queue.popleft(); comp.append(i)
            cx, cy = i % w, i // w
            if cx == 0 or cy == 0 or cx == w - 1 or cy == h - 1:
                touches = True
            for nx, ny in _neighbours4(cx, cy, w, h):
                j = ny * w + nx
                if core[j] and not seen[j]:
                    seen[j] = 1; queue.append(j)
        if touches or len(comp) >= HOLE_MIN_AREA:
            seeds.extend(comp)

    # Grow from the seeds over anything paper-ish (anti-aliased edges).
    visited = bytearray(w * h)
    queue = deque(seeds)
    for i in seeds:
        visited[i] = 1
    while queue:
        i = queue.popleft()
        for nx, ny in _neighbours4(i % w, i // w, w, h):
            j = ny * w + nx
            if not visited[j] and dist(px[nx, ny]) <= MATTE_HI:
                visited[j] = 1; queue.append(j)

    # Soft matte: alpha from distance to the paper colour; colour is
    # un-premultiplied against the paper so edges keep their true colour.
    span = MATTE_HI - MATTE_LO
    for y in range(h):
        row = y * w
        for x in range(w):
            if not visited[row + x]:
                continue
            p = px[x, y]
            a = (dist(p) - MATTE_LO) / span
            if a <= 0 or p[3] < 10:
                px[x, y] = (0, 0, 0, 0)
                continue
            a = min(1.0, a)
            px[x, y] = tuple(
                max(0, min(255, round((p[c] - (1 - a) * bg[c]) / a))) for c in range(3)
            ) + (round(a * 255),)
    return img


def drop_small_blobs(img):
    """Label 8-connected opaque regions; clear those much smaller than the body."""
    w, h = img.size
    px = img.load()
    label = [0] * (w * h)
    sizes = {}
    cur = 0
    for y in range(h):
        for x in range(w):
            i = y * w + x
            if label[i] or px[x, y][3] < 64:
                continue
            cur += 1
            label[i] = cur
            queue = deque([(x, y)])
            n = 0
            while queue:
                cx, cy = queue.popleft(); n += 1
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        nx, ny = cx + dx, cy + dy
                        if 0 <= nx < w and 0 <= ny < h:
                            j = ny * w + nx
                            if not label[j] and px[nx, ny][3] >= 64:
                                label[j] = cur; queue.append((nx, ny))
            sizes[cur] = n
    if not sizes:
        return img
    biggest = max(sizes.values())
    keep = {k for k, n in sizes.items() if n >= biggest * MIN_BLOB_FRAC}
    # Faint (alpha < 64) pixels are kept only if they touch a kept region.
    for y in range(h):
        for x in range(w):
            i = y * w + x
            lb = label[i]
            if lb:
                if lb not in keep:
                    px[x, y] = (0, 0, 0, 0)
            elif px[x, y][3]:
                near = False
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and label[ny * w + nx] in keep:
                            near = True
                if not near:
                    px[x, y] = (0, 0, 0, 0)
    return img


def process_sprite(src_path, target_h=TARGET_H):
    img = Image.open(src_path)
    img = remove_background(img)
    img = drop_small_blobs(img)

    # Auto-crop to character bounds
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    # Resize to target height maintaining aspect ratio (premultiplied, so
    # transparent pixels don't bleed dark colour into the edges)
    orig_w, orig_h = img.size
    new_h = target_h
    new_w = max(1, round(orig_w * new_h / orig_h))
    img = img.convert('RGBa').resize((new_w, new_h), Image.LANCZOS).convert('RGBA')

    buf = io.BytesIO()
    img.save(buf, format='PNG', optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode('ascii')
    return f'data:image/png;base64,{b64}', new_w, new_h


def main():
    entries, meta = [], []
    for key, filename in SPRITE_MAP.items():
        src_path = os.path.join(SRC_DIR, filename)
        if not os.path.exists(src_path):
            print(f'  MISSING: {src_path}')
            continue
        print(f'  Processing {key} <- {filename}...')
        data_url, w, h = process_sprite(src_path)
        print(f'    -> {w}x{h}, {len(data_url) // 1024} KB')
        entries.append(f'  {key}: \'{data_url}\'')
        meta.append(f'  {key}: {{ w:{w}, h:{h} }}')

    js = '// Auto-generated by tools/process_sprites.py — do not edit manually\n'
    js += 'const SPRITE_DATA = {\n' + ',\n'.join(entries) + '\n};\n'
    js += 'const SPRITE_META = {\n' + ',\n'.join(meta) + '\n};\n'

    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js)

    total_kb = os.path.getsize(OUT_FILE) // 1024
    print(f'\nWrote {OUT_FILE} ({total_kb} KB, {len(entries)} sprites)')


if __name__ == '__main__':
    main()
