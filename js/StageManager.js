import { StageDefs } from './data/StageDefs.js';
import { BossDefs } from './data/EnemyDefs.js';
import { Platform } from './entities/Platform.js';
import { Boss } from './entities/Boss.js';
import { BanditThug } from './entities/BanditThug.js';
import { BanditArcher } from './entities/BanditArcher.js';
import { GoblinWarrior } from './entities/GoblinWarrior.js';
import { GoblinShaman } from './entities/GoblinShaman.js';
import { OrcBrute } from './entities/OrcBrute.js';
import { OrcArcher } from './entities/OrcArcher.js';

const FACTION_ENEMIES = {
  bandits: [BanditThug, BanditArcher],
  goblins: [GoblinWarrior, GoblinShaman],
  orcs:    [OrcBrute, OrcArcher],
};

const FACTION_BOSS = {
  bandits: 'banditBoss',
  goblins: 'goblinBoss',
  orcs:    'orcBoss',
};

export class StageManager {
  constructor(game) {
    this.game = game;
    this.stageIndex = 0;
    this.stageDef = null;
    this.platforms = [];

    this.totalEnemies = 0;
    this.maxConcurrent = 0;
    this.enemiesDefeated = 0;
    this.enemiesSpawned = 0;
    this.diffMod = 1.0;

    this.bossSpawned = false;
    this.bossDefeated = false;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.spawnDelay = 1500; // ms between spawns

    this.clearTimer = 0;
    this.clearing = false;
  }

  get stageNum() { return this.stageIndex + 1; }
  get bgVariant() { return this.stageDef ? this.stageDef.bgVariant : 0; }

  loadStage(index) {
    // Cycle stages if beyond defined
    const defIndex = index % StageDefs.length;
    this.stageIndex = index;
    this.stageDef = StageDefs[defIndex];

    const N = index + 1;
    this.totalEnemies = 8 + (N - 1) * 2;
    this.maxConcurrent = 2 + (N - 1);
    this.diffMod = Math.min(2.0, 1.0 + (N - 1) * 0.05);

    this.enemiesDefeated = 0;
    this.enemiesSpawned = 0;
    this.bossSpawned = false;
    this.bossDefeated = false;
    this.clearing = false;
    this.clearTimer = 0;
    this.spawnTimer = 0;

    // Build spawn queue (alternate types)
    this.spawnQueue = this._buildQueue();

    // Build platforms
    this.platforms = this.stageDef.platforms.map(
      p => new Platform(p.x, p.y, p.w, p.h, p.oneWay)
    );

    return {
      platforms: this.platforms,
      playerStart: this.stageDef.playerStart,
    };
  }

  _buildQueue() {
    const faction = this.stageDef.faction;
    const types = FACTION_ENEMIES[faction];
    const queue = [];
    for (let i = 0; i < this.totalEnemies; i++) {
      queue.push(types[i % types.length]);
    }
    // Shuffle
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    return queue;
  }

  _getSpawnPoint() {
    const pts = this.stageDef.spawnPoints;
    return pts[Math.floor(Math.random() * pts.length)];
  }

  update(dt, activeEnemies) {
    if (this.clearing) {
      this.clearTimer -= dt * 1000;
      return;
    }

    // Count living enemies
    const living = activeEnemies.filter(e => e.active).length;

    // Count defeated (enemies removed from list)
    this.enemiesDefeated = this.enemiesSpawned - living - (this.bossSpawned && !this.bossDefeated ? 0 : 0);

    // Spawn new enemies if room
    if (living < this.maxConcurrent && this.spawnQueue.length > 0) {
      this.spawnTimer -= dt * 1000;
      if (this.spawnTimer <= 0) {
        this._spawnNext(activeEnemies);
        this.spawnTimer = this.spawnDelay;
      }
    }

    // Boss trigger: 80% of normal enemies defeated
    const bossThreshold = Math.floor(this.totalEnemies * 0.8);
    if (!this.bossSpawned && this.enemiesDefeated >= bossThreshold && this.spawnQueue.length === 0) {
      this._spawnBoss(activeEnemies);
    }

    // Stage clear check
    if (this.bossSpawned && this.bossDefeated && living === 0) {
      this.clearing = true;
      this.clearTimer = 600;
    }
  }

  _spawnNext(activeEnemies) {
    if (this.spawnQueue.length === 0) return;
    const EnemyClass = this.spawnQueue.shift();
    const pt = this._getSpawnPoint();
    const enemy = new EnemyClass(pt.x, pt.y, this.diffMod);
    activeEnemies.push(enemy);
    this.enemiesSpawned++;
  }

  _spawnBoss(activeEnemies) {
    this.bossSpawned = true;
    const faction = this.stageDef.faction;
    const bossDef = BossDefs[FACTION_BOSS[faction]];
    const pt = this._getSpawnPoint();
    const boss = new Boss(bossDef, pt.x, pt.y, this.diffMod);
    activeEnemies.push(boss);
    this.game.onBossSpawned && this.game.onBossSpawned(boss);
  }

  checkBossDefeated(enemies) {
    if (!this.bossSpawned || this.bossDefeated) return;
    const boss = enemies.find(e => e.isBoss);
    if (boss && !boss.active) {
      this.bossDefeated = true;
    }
  }

  isStageClear() {
    return this.clearing && this.clearTimer <= 0;
  }

  // Re-count defeated by comparing spawned vs still-active (non-boss)
  recount(activeEnemies) {
    const living = activeEnemies.filter(e => e.active && !e.isBoss).length;
    this.enemiesDefeated = Math.max(0, this.enemiesSpawned - living);
    return this.enemiesDefeated;
  }
}
