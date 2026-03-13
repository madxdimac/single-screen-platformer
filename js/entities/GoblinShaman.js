import { Enemy } from './Enemy.js';
import { EnemyDefs } from '../data/EnemyDefs.js';

export class GoblinShaman extends Enemy {
  constructor(x, y, diff = 1.0) {
    super(EnemyDefs.goblinShaman, x, y, diff);
    this.minRange = EnemyDefs.goblinShaman.minRange;
  }
}
