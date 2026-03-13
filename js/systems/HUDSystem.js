import { Colors } from '../AssetManager.js';

export class HUDSystem {
  constructor(ctx) {
    this.ctx = ctx;
    this.bossWarningTimer = 0;
    this.bossWarningActive = false;
    this.stageClearTimer = 0;
  }

  showBossWarning() {
    this.bossWarningTimer = 2500;
    this.bossWarningActive = true;
  }

  showStageClear() {
    this.stageClearTimer = 3000;
  }

  update(dt) {
    this.bossWarningTimer = Math.max(0, this.bossWarningTimer - dt * 1000);
    if (this.bossWarningTimer <= 0) this.bossWarningActive = false;
    this.stageClearTimer = Math.max(0, this.stageClearTimer - dt * 1000);
  }

  render(player, stageNum, enemiesDefeated, totalEnemies) {
    if (!player) return;
    const ctx = this.ctx;

    this._drawHPBar(ctx, player);
    this._drawLives(ctx, player);
    this._drawCooldown(ctx, player);
    this._drawStageInfo(ctx, stageNum, enemiesDefeated, totalEnemies);

    if (this.bossWarningActive) {
      this._drawBossWarning(ctx);
    }
    if (this.stageClearTimer > 0) {
      this._drawStageClear(ctx);
    }
  }

  _drawHPBar(ctx, player) {
    const x = 12, y = 12, w = 200, h = 18;
    // Background
    ctx.fillStyle = Colors.HP_BG;
    ctx.fillRect(x, y, w, h);

    // HP fill
    const frac = player.hp / player.maxHp;
    const fw = Math.round(w * frac);
    const color = frac > 0.6 ? Colors.HP_HIGH : frac > 0.3 ? Colors.HP_MED : Colors.HP_LOW;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, fw, h);

    // Border
    ctx.strokeStyle = Colors.HP_BORDER;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Label
    ctx.fillStyle = Colors.HUD_TEXT;
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('HP', x + 4, y + 13);
  }

  _drawLives(ctx, player) {
    const startX = 220, y = 14;
    for (let i = 0; i < player.maxLives; i++) {
      const cx = startX + i * 22;
      const filled = i < player.lives;
      ctx.fillStyle = filled ? Colors.HEART : '#555555';
      // Diamond heart shape
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(cx + 8, y + 7);
      ctx.lineTo(cx, y + 14);
      ctx.lineTo(cx - 8, y + 7);
      ctx.closePath();
      ctx.fill();
    }
  }

  _drawCooldown(ctx, player) {
    const cx = 400, cy = 478, r = 20;
    const frac = player.specialCooldownFraction;
    const ready = frac <= 0;

    // Background circle
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fill();

    // Cooldown arc
    if (!ready) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (1 - frac) * Math.PI * 2;
      ctx.arc(cx, cy, r - 2, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = Colors.COOLDOWN_USED;
      ctx.fill();
    }

    // Ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = ready ? Colors.COOLDOWN_READY : '#777777';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Key label
    ctx.fillStyle = ready ? Colors.COOLDOWN_READY : '#aaaaaa';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('X', cx, cy + 4);

    // Special name below
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '9px monospace';
    ctx.fillText(player.def.specialAttack.name, cx, cy + 18);
  }

  _drawStageInfo(ctx, stageNum, defeated, total) {
    ctx.fillStyle = Colors.HUD_BG;
    ctx.fillRect(650, 8, 142, 28);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(650, 8, 142, 28);

    ctx.fillStyle = Colors.HUD_ACCENT;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`Stage ${stageNum}`, 788, 22);
    ctx.fillStyle = Colors.HUD_TEXT;
    ctx.font = '10px monospace';
    ctx.fillText(`Enemies ${defeated}/${total}`, 788, 33);
  }

  _drawBossWarning(ctx) {
    const alpha = Math.min(1, this.bossWarningTimer / 500);
    ctx.save();
    ctx.globalAlpha = alpha * (Math.sin(Date.now() / 150) * 0.3 + 0.7);
    ctx.fillStyle = Colors.BOSS_WARNING;
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ BOSS INCOMING ⚠', 400, 200);
    ctx.restore();
  }

  _drawStageClear(ctx) {
    const alpha = Math.min(1, this.stageClearTimer / 500);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = Colors.STAGE_CLEAR;
    ctx.font = 'bold 42px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('STAGE CLEAR!', 400, 220);
    ctx.restore();
  }
}
