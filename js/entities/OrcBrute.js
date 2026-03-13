import { Enemy } from './Enemy.js';
import { EnemyDefs } from '../data/EnemyDefs.js';

export class OrcBrute extends Enemy {
  constructor(x, y, diff = 1.0) {
    super(EnemyDefs.orcBrute, x, y, diff);
  }
}
