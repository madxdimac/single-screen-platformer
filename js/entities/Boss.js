import { Enemy } from './Enemy.js';

export class Boss extends Enemy {
  constructor(bossDef, x, y, diff = 1.0) {
    super(bossDef, x, y, diff);
    this.isBoss = true;
    this.chargeCooldown = bossDef.chargeCooldown;
    this.chargeCooldownTimer = bossDef.chargeCooldown * 1.5; // delay first charge
    this.chargeSpeed = bossDef.chargeSpeed;
    this.charging = false;
    this.chargeTimer = 0;
    this.chargeDuration = 500;
    this.chargeDirection = 1;
    this.phase2Threshold = bossDef.phase2Threshold;
  }

  update(dt) {
    super.update(dt);
    this.chargeCooldownTimer = Math.max(0, this.chargeCooldownTimer - dt * 1000);

    // Phase 2 trigger
    if (!this.phase2 && this.hp / this.maxHp <= this.phase2Threshold) {
      this.phase2 = true;
      this.speed *= 1.5;
      this.attackCooldown *= 0.7;
      this.chargeCooldown *= 0.7;
    }

    // Charge update
    if (this.charging) {
      this.chargeTimer -= dt * 1000;
      this.vx = this.chargeDirection * this.chargeSpeed;
      if (this.chargeTimer <= 0) {
        this.charging = false;
        this.vx = 0;
      }
    }
  }

  tryCharge(playerX) {
    if (this.chargeCooldownTimer > 0 || this.charging) return false;
    this.charging = true;
    this.chargeTimer = this.chargeDuration;
    this.chargeDirection = playerX > this.cx ? 1 : -1;
    this.chargeCooldownTimer = this.chargeCooldown;
    return true;
  }
}
