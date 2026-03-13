import { Enemy } from './Enemy.js';
import { EnemyDefs } from '../data/EnemyDefs.js';

export class BanditArcher extends Enemy {
  constructor(x, y, diff = 1.0) {
    super(EnemyDefs.banditArcher, x, y, diff);
    this.minRange = EnemyDefs.banditArcher.minRange;
  }
}
