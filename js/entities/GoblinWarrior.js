import { Enemy } from './Enemy.js';
import { EnemyDefs } from '../data/EnemyDefs.js';

export class GoblinWarrior extends Enemy {
  constructor(x, y, diff = 1.0) {
    super(EnemyDefs.goblinWarrior, x, y, diff);
  }
}
