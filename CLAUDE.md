# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Game

Open `index.html` directly in a browser — no build step, no server required. The file is fully self-contained: CSS and all game JS are inlined into a single HTML file (~64KB).

If a local server is preferred: `python -m http.server 8080` then visit `http://localhost:8080`.

## Architecture

All game logic is inlined inside the `<script>` tag in **`index.html`**, which also contains the CSS. The identical code lives in **`js/bundle.js`** for readability. The individual source files under `js/` (entities, systems, data) are the modular originals but are **not loaded by the browser**. When editing game logic, **edit the `<script>` block in `index.html`** and keep `js/bundle.js` in sync.

### Class dependency order in bundle.js

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

- **AttackSystem** owns all hitbox resolution. Entities signal intent via `_pendingAttack` / `_pendingSpecial` / `_pendingAOE` flags that AttackSystem consumes each frame. Hitboxes use a `hitEntities` Set to prevent double-hits.
- **PhysicsEngine** handles gravity + AABB. One-way platforms resolve only downward passes (`prevBottom <= platform.top + 2`). `entity.ignorePlatform` flag (300ms) enables drop-through.
- **AISystem** drives enemies each frame; enemies expose `_pendingAttack` for AttackSystem to resolve.
- **StageManager** maintains a shuffled spawn queue, enforces `maxConcurrent` enemies, and triggers boss spawn at 80% of normal enemies defeated.
- Difficulty scales per stage N: `totalEnemies = 8 + (N-1)*2`, `maxConcurrent = 2 + (N-1)`, speed/damage mod `= min(2.0, 1 + (N-1)*0.05)`. Stages cycle after index 4 (5 layouts defined).

### Controls

WASD / Arrow keys: move | Space/W/Up: jump | S+jump on one-way platform: drop-through | Z/J: normal attack | X/K: special | Enter: confirm menus
