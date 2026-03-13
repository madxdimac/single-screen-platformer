import { Player } from './Player.js';

export class Champion extends Player {
  constructor(def, x, y) {
    super(def, x, y);
    this.dashTimer = 0;
    this.dashDuration = def.specialAttack.duration;
    this.dashSpeed = def.specialAttack.dashSpeed;
  }

  _handleAttacks(dt, input) {
    if (this.dashing) {
      this.dashTimer -= dt * 1000;
      this.vx = this.dashDirection * this.dashSpeed;
      if (this.dashTimer <= 0) {
        this.dashing = false;
        this.vx = 0;
      }
      return;
    }

    if (input.attack && this.attackReady) {
      this.attackTimer = this.def.normalAttack.duration;
      this.attackCooldownTimer = this.def.normalAttack.cooldown;
      // AttackSystem will register hitbox
      this._pendingAttack = { type: 'melee' };
    }

    if (input.special && this.specialReady) {
      this.dashing = true;
      this.dashTimer = this.dashDuration;
      this.dashDirection = this.facing;
      this.specialCooldownTimer = this.def.specialAttack.cooldown;
      this.invincibleTimer = this.dashDuration + 100;
      this._pendingSpecial = { type: 'dash' };
    }
  }
}
