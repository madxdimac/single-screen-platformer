import { Entity } from './Entity.js';

export class Player extends Entity {
  constructor(def, startX, startY) {
    super(startX - def.width / 2, startY - def.height, def.width, def.height);
    this.def = def;
    this.charId = def.id;

    // Stats
    this.maxHp = def.hp;
    this.hp = def.hp;
    this.speed = def.speed;
    this.defense = def.defense;
    this.jumpForce = def.jumpForce;

    // Lives
    this.maxLives = 3;
    this.lives = 3;

    // State
    this.facing = 1; // 1=right, -1=left
    this.state = 'idle'; // idle, run, jump, fall, attack, special, dead
    this.invincibleTimer = 0;
    this.attackTimer = 0;
    this.attackCooldownTimer = 0;
    this.specialCooldownTimer = 0;
    this.dead = false;
    this.respawnTimer = 0;

    // Ground pound
    this.groundPounding = false;
    this.gpLaunched = false;

    // Dash (champion)
    this.dashing = false;
    this.dashTimer = 0;
    this.dashDirection = 1;

    // Drop through
    this.ignorePlatform = false;
    this.ignorePlatformTimer = 0;

    // For renderer
    this.attackAnim = 0; // 0-1 progress
  }

  get isInvincible() { return this.invincibleTimer > 0; }
  get specialReady() { return this.specialCooldownTimer <= 0; }
  get attackReady()  { return this.attackCooldownTimer <= 0 && this.attackTimer <= 0; }
  get specialCooldownFraction() {
    const cd = this.def.specialAttack.cooldown;
    return Math.max(0, this.specialCooldownTimer / cd);
  }

  update(dt, input) {
    if (this.dead) {
      this.respawnTimer -= dt * 1000;
      return;
    }

    this.invincibleTimer = Math.max(0, this.invincibleTimer - dt * 1000);
    this.attackCooldownTimer = Math.max(0, this.attackCooldownTimer - dt * 1000);
    this.specialCooldownTimer = Math.max(0, this.specialCooldownTimer - dt * 1000);
    this.attackTimer = Math.max(0, this.attackTimer - dt * 1000);

    if (this.ignorePlatformTimer > 0) {
      this.ignorePlatformTimer -= dt * 1000;
      this.ignorePlatform = true;
      if (this.ignorePlatformTimer <= 0) this.ignorePlatform = false;
    }

    if (this.attackTimer > 0) {
      this.attackAnim = 1 - (this.attackTimer / this.def.normalAttack.duration);
    } else {
      this.attackAnim = 0;
    }

    this._handleMovement(dt, input);
    this._handleAttacks(dt, input);
    this._updateState();
  }

  _handleMovement(dt, input) {
    if (this.dashing) return;
    if (this.groundPounding && this.gpLaunched) {
      // Lock horizontal during ground pound descent
      this.vx = 0;
      return;
    }

    // Horizontal
    if (input.left) {
      this.vx = -this.speed;
      this.facing = -1;
    } else if (input.right) {
      this.vx = this.speed;
      this.facing = 1;
    } else {
      this.vx = 0;
    }

    // Jump
    if (input.jump && this.onGround) {
      // Drop-through one-way platform
      if ((input.isDown('ArrowDown') || input.isDown('KeyS')) && this.onPlatform?.oneWay) {
        this.ignorePlatform = true;
        this.ignorePlatformTimer = 300;
      } else {
        this.vy = this.jumpForce;
        this.onGround = false;
      }
    }
  }

  _handleAttacks(dt, input) {
    // Override in subclasses
  }

  _updateState() {
    if (this.dashing) { this.state = 'special'; return; }
    if (this.groundPounding) { this.state = 'special'; return; }
    if (this.attackTimer > 0) { this.state = 'attack'; return; }
    if (!this.onGround) {
      this.state = this.vy < 0 ? 'jump' : 'fall';
    } else if (this.vx !== 0) {
      this.state = 'run';
    } else {
      this.state = 'idle';
    }
  }

  takeDamage(amount, source) {
    if (this.isInvincible || this.dead) return;
    const dmg = Math.max(1, amount / this.defense);
    this.hp -= dmg;
    this.invincibleTimer = 1500; // 1.5s iframes

    // Knockback from source
    if (source) {
      const dir = this.cx > source.cx ? 1 : -1;
      this.vx += dir * 200;
      this.vy -= 80;
    }

    if (this.hp <= 0) {
      this.hp = 0;
      this._die();
    }
  }

  _die() {
    this.lives--;
    this.dead = true;
    this.respawnTimer = 1500;
    this.vx = 0;
  }

  respawn(x, y) {
    this.dead = false;
    this.hp = this.maxHp;
    this.x = x - this.w / 2;
    this.y = y - this.h;
    this.vx = 0;
    this.vy = 0;
    this.invincibleTimer = 2000;
    this.groundPounding = false;
    this.gpLaunched = false;
    this.dashing = false;
  }

  restoreForStage() {
    this.hp = this.maxHp;
    this.lives = this.maxLives;
    this.dead = false;
    this.invincibleTimer = 0;
    this.specialCooldownTimer = 0;
    this.attackCooldownTimer = 0;
    this.attackTimer = 0;
    this.groundPounding = false;
    this.dashing = false;
  }
}
