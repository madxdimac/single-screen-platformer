# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

Open `index.html` directly in a browser — no build step required. The file is fully self-contained: CSS, all game JS, and all sprite image data are inlined (~266KB).

If a local server is preferred: `python -m http.server 8080` then visit `http://localhost:8080`.

## Sprite Pipeline

Character and enemy sprites are pre-processed PNG images embedded as base64 data URLs.

1. **Source images**: `character_references/*.png` (12 files)
2. **Processing**: `python tools/process_sprites.py` — BFS background removal, auto-crop, resize to 96px tall, base64-encode → writes `js/sprites_data.js`
3. **Embedding**: After changing sprites or bundle.js, rebuild `index.html` by running:
   ```python
   # Concatenate sprites_data.js + bundle.js into index.html's <script> block
   python - <<'EOF'
   project = r'C:\Users\madxd\Documents\mad_dev\claude_projects\single_screen_platformer'
   with open(project+r'\index.html','r',encoding='utf-8') as f: lines=f.readlines()
   si=next(i for i,l in enumerate(lines) if l.strip()=='<script>')
   ei=next(i for i,l in enumerate(lines) if l.strip()=='</script>' and i>si)
   sprites=open(project+r'\js\sprites_data.js','r',encoding='utf-8').read()
   bundle=open(project+r'\js\bundle.js','r',encoding='utf-8').read()
   html=''.join(lines[:si+1])+'\n'+sprites+'\n'+bundle+'\n'+''.join(lines[ei:])
   open(project+r'\index.html','w',encoding='utf-8',newline='\n').write(html)
   EOF
   ```

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

- **Renderer** tries sprite rendering first (`_drawSprite(key, x, y, w, h, flipX, alpha)`), falls back to procedural shape drawing. Sprites are loaded async in `_initSprites()` from the global `SPRITE_DATA`.
- **AttackSystem** owns all hitbox resolution. Entities signal intent via `_pendingAttack` / `_pendingSpecial` / `_pendingAOE` flags that AttackSystem consumes each frame. Hitboxes use a `hitEntities` Set to prevent double-hits.
- **PhysicsEngine** handles gravity + AABB. One-way platforms resolve only downward passes (`prevBottom <= platform.top + 2`). `entity.ignorePlatform` flag (300ms) enables drop-through.
- **AISystem** drives enemies each frame; enemies expose `_pendingAttack` for AttackSystem to resolve.
- **StageManager** maintains a shuffled spawn queue, enforces `maxConcurrent` enemies, and triggers boss spawn at 80% of normal enemies defeated.
- Difficulty scales per stage N: `totalEnemies = 8 + (N-1)*2`, `maxConcurrent = 2 + (N-1)`, speed/damage mod `= min(2.0, 1 + (N-1)*0.05)`. Stages cycle after index 4 (5 layouts defined).

### Controls

WASD / Arrow keys: move | Space/W/Up: jump | S+jump on one-way platform: drop-through | Z/J: normal attack | X/K: special | Enter: confirm menus
