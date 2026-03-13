import { Player } from './Player.js';

export class Ranger extends Player {
  constructor(def, x, y) {
    super(def, x, y);
  }

  _handleAttacks(dt, input) {
    if (input.attack && this.attackReady) {
      this.attackTimer = 200;
      this.attackCooldownTimer = this.def.normalAttack.cooldown;
      this._pendingAttack = { type: 'projectile', piercing: false };
    }

    if (input.special && this.specialReady) {
      this.attackTimer = 300;
      this.specialCooldownTimer = this.def.specialAttack.cooldown;
      this._pendingSpecial = { type: 'volley', count: 3, piercing: true };
    }
  }
}
