import { Entity } from './Entity.js';

export class Platform extends Entity {
  constructor(x, y, w, h, oneWay = false) {
    super(x, y, w, h);
    this.oneWay = oneWay;
    this.active = true;
  }
}
