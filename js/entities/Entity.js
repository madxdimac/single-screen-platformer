let _nextId = 0;

export class Entity {
  constructor(x, y, w, h) {
    this.id = _nextId++;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 0;
    this.vy = 0;
    this.active = true;
    this.onGround = false;
    this.prevBottom = y + h;
    this.prevTop = y;
  }

  get left()   { return this.x; }
  get right()  { return this.x + this.w; }
  get top()    { return this.y; }
  get bottom() { return this.y + this.h; }
  get cx()     { return this.x + this.w / 2; }
  get cy()     { return this.y + this.h / 2; }

  intersects(other) {
    return this.left < other.right &&
           this.right > other.left &&
           this.top < other.bottom &&
           this.bottom > other.top;
  }

  // Store previous bottom before physics step
  storePrev() {
    this.prevBottom = this.bottom;
    this.prevTop = this.top;
  }
}
