export class InputManager {
  constructor() {
    this._keys = {};
    this._prevKeys = {};
    this._snapshot = {};
    this._prevSnapshot = {};
    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener('keydown', e => {
      this._keys[e.code] = true;
      e.preventDefault();
    });
    window.addEventListener('keyup', e => {
      this._keys[e.code] = false;
    });
  }

  snapshot() {
    this._prevSnapshot = { ...this._snapshot };
    this._snapshot = { ...this._keys };
  }

  isDown(code) {
    return !!this._snapshot[code];
  }

  isPressed(code) {
    return !!this._snapshot[code] && !this._prevSnapshot[code];
  }

  isReleased(code) {
    return !this._snapshot[code] && !!this._prevSnapshot[code];
  }

  // Convenience helpers
  get left()   { return this.isDown('ArrowLeft')  || this.isDown('KeyA'); }
  get right()  { return this.isDown('ArrowRight') || this.isDown('KeyD'); }
  get up()     { return this.isDown('ArrowUp')    || this.isDown('KeyW'); }
  get down()   { return this.isDown('ArrowDown')  || this.isDown('KeyS'); }
  get jump()   { return this.isPressed('ArrowUp') || this.isPressed('KeyW') || this.isPressed('Space'); }
  get attack() { return this.isPressed('KeyZ') || this.isPressed('KeyJ'); }
  get special(){ return this.isPressed('KeyX') || this.isPressed('KeyK'); }
  get confirm(){ return this.isPressed('Enter'); }
  get arrowLeftPress()  { return this.isPressed('ArrowLeft')  || this.isPressed('KeyA'); }
  get arrowRightPress() { return this.isPressed('ArrowRight') || this.isPressed('KeyD'); }
  get dropDown() { return (this.isDown('ArrowDown') || this.isDown('KeyS')) &&
                          (this.isPressed('Space') || this.isPressed('ArrowUp') || this.isPressed('KeyW')); }
}
