import { Enemy } from './Enemy.js';
import { EnemyDefs } from '../data/EnemyDefs.js';

export class OrcArcher extends Enemy {
  constructor(x, y, diff = 1.0) {
    super(EnemyDefs.orcArcher, x, y, diff);
    this.minRange = EnemyDefs.orcArcher.minRange;
  }
}
