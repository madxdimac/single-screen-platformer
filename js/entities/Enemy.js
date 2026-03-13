import { Entity } from './Entity.js';

export class Enemy extends Entity {
  constructor(def, x, y, difficultyMod = 1.0) {
    super(x - def.width / 2, y - def.height, def.width, def.height);
    this.def = def;
    this.enemyId = def.id;
    this.faction = def.faction;
    this.variant = def.variant;

    // Scale with difficulty
    this.maxHp = Math.round(def.hp * difficultyMod);
    this.hp = this.maxHp;
    this.speed = def.speed * difficultyMod;
    this.damage = def.damage * difficultyMod;
    this.attackRange = def.attackRange;
    this.attackCooldown = def.attackCooldown;
    this.aggroRange = def.aggroRange;
    this.projectileSpeed = def.projectileSpeed || 260;

    // AI state
    this.aiState = 'patrol';
    this.patrolDir = Math.random() < 0.5 ? -1 : 1;
    this.patrolTimer = 0;
    this.attackCooldownTimer = 0;
    this.facing = this.patrolDir;
    this.spawnX = x;
    this.patrolMinX = x - 100;
    this.patrolMaxX = x + 100;

    // Knockback
    this.hitFlashTimer = 0;

    // Phase 2 (boss)
    this.phase2 = false;

    this._pendingAttack = null;
  }

  takeDamage(amount, sourceX) {
    if (!this.active) return;
    this.hp -= amount;
    this.hitFlashTimer = 200;

    // Knockback
    if (sourceX !== undefined) {
      const dir = this.cx > sourceX ? 1 : -1;
      this.vx += dir * 200;
      this.vy -= 80;
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this.active = false;
    }
  }

  update(dt) {
    this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt * 1000);
    this.attackCooldownTimer = Math.max(0, this.attackCooldownTimer - dt * 1000);
    this.storePrev();
  }
}
