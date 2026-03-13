import { Entity } from './Entity.js';

export class Projectile extends Entity {
  constructor({ x, y, vx, vy, damage, owner, piercing = false, maxRange = 600, w = 12, h = 5 }) {
    super(x, y, w, h);
    this.vx = vx;
    this.vy = vy;
    this.damage = damage;
    this.owner = owner;       // 'player' | 'enemy'
    this.piercing = piercing;
    this.maxRange = maxRange;
    this.hitEntities = new Set();
    this.startX = x;
    this.startY = y;
    this.affectedByGravity = false;
  }

  update(dt) {
    this.storePrev();
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    const dist = Math.hypot(this.x - this.startX, this.y - this.startY);
    if (dist > this.maxRange || this.x < -20 || this.x > 820 || this.y < -20 || this.y > 520) {
      this.active = false;
    }
  }
}
