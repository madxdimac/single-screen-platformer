# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

Open `index.html` directly in a browser — no build step required. The file is fully self-contained: CSS, all game JS, and all sprite image data are inlined (~266KB).

If a local server is preferred: `python -m http.server 8080` then visit `http://localhost:8080`.

## Sprite Pipeline

Character and enemy sprites are pre-processed PNG images embedded as base64 data URLs.

1. **Source images**: `character_references/*.png` (12 files)
2. **Processing**: `python3 tools/process_sprites.py` — detects the paper colour from the image border, flood-fills it from the border and from large enclosed gaps (e.g. between legs), soft-mattes edges against the paper colour (no white halo), drops small detached blobs (signatures), auto-crops, resizes to 128px tall → writes `js/sprites_data.js` (`SPRITE_DATA` data URLs + `SPRITE_META` sizes). Pure Pillow, no numpy.
3. **Embedding**: after changing sprites or `bundle.js`, rebuild `index.html` with `python3 tools/build_html.py` (replaces the `<script>` block with `sprites_data.js` + `bundle.js`). The `<style>` block in `index.html` is not regenerated — keep it in sync with `css/style.css` by hand.

Sprite keys in `SPRITE_DATA` match entity `enemyId` / player `charId` fields exactly: `champion`, `ranger`, `savage`, `banditThug`, `banditArcher`, `banditBoss`, `goblinWarrior`, `goblinShaman`, `goblinBoss`, `orcBrute`, `orcArcher`, `orcBoss`.

## Architecture

All game logic is inlined inside the `<script>` tag in **`index.html`**, which also contains the CSS. `index.html` begins with `SPRITE_DATA` (from `js/sprites_data.js`) followed by the full game code (from **`js/bundle.js`**). When editing game logic, **edit `js/bundle.js`** then rebuild `index.html` as above. The individual source files under `js/entities/`, `js/systems/`, `js/data/` are the modular originals but are **not loaded by the browser**.

### Class dependency order in bundle.js / index.html script block

0. `SPRITE_DATA` (injected from `js/sprites_data.js` — base64 PNG data URLs, defined before all classes)
1. `Colors` (palette constants)
2. `CharacterDefs`, `EnemyDefs`/`BossDefs`, `StageDefs` (frozen data objects)
3. `Entity` → `Platform`, `Projectile`, `Player` → `Champion`/`Ranger`/`Savage`
4. `Enemy` → `BanditThug`, `BanditArcher`, `GoblinWarrior`, `GoblinShaman`, `OrcBrute`, `OrcArcher`, `Boss`
5. `InputManager`, `PhysicsEngine`
6. `AttackSystem`, `AISystem`, `HUDSystem`, `Renderer`
7. `StageManager`, `Game`
8. Bootstrap (`DOMContentLoaded`)

### Game loop (Game.init)

`rAF → input.snapshot() → _update(dt) → _render()`

`dt` is capped at 50ms to prevent physics spirals.

### State machine

`CHARACTER_SELECT → PLAYING ↔ STAGE_CLEAR → PLAYING` (loops), `PLAYING → GAME_OVER → CHARACTER_SELECT`

### Key design patterns

- **Renderer** tries sprite rendering first via `_drawActor(entity, key, opts)`, falling back to procedural shape drawing. Sprites are loaded async in `_initSprites()` and cached as outlined canvases (`_sprites`) plus white silhouettes for hit flashes (`_flash`). Sprites are drawn at their natural aspect, `Renderer.VISUAL_SCALE` × hitbox height, feet anchored to the hitbox bottom — visuals are deliberately decoupled from physics hitboxes. Animation (idle breathing, run bob/lean, jump stretch, landing squash, attack lunge, dash lean) is procedural transforms driven by entity state; per-entity anim state lives in a `WeakMap`.
- **Resolution**: `Renderer.setDisplaySize(cssW, cssH)` sizes the canvas backing store to display size × devicePixelRatio and sets a transform so all drawing stays in 800×500 logical coordinates. Never assign `canvas.width/height` or `canvas.style` size elsewhere.
- **World art**: per-faction backdrops (`_buildBackdrop`), platforms (`_paintGround` / `_paintPlank`) and the vignette are painted once into offscreen canvases (seeded RNG, so they're stable) and invalidated on resize; only lights and particles (`_drawAmbient`) animate per frame.
- **AttackSystem** owns all hitbox resolution. Entities signal intent via `_pendingAttack` / `_pendingSpecial` / `_pendingAOE` flags that AttackSystem consumes each frame. Hitboxes use a `hitEntities` Set to prevent double-hits.
- **PhysicsEngine** handles gravity + AABB. One-way platforms resolve only downward passes (`prevBottom <= platform.top + 2`). `entity.ignorePlatform` flag (300ms) enables drop-through.
- **AISystem** drives enemies each frame; enemies expose `_pendingAttack` for AttackSystem to resolve.
- **StageManager** maintains a shuffled spawn queue, enforces `maxConcurrent` enemies, and triggers boss spawn at 80% of normal enemies defeated.
- Difficulty scales per stage N: `totalEnemies = 8 + (N-1)*2`, `maxConcurrent = 2 + (N-1)`, speed/damage mod `= min(2.0, 1 + (N-1)*0.05)`. Stages cycle after index 4 (5 layouts defined).

### Controls

WASD / Arrow keys: move | Space/W/Up: jump | S+jump on one-way platform: drop-through | Z/J: normal attack | X/K: special | Enter: confirm menus
