import { InputManager } from './InputManager.js';
import { Renderer } from './Renderer.js';
import { PhysicsEngine } from './PhysicsEngine.js';
import { StageManager } from './StageManager.js';
import { AttackSystem } from './systems/AttackSystem.js';
import { AISystem } from './systems/AISystem.js';
import { HUDSystem } from './systems/HUDSystem.js';
import { CharacterDefs } from './data/CharacterDefs.js';
import { Champion } from './entities/Champion.js';
import { Ranger } from './entities/Ranger.js';
import { Savage } from './entities/Savage.js';

const CHAR_CLASSES = { champion: Champion, ranger: Ranger, savage: Savage };
const CHAR_LIST = ['champion', 'ranger', 'savage'];

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.input = new InputManager();
    this.renderer = new Renderer(canvas);
    this.physics = new PhysicsEngine();
    this.stageManager = new StageManager(this);
    this.attackSystem = new AttackSystem();
    this.aiSystem = new AISystem();
    this.hud = new HUDSystem(this.renderer.ctx);

    this.state = 'CHARACTER_SELECT';
    this.selectedCharIndex = 0;
    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.platforms = [];
    this.stageIndex = 0;

    this._lastTime = 0;
    this._rafId = null;
  }

  init() {
    this._loop = this._loop.bind(this);
    requestAnimationFrame(this._loop);
  }

  _loop(timestamp) {
    this._rafId = requestAnimationFrame(this._loop);
    const dt = Math.min((timestamp - this._lastTime) / 1000, 0.05);
    this._lastTime = timestamp;

    this.input.snapshot();
    this._update(dt);
    this._render();
  }

  _update(dt) {
    switch (this.state) {
      case 'CHARACTER_SELECT': this._updateCharSelect(); break;
      case 'PLAYING':          this._updatePlaying(dt); break;
      case 'STAGE_CLEAR':      this._updateStageClear(dt); break;
      case 'GAME_OVER':        this._updateGameOver(); break;
    }
  }

  // ─── CHARACTER SELECT ────────────────────────────────────────────────────
  _updateCharSelect() {
    if (this.input.arrowLeftPress) {
      this.selectedCharIndex = (this.selectedCharIndex - 1 + CHAR_LIST.length) % CHAR_LIST.length;
    }
    if (this.input.arrowRightPress) {
      this.selectedCharIndex = (this.selectedCharIndex + 1) % CHAR_LIST.length;
    }
    if (this.input.confirm) {
      this._startGame(CHAR_LIST[this.selectedCharIndex]);
    }
  }

  _startGame(charId) {
    this.stageIndex = 0;
    this._initStage(charId);
    this.state = 'PLAYING';
  }

  _initStage(charId) {
    const { platforms, playerStart } = this.stageManager.loadStage(this.stageIndex);
    this.platforms = platforms;
    this.enemies = [];
    this.projectiles = [];
    this.attackSystem._hitboxes = [];
    this.attackSystem._aoes = [];
    this.attackSystem._dashHitboxes = [];
    this.attackSystem.effects = [];

    const existingCharId = this.player?.charId || charId;
    const def = CharacterDefs[existingCharId];
    const Cls = CHAR_CLASSES[existingCharId];

    if (this.player) {
      // Restore for next stage
      this.player.restoreForStage();
      this.player.x = playerStart.x - this.player.w / 2;
      this.player.y = playerStart.y - this.player.h;
      this.player.vx = 0;
      this.player.vy = 0;
    } else {
      this.player = new Cls(def, playerStart.x, playerStart.y);
    }

    this.hud.showStageClear && (this.hud.stageClearTimer = 0);
  }

  // ─── PLAYING ─────────────────────────────────────────────────────────────
  _updatePlaying(dt) {
    // Player
    if (this.player) {
      if (!this.player.dead) {
        this.player.update(dt, this.input);
      } else {
        this.player.respawnTimer -= dt * 1000;
        if (this.player.respawnTimer <= 0) {
          if (this.player.lives <= 0) {
            this.state = 'GAME_OVER';
            return;
          }
          const ps = this.stageManager.stageDef.playerStart;
          this.player.respawn(ps.x, ps.y);
        }
      }
    }

    // AI
    this.aiSystem.update(dt, this.enemies, this.player, this.platforms);

    // Projectiles
    for (const p of this.projectiles) {
      if (p.active) p.update(dt);
    }

    // Physics — player + enemies (not projectiles, those are manual)
    const physMovables = [];
    if (this.player && !this.player.dead) physMovables.push(this.player);
    for (const e of this.enemies) {
      if (e.active) physMovables.push(e);
    }
    this.physics.update(dt, physMovables, this.platforms);

    // Attack system
    this.attackSystem.update(dt, this.player, this.enemies, this.projectiles);

    // Stage manager
    this.stageManager.checkBossDefeated(this.enemies);
    this.stageManager.update(dt, this.enemies);

    // Prune
    this.enemies = this.enemies.filter(e => e.active);
    this.projectiles = this.projectiles.filter(p => p.active);

    // HUD
    this.hud.update(dt);

    // Stage clear check
    if (this.stageManager.isStageClear()) {
      this.state = 'STAGE_CLEAR';
      this.hud.showStageClear();
    }
  }

  // ─── STAGE CLEAR ─────────────────────────────────────────────────────────
  _updateStageClear(dt) {
    this.hud.update(dt);
    if (this.hud.stageClearTimer <= 0) {
      this.stageIndex++;
      this._initStage();
      this.state = 'PLAYING';
    }
  }

  // ─── GAME OVER ────────────────────────────────────────────────────────────
  _updateGameOver() {
    if (this.input.confirm) {
      this.player = null;
      this.enemies = [];
      this.projectiles = [];
      this.platforms = [];
      this.state = 'CHARACTER_SELECT';
    }
  }

  // ─── BOSS CALLBACK ────────────────────────────────────────────────────────
  onBossSpawned(boss) {
    this.hud.showBossWarning();
  }

  // ─── RENDER ──────────────────────────────────────────────────────────────
  _render() {
    const ctx = this.renderer.ctx;
    ctx.clearRect(0, 0, 800, 500);

    switch (this.state) {
      case 'CHARACTER_SELECT':
        this.renderer.renderCharacterSelect(this.selectedCharIndex);
        break;

      case 'PLAYING':
      case 'STAGE_CLEAR':
        this.renderer.render({
          gameState: this.state,
          player: this.player,
          enemies: this.enemies,
          projectiles: this.projectiles,
          platforms: this.platforms,
          effects: this.attackSystem.effects,
          hud: this.hud,
          stageNum: this.stageManager.stageNum,
          enemiesDefeated: this.stageManager.recount(this.enemies),
          totalEnemies: this.stageManager.totalEnemies + 1, // +1 for boss
          bgVariant: this.stageManager.bgVariant,
        });
        break;

      case 'GAME_OVER':
        // Still render the world behind
        this.renderer.render({
          gameState: this.state,
          player: this.player,
          enemies: this.enemies,
          projectiles: this.projectiles,
          platforms: this.platforms,
          effects: [],
          hud: null,
          stageNum: this.stageManager.stageNum,
          enemiesDefeated: 0,
          totalEnemies: 0,
          bgVariant: this.stageManager.bgVariant,
        });
        this.renderer.renderGameOver();
        break;
    }
  }
}
