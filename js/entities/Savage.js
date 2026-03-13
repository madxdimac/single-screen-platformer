import { Player } from './Player.js';

export class Savage extends Player {
  constructor(def, x, y) {
    super(def, x, y);
    this.gpLaunched = false;
  }

  _handleAttacks(dt, input) {
    if (this.groundPounding) {
      if (this.gpLaunched && this.onGround) {
        // Landed — trigger AOE
        this.groundPounding = false;
        this.gpLaunched = false;
        this._pendingAOE = { type: 'aoe', radius: this.def.specialAttack.radius };
      }
      return;
    }

    if (input.attack && this.attackReady) {
      this.attackTimer = this.def.normalAttack.duration;
      this.attackCooldownTimer = this.def.normalAttack.cooldown;
      this._pendingAttack = { type: 'melee' };
    }

    if (input.special && this.specialReady && this.onGround) {
      // Launch upward
      this.vy = this.def.specialAttack.jumpForce;
      this.onGround = false;
      this.groundPounding = true;
      this.gpLaunched = false;
      this.specialCooldownTimer = this.def.specialAttack.cooldown;
    } else if (this.groundPounding && !this.gpLaunched && this.vy > 0) {
      // At apex, start descent
      this.gpLaunched = true;
      this.vy = 600; // slam down
    }
  }

  update(dt, input) {
    super.update(dt, input);
    // Auto-trigger slam descent once rising is done
    if (this.groundPounding && !this.gpLaunched && this.vy >= 0) {
      this.gpLaunched = true;
      this.vy = 600;
    }
  }
}
