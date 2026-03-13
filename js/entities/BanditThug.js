import { Enemy } from './Enemy.js';
import { EnemyDefs } from '../data/EnemyDefs.js';

export class BanditThug extends Enemy {
  constructor(x, y, diff = 1.0) {
    super(EnemyDefs.banditThug, x, y, diff);
  }
}
