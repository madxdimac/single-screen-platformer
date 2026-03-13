export class AISystem {
  update(dt, enemies, player, platforms) {
    if (!player || player.dead) return;

    for (const enemy of enemies) {
      if (!enemy.active) continue;
      this._tickEnemy(dt, enemy, player, platforms);
      enemy.update(dt);
    }
  }

  _tickEnemy(dt, enemy, player, platforms) {
    const dx = player.cx - enemy.cx;
    const dist = Math.abs(dx);
    const dir = dx > 0 ? 1 : -1;

    // Boss special logic
    if (enemy.isBoss) {
      this._tickBoss(dt, enemy, player, dir, dist);
      return;
    }

    switch (enemy.aiState) {
      case 'idle':
        enemy.vx = 0;
        if (dist < enemy.aggroRange) enemy.aiState = 'chase';
        break;

      case 'patrol':
        this._patrol(enemy);
        if (dist < enemy.aggroRange) enemy.aiState = 'chase';
        break;

      case 'chase':
        if (dist > enemy.aggroRange * 1.5) { enemy.aiState = 'patrol'; break; }

        if (enemy.variant === 'ranged') {
          // Maintain distance
          if (dist < (enemy.minRange || 120)) {
            // Back away
            enemy.vx = -dir * enemy.speed;
            enemy.facing = dir;
          } else if (dist > enemy.attackRange) {
            enemy.vx = dir * enemy.speed * 0.6;
            enemy.facing = dir;
          } else {
            enemy.vx = 0;
            enemy.aiState = 'attack';
          }
        } else {
          // Melee: chase
          enemy.facing = dir;
          enemy.vx = dir * enemy.speed;
          if (dist < enemy.attackRange + 10) {
            enemy.vx = 0;
            enemy.aiState = 'attack';
          }
        }

        // Platform jumping
        this._tryJump(enemy, player, platforms);
        break;

      case 'attack':
        enemy.vx = 0;
        if (enemy.attackCooldownTimer <= 0) {
          if (dist <= enemy.attackRange + 20) {
            enemy.facing = dir;
            enemy._pendingAttack = {
              type: enemy.variant === 'ranged' ? 'projectile' : 'melee'
            };
            enemy.attackCooldownTimer = enemy.attackCooldown;
          } else {
            enemy.aiState = 'chase';
          }
        }
        // Re-enter chase if player moved away
        if (enemy.variant === 'melee' && dist > enemy.attackRange + 40) enemy.aiState = 'chase';
        if (enemy.variant === 'ranged' && (dist > enemy.attackRange * 1.2 || dist < (enemy.minRange || 100))) {
          enemy.aiState = 'chase';
        }
        break;
    }
  }

  _tickBoss(dt, enemy, player, dir, dist) {
    if (enemy.charging) {
      enemy.facing = enemy.chargeDirection;
      return;
    }

    enemy.facing = dir;

    if (dist < enemy.attackRange + 5) {
      enemy.vx = 0;
      if (enemy.attackCooldownTimer <= 0) {
        enemy._pendingAttack = { type: 'melee' };
        enemy.attackCooldownTimer = enemy.attackCooldown;
      }
    } else {
      enemy.vx = dir * enemy.speed;
      // Try charge
      if (dist > 150 && dist < enemy.aggroRange) {
        enemy.tryCharge && enemy.tryCharge(player.cx);
      }
    }
  }

  _patrol(enemy) {
    enemy.vx = enemy.patrolDir * enemy.speed * 0.5;
    enemy.facing = enemy.patrolDir;

    if (enemy.cx < enemy.patrolMinX) {
      enemy.patrolDir = 1;
    } else if (enemy.cx > enemy.patrolMaxX) {
      enemy.patrolDir = -1;
    }
  }

  _tryJump(enemy, player, platforms) {
    if (!enemy.onGround) return;

    // Find platform player might be on
    let playerPlatform = null;
    for (const p of platforms) {
      if (player.bottom >= p.top - 4 && player.bottom <= p.top + 8 &&
          player.cx >= p.left && player.cx <= p.right) {
        playerPlatform = p;
        break;
      }
    }

    if (!playerPlatform) return;
    if (playerPlatform.top >= enemy.bottom) return; // Player is below or same level

    // Check if enemy is near platform edge
    const nearLeft  = Math.abs(enemy.cx - playerPlatform.left) < 60;
    const nearRight = Math.abs(enemy.cx - playerPlatform.right) < 60;
    const below     = enemy.bottom > playerPlatform.top;

    if (below && (nearLeft || nearRight)) {
      enemy.vy = -400;
    }
  }
}
