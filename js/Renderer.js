import { Colors } from './AssetManager.js';
import { CharacterDefs } from './data/CharacterDefs.js';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.W = canvas.width;
    this.H = canvas.height;
    this._stars = this._generateStars(80);
  }

  _generateStars(n) {
    const stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({ x: Math.random() * 800, y: Math.random() * 200, r: Math.random() * 1.5 + 0.3 });
    }
    return stars;
  }

  // ─── Full game render ────────────────────────────────────────────────────
  render(state) {
    const { gameState, player, enemies, projectiles, platforms, effects,
            hud, stageNum, enemiesDefeated, totalEnemies, bgVariant } = state;

    this._drawBackground(bgVariant || 0);
    this._drawPlatforms(platforms || []);

    if (enemies) {
      for (const e of enemies) {
        if (e.active) this._drawEnemy(e);
      }
    }

    if (player && !player.dead) {
      this._drawPlayer(player);
    }

    if (projectiles) {
      for (const p of projectiles) {
        if (p.active) this._drawProjectile(p);
      }
    }

    if (effects) {
      for (const ef of effects) this._drawEffect(ef);
    }

    if (hud && player) {
      hud.render(player, stageNum, enemiesDefeated, totalEnemies);
    }
  }

  // ─── Background ──────────────────────────────────────────────────────────
  _drawBackground(variant) {
    const ctx = this.ctx;
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, this.H);
    if (variant === 0) {
      grad.addColorStop(0, '#0d1b2a');
      grad.addColorStop(0.6, '#1e3a5f');
      grad.addColorStop(1, '#2a4a30');
    } else if (variant === 1) {
      grad.addColorStop(0, '#0a1f0a');
      grad.addColorStop(0.6, '#1a3a1a');
      grad.addColorStop(1, '#2a3a1a');
    } else {
      grad.addColorStop(0, '#1a0a0a');
      grad.addColorStop(0.6, '#3a1a0a');
      grad.addColorStop(1, '#2a1a0a');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.W, this.H);

    // Stars
    ctx.fillStyle = Colors.STAR;
    for (const s of this._stars) {
      ctx.globalAlpha = 0.6 + Math.sin(Date.now() / 1000 + s.x) * 0.4;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Mountain silhouettes
    ctx.fillStyle = variant === 1 ? '#0d200d' : variant === 2 ? '#200d0d' : '#1a2744';
    this._drawMountains();
  }

  _drawMountains() {
    const ctx = this.ctx;
    const peaks = [[100, 260], [250, 200], [400, 240], [550, 190], [700, 250], [800, 220]];
    ctx.beginPath();
    ctx.moveTo(0, 460);
    ctx.lineTo(0, 320);
    for (const [px, py] of peaks) {
      ctx.lineTo(px, py);
    }
    ctx.lineTo(800, 320);
    ctx.lineTo(800, 460);
    ctx.closePath();
    ctx.fill();
  }

  // ─── Platforms ───────────────────────────────────────────────────────────
  _drawPlatforms(platforms) {
    const ctx = this.ctx;
    for (const p of platforms) {
      if (!p.active) continue;
      if (p.oneWay) {
        // Floating stone slab
        ctx.fillStyle = Colors.PLATFORM_TOP;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = Colors.PLATFORM_BODY;
        ctx.fillRect(p.x, p.y + 4, p.w, p.h - 4);
        // Highlight line
        ctx.fillStyle = Colors.PLATFORM_DETAIL;
        ctx.fillRect(p.x + 2, p.y + 1, p.w - 4, 2);
        // Shadow
        ctx.fillStyle = Colors.PLATFORM_SHADOW;
        ctx.fillRect(p.x, p.y + p.h - 3, p.w, 3);
        // Stone crack marks
        for (let cx = p.x + 20; cx < p.right - 10; cx += 30) {
          ctx.fillStyle = Colors.PLATFORM_SHADOW;
          ctx.fillRect(cx, p.y + 2, 1, p.h - 4);
        }
      } else {
        // Solid ground
        ctx.fillStyle = Colors.PLATFORM_BODY;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = Colors.PLATFORM_TOP;
        ctx.fillRect(p.x, p.y, p.w, 6);
        ctx.fillStyle = Colors.PLATFORM_DETAIL;
        ctx.fillRect(p.x, p.y + 1, p.w, 2);
        ctx.fillStyle = Colors.PLATFORM_SHADOW;
        ctx.fillRect(p.x, p.y + p.h - 6, p.w, 6);
        // Brick pattern
        for (let bx = p.x; bx < p.right; bx += 40) {
          for (let by = p.y + 8; by < p.bottom - 6; by += 12) {
            ctx.strokeStyle = Colors.PLATFORM_SHADOW;
            ctx.lineWidth = 1;
            ctx.strokeRect(bx + 1, by + 1, 38, 10);
          }
        }
      }
    }
  }

  // ─── Player ───────────────────────────────────────────────────────────────
  _drawPlayer(player) {
    const ctx = this.ctx;
    ctx.save();

    if (player.isInvincible) {
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 80) * 0.5;
    }

    const { x, y, w, h, facing, charId, state } = player;

    switch (charId) {
      case 'champion': this._drawChampion(ctx, x, y, w, h, facing, player); break;
      case 'ranger':   this._drawRanger(ctx, x, y, w, h, facing, player); break;
      case 'savage':   this._drawSavage(ctx, x, y, w, h, facing, player); break;
    }

    ctx.restore();
  }

  _drawChampion(ctx, x, y, w, h, f, player) {
    const mx = x + w / 2;
    // Body armor (blue)
    ctx.fillStyle = Colors.CHAMPION_ARMOR;
    ctx.fillRect(x + 4, y + 12, w - 8, h - 18);
    // Helmet
    ctx.fillStyle = Colors.CHAMPION_ARMOR;
    ctx.fillRect(x + 5, y + 2, w - 10, 12);
    ctx.fillStyle = '#aaaacc';
    ctx.fillRect(x + 7, y + 5, w - 14, 5); // visor
    // Cape
    ctx.fillStyle = '#aa2222';
    ctx.fillRect(f === 1 ? x : x + 2, y + 10, 6, h - 12);
    // Legs
    ctx.fillStyle = '#334466';
    ctx.fillRect(x + 4, y + h - 12, 8, 12);
    ctx.fillRect(x + w - 12, y + h - 12, 8, 12);
    // Shield (left)
    ctx.fillStyle = Colors.CHAMPION_SHIELD;
    const sx = f === 1 ? x - 8 : x + w + 2;
    ctx.fillRect(sx, y + 14, 8, 18);
    ctx.fillStyle = '#eecc00';
    ctx.fillRect(sx + 2, y + 16, 4, 14);
    // Sword (right)
    ctx.fillStyle = Colors.CHAMPION_SWORD;
    const swx = f === 1 ? x + w + 2 : x - 10;
    const swOff = player.state === 'attack' ? 8 : 0;
    ctx.fillRect(swx + (f === 1 ? swOff : -swOff), y + 8, 4, 20);
    ctx.fillStyle = '#ccaa00';
    ctx.fillRect(swx - 2 + (f === 1 ? swOff : -swOff), y + 26, 8, 4); // guard
  }

  _drawRanger(ctx, x, y, w, h, f, player) {
    // Cloak/hood
    ctx.fillStyle = Colors.RANGER_CLOAK;
    ctx.fillRect(x + 3, y + 2, w - 6, h - 10);
    // Hood
    ctx.fillStyle = Colors.RANGER_CLOAK;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 8, 9, 0, Math.PI * 2);
    ctx.fill();
    // Face
    ctx.fillStyle = '#e8c090';
    ctx.fillRect(x + 7, y + 5, w - 14, 9);
    // Legs
    ctx.fillStyle = '#3d6028';
    ctx.fillRect(x + 4, y + h - 12, 7, 12);
    ctx.fillRect(x + w - 11, y + h - 12, 7, 12);
    // Bow
    ctx.strokeStyle = Colors.RANGER_BOW;
    ctx.lineWidth = 2.5;
    const bx = f === 1 ? x - 6 : x + w + 2;
    ctx.beginPath();
    ctx.arc(bx + (f === 1 ? 3 : -3), y + h / 2 - 2, 14, -1.1, 1.1, f !== 1);
    ctx.stroke();
    // Arrow
    if (player.state !== 'attack') {
      ctx.strokeStyle = Colors.RANGER_ARROW;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx + (f === 1 ? -2 : 6), y + h / 2 - 2);
      ctx.lineTo(bx + (f === 1 ? 8 : -4), y + h / 2 - 2);
      ctx.stroke();
    }
  }

  _drawSavage(ctx, x, y, w, h, f, player) {
    // Fur tunic
    ctx.fillStyle = Colors.SAVAGE_FUR;
    ctx.fillRect(x + 3, y + 10, w - 6, h - 16);
    // Body (larger)
    ctx.fillStyle = Colors.SAVAGE_BODY;
    ctx.fillRect(x + 5, y + 14, w - 10, h - 22);
    // Head
    ctx.fillStyle = '#c87840';
    ctx.fillRect(x + 4, y + 2, w - 8, 14);
    // Wild hair
    ctx.fillStyle = '#3a1a00';
    ctx.fillRect(x + 2, y, w - 4, 8);
    // Legs
    ctx.fillStyle = Colors.SAVAGE_FUR;
    ctx.fillRect(x + 4, y + h - 14, 10, 14);
    ctx.fillRect(x + w - 14, y + h - 14, 10, 14);
    // Hammer
    const hx = f === 1 ? x + w - 4 : x - 18;
    const hy = player.state === 'attack' ? y : y + 10;
    ctx.fillStyle = Colors.SAVAGE_HANDLE;
    ctx.fillRect(hx + 6, hy + 4, 4, 20);
    ctx.fillStyle = Colors.SAVAGE_HAMMER;
    ctx.fillRect(hx, hy, 16, 12);
    ctx.fillStyle = '#aaaaaa';
    ctx.fillRect(hx + 2, hy + 1, 12, 4);
  }

  // ─── Enemies ─────────────────────────────────────────────────────────────
  _drawEnemy(enemy) {
    const ctx = this.ctx;
    ctx.save();
    if (enemy.hitFlashTimer > 0) {
      ctx.globalAlpha = 0.4 + Math.sin(Date.now() / 40) * 0.6;
    }

    const { x, y, w, h, facing, faction, variant, isBoss } = enemy;

    if (isBoss) {
      this._drawBoss(ctx, enemy);
    } else {
      switch (faction) {
        case 'bandits': this._drawBandit(ctx, x, y, w, h, facing, variant); break;
        case 'goblins': this._drawGoblin(ctx, x, y, w, h, facing, variant); break;
        case 'orcs':    this._drawOrc(ctx, x, y, w, h, facing, variant); break;
      }
    }

    // HP bar above
    this._drawEnemyHP(ctx, enemy);
    ctx.restore();
  }

  _drawBandit(ctx, x, y, w, h, f, variant) {
    // Body
    ctx.fillStyle = Colors.BANDIT_CLOTH;
    ctx.fillRect(x + 3, y + 10, w - 6, h - 16);
    // Head with bandana
    ctx.fillStyle = '#c8a070';
    ctx.fillRect(x + 4, y + 2, w - 8, 12);
    ctx.fillStyle = '#aa2222';
    ctx.fillRect(x + 3, y + 2, w - 6, 5);
    // Legs
    ctx.fillStyle = '#5c3c1a';
    ctx.fillRect(x + 3, y + h - 10, 7, 10);
    ctx.fillRect(x + w - 10, y + h - 10, 7, 10);
    // Weapon
    ctx.fillStyle = Colors.BANDIT_WEAPON;
    if (variant === 'melee') {
      ctx.fillRect(f === 1 ? x + w : x - 6, y + 8, 4, 16);
    } else {
      // Bow
      ctx.strokeStyle = Colors.RANGER_BOW;
      ctx.lineWidth = 2;
      const bx = f === 1 ? x + w + 2 : x - 8;
      ctx.beginPath();
      ctx.arc(bx + (f === 1 ? 2 : -2), y + h / 2, 10, -1, 1, f !== 1);
      ctx.stroke();
    }
  }

  _drawGoblin(ctx, x, y, w, h, f, variant) {
    // Green body
    ctx.fillStyle = Colors.GOBLIN_SKIN;
    ctx.fillRect(x + 2, y + 8, w - 4, h - 12);
    // Big head
    ctx.fillStyle = Colors.GOBLIN_SKIN;
    ctx.fillRect(x + 1, y, w - 2, 14);
    // Big eyes
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x + 4, y + 4, 4, 3);
    ctx.fillRect(x + w - 8, y + 4, 4, 3);
    // Ears
    ctx.fillStyle = Colors.GOBLIN_SKIN;
    ctx.fillRect(x - 3, y + 3, 5, 7);
    ctx.fillRect(x + w - 2, y + 3, 5, 7);
    // Legs
    ctx.fillStyle = '#3d6028';
    ctx.fillRect(x + 2, y + h - 9, 7, 9);
    ctx.fillRect(x + w - 9, y + h - 9, 7, 9);
    // Weapon
    ctx.fillStyle = Colors.GOBLIN_WEAPON;
    if (variant === 'melee') {
      ctx.fillRect(f === 1 ? x + w - 2 : x - 4, y + 6, 3, 12);
      ctx.fillRect(f === 1 ? x + w - 4 : x - 6, y + 5, 7, 4); // crude blade
    } else {
      // Staff
      ctx.fillRect(f === 1 ? x + w : x - 5, y + 2, 3, h - 4);
      ctx.fillStyle = '#aa44ff';
      ctx.beginPath();
      ctx.arc(f === 1 ? x + w + 1 : x - 4, y + 3, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  _drawOrc(ctx, x, y, w, h, f, variant) {
    // Armored body
    ctx.fillStyle = Colors.ORC_ARMOR;
    ctx.fillRect(x + 2, y + 10, w - 4, h - 16);
    ctx.fillStyle = Colors.ORC_SKIN;
    ctx.fillRect(x + 5, y + 14, w - 10, h - 22);
    // Head
    ctx.fillStyle = Colors.ORC_SKIN;
    ctx.fillRect(x + 3, y + 1, w - 6, 14);
    // Tusks
    ctx.fillStyle = '#eeee88';
    ctx.fillRect(x + 4, y + 12, 4, 5);
    ctx.fillRect(x + w - 8, y + 12, 4, 5);
    // Helmet
    ctx.fillStyle = Colors.ORC_ARMOR;
    ctx.fillRect(x + 3, y, w - 6, 7);
    // Legs
    ctx.fillStyle = '#444';
    ctx.fillRect(x + 3, y + h - 12, 10, 12);
    ctx.fillRect(x + w - 13, y + h - 12, 10, 12);
    // Weapon
    ctx.fillStyle = '#888';
    if (variant === 'melee') {
      // Axe
      const ax = f === 1 ? x + w : x - 12;
      ctx.fillRect(ax + (f === 1 ? 0 : 4), y + 6, 4, 20);
      ctx.fillStyle = '#aaa';
      ctx.fillRect(ax, y + 4, 12, 10);
    } else {
      // Heavy bow
      ctx.strokeStyle = '#664422';
      ctx.lineWidth = 3;
      const bx = f === 1 ? x + w + 2 : x - 10;
      ctx.beginPath();
      ctx.arc(bx + (f === 1 ? 3 : -3), y + h / 2, 14, -1.1, 1.1, f !== 1);
      ctx.stroke();
    }
  }

  _drawBoss(ctx, enemy) {
    const { x, y, w, h, facing: f, faction, phase2 } = enemy;
    const pulse = phase2 ? 0.7 + Math.sin(Date.now() / 100) * 0.3 : 1;

    ctx.save();
    ctx.globalAlpha = ctx.globalAlpha * pulse;

    // Big imposing figure
    ctx.fillStyle = Colors.BOSS_ARMOR;
    ctx.fillRect(x + 2, y + 8, w - 4, h - 14);

    // Faction-specific body color
    const skinColor = faction === 'bandits' ? '#8b6914' :
                      faction === 'goblins' ? '#5aaa3c' : '#7a9e30';
    ctx.fillStyle = skinColor;
    ctx.fillRect(x + 6, y + 14, w - 12, h - 22);

    // Head
    ctx.fillStyle = skinColor;
    ctx.fillRect(x + 4, y, w - 8, 16);

    // Crown/helmet
    ctx.fillStyle = Colors.COOLDOWN_READY;
    ctx.fillRect(x + 4, y - 6, w - 8, 8);
    for (let cx = x + 6; cx < x + w - 6; cx += 8) {
      ctx.fillRect(cx, y - 10, 4, 6);
    }

    // Boss weapon (big)
    ctx.fillStyle = '#888';
    const wx = f === 1 ? x + w : x - 16;
    ctx.fillRect(wx, y + 4, 6, 28);
    ctx.fillStyle = '#bbb';
    ctx.fillRect(wx - 4, y + 2, 14, 14); // blade

    // Phase 2 glow
    if (phase2) {
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
    }

    ctx.restore();
  }

  _drawEnemyHP(ctx, enemy) {
    const bw = enemy.w + 8;
    const bx = enemy.x - 4;
    const by = enemy.y - 10;
    const frac = Math.max(0, enemy.hp / enemy.maxHp);

    ctx.fillStyle = '#222';
    ctx.fillRect(bx, by, bw, 5);
    ctx.fillStyle = frac > 0.5 ? Colors.HP_HIGH : frac > 0.25 ? Colors.HP_MED : Colors.HP_LOW;
    ctx.fillRect(bx, by, Math.round(bw * frac), 5);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, bw, 5);
  }

  // ─── Projectiles ─────────────────────────────────────────────────────────
  _drawProjectile(proj) {
    const ctx = this.ctx;
    const isPlayer = proj.owner === 'player';
    ctx.save();
    ctx.fillStyle = isPlayer ? Colors.PROJECTILE_ARROW : Colors.PROJECTILE_BOLT;
    // Rotate to direction
    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.translate(proj.cx, proj.cy);
    ctx.rotate(angle);
    ctx.fillRect(-proj.w / 2, -proj.h / 2, proj.w, proj.h);
    // Arrow tip
    if (isPlayer) {
      ctx.fillStyle = '#eeee22';
      ctx.beginPath();
      ctx.moveTo(proj.w / 2, 0);
      ctx.lineTo(proj.w / 2 - 4, -3);
      ctx.lineTo(proj.w / 2 - 4, 3);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  // ─── Effects ─────────────────────────────────────────────────────────────
  _drawEffect(ef) {
    const ctx = this.ctx;
    const prog = ef.timer / ef.maxTimer;
    ctx.save();
    ctx.globalAlpha = prog;

    switch (ef.type) {
      case 'hit':
        ctx.fillStyle = Colors.HIT_FLASH;
        ctx.beginPath();
        ctx.arc(ef.x, ef.y, 12 * (1 - prog) + 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'aoe_ring':
        const r = ef.radius * (1 - prog * 0.3);
        ctx.strokeStyle = Colors.AOE_RING;
        ctx.lineWidth = 4 * prog;
        ctx.beginPath();
        ctx.arc(ef.cx, ef.cy, r, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'slash':
        ctx.strokeStyle = Colors.HIT_FLASH;
        ctx.lineWidth = 3;
        ctx.beginPath();
        const sx = ef.facing === 1 ? ef.x : ef.x + ef.w;
        ctx.moveTo(sx, ef.y);
        ctx.lineTo(sx + ef.facing * ef.w * prog, ef.y + ef.h);
        ctx.stroke();
        break;
    }
    ctx.restore();
  }

  // ─── Character Select ───────────────────────────────────────────────────
  renderCharacterSelect(selectedIndex) {
    const ctx = this.ctx;
    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, this.H);
    grad.addColorStop(0, '#0d1b2a');
    grad.addColorStop(1, '#1e3a5f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.W, this.H);

    // Stars
    ctx.fillStyle = Colors.STAR;
    for (const s of this._stars) {
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Title
    ctx.fillStyle = Colors.COOLDOWN_READY;
    ctx.font = 'bold 32px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MEDIEVAL FANTASY', 400, 55);
    ctx.fillStyle = Colors.HUD_TEXT;
    ctx.font = '16px monospace';
    ctx.fillText('Choose your champion', 400, 80);

    // Controls hint
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '12px monospace';
    ctx.fillText('← → to select   Enter to confirm', 400, 480);
    ctx.fillText('Z/J: Attack   X/K: Special   WASD/Arrows: Move   Space/W: Jump', 400, 460);

    // Cards
    const defs = Object.values(CharacterDefs);
    const cardW = 200, cardH = 280, gap = 30;
    const totalW = defs.length * cardW + (defs.length - 1) * gap;
    const startX = (this.W - totalW) / 2;

    defs.forEach((def, i) => {
      const cx = startX + i * (cardW + gap);
      const cy = 110;
      const selected = i === selectedIndex;

      // Card background
      ctx.fillStyle = selected ? 'rgba(255,200,50,0.2)' : 'rgba(0,0,0,0.5)';
      ctx.fillRect(cx, cy, cardW, cardH);
      ctx.strokeStyle = selected ? Colors.COOLDOWN_READY : 'rgba(255,255,255,0.3)';
      ctx.lineWidth = selected ? 3 : 1;
      ctx.strokeRect(cx, cy, cardW, cardH);

      // Character preview (2x scale)
      ctx.save();
      ctx.translate(cx + cardW / 2, cy + 80);
      ctx.scale(2, 2);
      const pw = def.width, ph = def.height;
      const px = -pw / 2, py = -ph / 2;
      switch (def.id) {
        case 'champion': this._drawChampion(ctx, px, py, pw, ph, 1, { state: 'idle' }); break;
        case 'ranger':   this._drawRanger(ctx, px, py, pw, ph, 1, { state: 'idle' }); break;
        case 'savage':   this._drawSavage(ctx, px, py, pw, ph, 1, { state: 'idle' }); break;
      }
      ctx.restore();

      // Name
      ctx.fillStyle = selected ? Colors.COOLDOWN_READY : Colors.HUD_TEXT;
      ctx.font = `bold ${selected ? 18 : 16}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(def.name, cx + cardW / 2, cy + 155);

      // Description
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '10px monospace';
      ctx.fillText(def.description, cx + cardW / 2, cy + 172);

      // Stats
      const statY = cy + 192;
      const stats = [
        ['ATK', def.stats.attack],
        ['DEF', def.stats.defense],
        ['SPD', def.stats.speed],
        ['SPC', def.stats.special],
      ];
      stats.forEach(([label, val], si) => {
        const sy = statY + si * 18;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(label, cx + 12, sy + 10);
        // Bar
        ctx.fillStyle = '#333';
        ctx.fillRect(cx + 40, sy + 2, 120, 9);
        ctx.fillStyle = Colors.HP_HIGH;
        ctx.fillRect(cx + 40, sy + 2, Math.round(val / 5 * 120), 9);
      });
    });
  }

  // ─── Game Over ────────────────────────────────────────────────────────────
  renderGameOver() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, this.W, this.H);
    ctx.fillStyle = Colors.HP_LOW;
    ctx.font = 'bold 52px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 400, 220);
    ctx.fillStyle = Colors.HUD_TEXT;
    ctx.font = '18px monospace';
    ctx.fillText('Press Enter to return to character select', 400, 270);
    ctx.restore();
  }
}
