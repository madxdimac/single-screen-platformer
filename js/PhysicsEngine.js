const GRAVITY = 1400;
const TERMINAL_VY = 900;
const KILL_Y = 600;

export class PhysicsEngine {
  update(dt, movables, platforms) {
    for (const e of movables) {
      if (!e.active || e.affectedByGravity === false) continue;

      e.storePrev();

      // Apply gravity
      e.vy += GRAVITY * dt;
      if (e.vy > TERMINAL_VY) e.vy = TERMINAL_VY;

      // Integrate position
      e.x += e.vx * dt;
      e.y += e.vy * dt;

      // Clamp horizontal to canvas
      if (e.x < 0) { e.x = 0; e.vx = 0; }
      if (e.x + e.w > 800) { e.x = 800 - e.w; e.vx = 0; }

      // Kill plane
      if (e.y > KILL_Y) {
        e.active = false;
        continue;
      }

      e.onGround = false;
      e.onPlatform = null;

      // Platform collision
      for (const p of platforms) {
        if (!p.active) continue;
        this._resolveCollision(e, p);
      }
    }
  }

  _resolveCollision(e, p) {
    // Broad phase
    if (e.right <= p.left || e.left >= p.right ||
        e.bottom <= p.top  || e.top >= p.bottom) return;

    if (p.oneWay) {
      // Only resolve landing (downward) collision
      // prevBottom must have been above platform top
      if (e.prevBottom <= p.top + 2 && e.vy >= 0 && !e.ignorePlatform) {
        e.y = p.top - e.h;
        e.vy = 0;
        e.onGround = true;
        e.onPlatform = p;
      }
    } else {
      // Solid: resolve via minimum overlap
      const overlapLeft   = e.right  - p.left;
      const overlapRight  = p.right  - e.left;
      const overlapTop    = e.bottom - p.top;
      const overlapBottom = p.bottom - e.top;

      const minH = Math.min(overlapLeft, overlapRight);
      const minV = Math.min(overlapTop, overlapBottom);

      if (minV < minH) {
        if (overlapTop < overlapBottom) {
          // Landing on top
          e.y = p.top - e.h;
          if (e.vy > 0) e.vy = 0;
          e.onGround = true;
          e.onPlatform = p;
        } else {
          // Hitting bottom
          e.y = p.bottom;
          if (e.vy < 0) e.vy = 0;
        }
      } else {
        if (overlapLeft < overlapRight) {
          e.x = p.left - e.w;
          e.vx = 0;
        } else {
          e.x = p.right;
          e.vx = 0;
        }
      }
    }
  }
}
