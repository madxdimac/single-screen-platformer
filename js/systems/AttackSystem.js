import { Projectile } from '../entities/Projectile.js';

export class AttackSystem {
  constructor() {
    this._hitboxes = [];  // { rect, damage, owner, duration, hitEntities }
    this._aoes = [];      // { cx, cy, radius, damage, duration, hitEntities }
    this._dashHitboxes = []; // { owner, damage, duration, hitEntities }
    this.effects = [];    // visual effects for renderer
  }

  registerMeleeHitbox(rect, damage, ownerEntity, duration) {
    this._hitboxes.push({ rect, damage, owner: ownerEntity, duration, hitEntities: new Set() });
  }

  registerAOE(cx, cy, radius, damage, duration, ownerEntity) {
    this._aoes.push({ cx, cy, radius, damage, duration, ownerEntity, hitEntities: new Set() });
    this.effects.push({ type: 'aoe_ring', cx, cy, radius, timer: 400, maxTimer: 400 });
  }

  registerDashHitbox(ownerEntity, damage, duration) {
    this._dashHitboxes.push({ owner: ownerEntity, damage, duration, hitEntities: new Set() });
  }

  spawnProjectile(x, y, vx, vy, damage, owner, piercing, projectiles) {
    const p = new Projectile({ x, y, vx, vy, damage, owner, piercing });
    projectiles.push(p);
    return p;
  }

  update(dt, player, enemies, projectiles) {
    const dtMs = dt * 1000;

    // Process player-triggered attacks
    this._handlePlayerAttacks(player, enemies, projectiles);

    // Update and resolve melee hitboxes
    this._hitboxes = this._hitboxes.filter(hb => {
      hb.duration -= dtMs;
      this._resolveHitboxVsTargets(hb, enemies, player);
      return hb.duration > 0;
    });

    // Update and resolve AOEs
    this._aoes = this._aoes.filter(aoe => {
      aoe.duration -= dtMs;
      this._resolveAOEVsTargets(aoe, enemies, player);
      return aoe.duration > 0;
    });

    // Dash hitboxes
    this._dashHitboxes = this._dashHitboxes.filter(dh => {
      dh.duration -= dtMs;
      if (dh.owner.active && dh.owner.dashing) {
        const rect = {
          left: dh.owner.x, right: dh.owner.right,
          top: dh.owner.top, bottom: dh.owner.bottom
        };
        this._resolveHitboxVsTargets({ rect, damage: dh.damage, hitEntities: dh.hitEntities }, enemies, player);
      }
      return dh.duration > 0 && dh.owner.dashing;
    });

    // Projectiles vs targets
    for (const proj of projectiles) {
      if (!proj.active) continue;
      if (proj.owner === 'player') {
        for (const enemy of enemies) {
          if (!enemy.active) continue;
          if (proj.hitEntities.has(enemy.id)) continue;
          if (proj.intersects(enemy)) {
            proj.hitEntities.add(enemy.id);
            enemy.takeDamage(proj.damage, proj.cx);
            this._addHitEffect(enemy.cx, enemy.cy);
            if (!proj.piercing) proj.active = false;
          }
        }
      } else {
        // Enemy projectile vs player
        if (player && !player.dead && !player.isInvincible && proj.intersects(player)) {
          player.takeDamage(proj.damage, proj);
          proj.active = false;
          this._addHitEffect(player.cx, player.cy);
        }
      }
    }

    // Update effects
    this.effects = this.effects.filter(e => {
      e.timer -= dtMs;
      return e.timer > 0;
    });

    // Enemy attacks vs player
    this._resolveEnemyAttacks(enemies, player, projectiles);
  }

  _handlePlayerAttacks(player, enemies, projectiles) {
    if (!player || player.dead) return;

    if (player._pendingAttack) {
      const pa = player._pendingAttack;
      player._pendingAttack = null;

      if (pa.type === 'melee') {
        const def = player.def.normalAttack;
        const range = def.range;
        const rect = player.facing === 1
          ? { left: player.right, right: player.right + range, top: player.top + 5, bottom: player.bottom - 5 }
          : { left: player.left - range, right: player.left, top: player.top + 5, bottom: player.bottom - 5 };
        this.registerMeleeHitbox(rect, def.damage, player, def.duration);
        this.effects.push({ type: 'slash', x: rect.left, y: rect.top, w: range, h: rect.bottom - rect.top,
                            timer: 150, maxTimer: 150, facing: player.facing });
      } else if (pa.type === 'projectile') {
        const def = player.def.normalAttack;
        const px = player.facing === 1 ? player.right + 4 : player.left - 4;
        const py = player.cy - 3;
        const vx = player.facing * def.speed;
        this.spawnProjectile(px, py, vx, 0, def.damage, 'player', false, projectiles);
      }
    }

    if (player._pendingSpecial) {
      const ps = player._pendingSpecial;
      player._pendingSpecial = null;

      if (ps.type === 'dash') {
        this.registerDashHitbox(player, player.def.specialAttack.damage, player.def.specialAttack.duration);
      } else if (ps.type === 'volley') {
        const def = player.def.specialAttack;
        const angles = [-0.25, 0, 0.25];
        for (const angle of angles) {
          const baseVx = player.facing * def.speed;
          const vx = baseVx * Math.cos(angle) - 0 * Math.sin(angle);
          const vy = baseVx * Math.sin(angle);
          const px = player.facing === 1 ? player.right + 4 : player.left - 4;
          this.spawnProjectile(px, player.cy - 3, vx, vy, def.damage, 'player', def.piercing, projectiles);
        }
      }
    }

    if (player._pendingAOE) {
      const pa = player._pendingAOE;
      player._pendingAOE = null;
      const def = player.def.specialAttack;
      this.registerAOE(player.cx, player.bottom, def.radius, def.damage, 300, player);
    }
  }

  _resolveHitboxVsTargets(hb, enemies, player) {
    const r = hb.rect;
    const rectIntersects = (e) =>
      e.left < r.right && e.right > r.left && e.top < r.bottom && e.bottom > r.top;

    // Player hitbox vs enemies
    if (hb.owner !== 'enemy') {
      for (const enemy of enemies) {
        if (!enemy.active || hb.hitEntities.has(enemy.id)) continue;
        if (rectIntersects(enemy)) {
          hb.hitEntities.add(enemy.id);
          enemy.takeDamage(hb.damage, hb.owner?.cx);
          this._addHitEffect(enemy.cx, enemy.cy);
        }
      }
    } else {
      // Enemy hitbox vs player
      if (player && !player.dead && !player.isInvincible &&
          !hb.hitEntities.has(player.id) && rectIntersects(player)) {
        hb.hitEntities.add(player.id);
        player.takeDamage(hb.damage, hb.owner);
        this._addHitEffect(player.cx, player.cy);
      }
    }
  }

  _resolveAOEVsTargets(aoe, enemies, player) {
    const distSq = (ax, ay, bx, by) => (ax - bx) ** 2 + (ay - by) ** 2;
    const rSq = aoe.radius ** 2;

    if (aoe.ownerEntity !== 'enemy') {
      for (const enemy of enemies) {
        if (!enemy.active || aoe.hitEntities.has(enemy.id)) continue;
        if (distSq(aoe.cx, aoe.cy, enemy.cx, enemy.cy) <= rSq) {
          aoe.hitEntities.add(enemy.id);
          enemy.takeDamage(aoe.damage, aoe.cx);
          this._addHitEffect(enemy.cx, enemy.cy);
        }
      }
    }
  }

  _resolveEnemyAttacks(enemies, player, projectiles) {
    for (const enemy of enemies) {
      if (!enemy.active || !enemy._pendingAttack) continue;
      const pa = enemy._pendingAttack;
      enemy._pendingAttack = null;

      if (pa.type === 'melee') {
        const dir = (player && player.cx > enemy.cx) ? 1 : -1;
        const range = enemy.attackRange;
        const rect = dir === 1
          ? { left: enemy.right, right: enemy.right + range, top: enemy.top, bottom: enemy.bottom }
          : { left: enemy.left - range, right: enemy.left, top: enemy.top, bottom: enemy.bottom };
        this.registerMeleeHitbox(rect, enemy.damage, 'enemy', 300);
      } else if (pa.type === 'projectile' && player) {
        // Lead-target: aim slightly at player position
        const dx = player.cx - enemy.cx;
        const dy = player.cy - enemy.cy;
        const dist = Math.hypot(dx, dy) || 1;
        const speed = enemy.projectileSpeed;
        const vx = (dx / dist) * speed;
        const vy = (dy / dist) * speed;
        this.spawnProjectile(enemy.cx, enemy.cy, vx, vy, enemy.damage, 'enemy', false, projectiles);
      }
    }
  }

  _addHitEffect(x, y) {
    this.effects.push({ type: 'hit', x, y, timer: 200, maxTimer: 200 });
  }
}
