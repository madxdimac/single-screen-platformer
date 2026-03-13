'use strict';

// ─── AssetManager ────────────────────────────────────────────────────────────
const Colors = Object.freeze({
  SKY_TOP: '#0d1b2a', SKY_BOTTOM: '#1e3a5f', STAR: '#ffffff', MOUNTAIN: '#1a2744',
  PLATFORM_TOP: '#7a6b52', PLATFORM_BODY: '#5c4a35', PLATFORM_SHADOW: '#3d3020', PLATFORM_DETAIL: '#8a7a62',
  CHAMPION_BODY: '#4a90d9', CHAMPION_ARMOR: '#2c5f8a', CHAMPION_SHIELD: '#c8a800', CHAMPION_SWORD: '#e0e0e0',
  RANGER_BODY: '#5a8a3c', RANGER_CLOAK: '#3d6028', RANGER_BOW: '#8b6914', RANGER_ARROW: '#c8a800',
  SAVAGE_BODY: '#8b4513', SAVAGE_FUR: '#5c3010', SAVAGE_HAMMER: '#888888', SAVAGE_HANDLE: '#6b4226',
  BANDIT_BODY: '#8b6914', BANDIT_CLOTH: '#6b4226', BANDIT_WEAPON: '#aaaaaa',
  GOBLIN_BODY: '#5a8a3c', GOBLIN_SKIN: '#7ab040', GOBLIN_WEAPON: '#888888',
  ORC_BODY: '#5c7a20', ORC_SKIN: '#7a9e30', ORC_ARMOR: '#555555',
  BOSS_BODY: '#8b0000', BOSS_ARMOR: '#333333',
  HP_HIGH: '#44cc44', HP_MED: '#cccc44', HP_LOW: '#cc4444', HP_BG: '#333333', HP_BORDER: '#888888',
  HEART: '#cc2244', COOLDOWN_READY: '#ffd700', COOLDOWN_USED: '#555555',
  HUD_BG: 'rgba(0,0,0,0.5)', HUD_TEXT: '#ffffff', HUD_ACCENT: '#ffd700',
  WHITE: '#ffffff', BLACK: '#000000', TRANSPARENT: 'rgba(0,0,0,0)',
  HIT_FLASH: '#ffffff', INVINCIBLE: 'rgba(255,255,255,0.4)',
  BOSS_WARNING: '#ff4444', STAGE_CLEAR: '#ffd700',
  PROJECTILE_ARROW: '#c8a800', PROJECTILE_BOLT: '#aa4444', AOE_RING: 'rgba(255,150,0,0.6)',
});

// ─── CharacterDefs ────────────────────────────────────────────────────────────
const CharacterDefs = Object.freeze({
  champion: {
    id: 'champion', name: 'Champion', hp: 100, speed: 200, defense: 1.5, jumpForce: -520, width: 28, height: 40,
    normalAttack: { name: 'Sword Slash', damage: 15, range: 30, type: 'melee', duration: 200, cooldown: 400 },
    specialAttack: { name: 'Shield Rush', damage: 30, type: 'dash', dashSpeed: 700, duration: 400, cooldown: 5000 },
    description: 'Balanced knight with high defense',
    stats: { attack: 3, defense: 5, speed: 3, special: 4 },
  },
  ranger: {
    id: 'ranger', name: 'Ranger', hp: 80, speed: 250, defense: 1.0, jumpForce: -540, width: 24, height: 38,
    normalAttack: { name: 'Arrow Shot', damage: 20, type: 'projectile', speed: 500, cooldown: 500 },
    specialAttack: { name: 'Arrow Volley', damage: 40, count: 3, type: 'volley', speed: 480, piercing: true, cooldown: 4000 },
    description: 'Swift archer dealing ranged damage',
    stats: { attack: 4, defense: 2, speed: 5, special: 4 },
  },
  savage: {
    id: 'savage', name: 'Savage', hp: 150, speed: 150, defense: 1.0, jumpForce: -580, width: 32, height: 44,
    normalAttack: { name: 'Hammer Smash', damage: 25, range: 50, type: 'melee', duration: 300, cooldown: 600 },
    specialAttack: { name: 'Ground Pound', damage: 50, type: 'aoe', jumpForce: -700, radius: 80, cooldown: 6000 },
    description: 'Heavy brawler with massive HP and power',
    stats: { attack: 5, defense: 3, speed: 1, special: 5 },
  },
});

// ─── EnemyDefs ────────────────────────────────────────────────────────────────
const EnemyDefs = Object.freeze({
  banditThug:    { id:'banditThug',    name:'Bandit Thug',    faction:'bandits', hp:40,  speed:120, damage:8,  variant:'melee',  attackRange:35,  attackCooldown:1200, aggroRange:300, width:26, height:38, xpValue:10 },
  banditArcher:  { id:'banditArcher',  name:'Bandit Archer',  faction:'bandits', hp:30,  speed:80,  damage:12, variant:'ranged', attackRange:250, minRange:120, attackCooldown:2000, projectileSpeed:280, aggroRange:320, width:24, height:36, xpValue:15 },
  goblinWarrior: { id:'goblinWarrior', name:'Goblin Warrior', faction:'goblins', hp:30,  speed:160, damage:10, variant:'melee',  attackRange:30,  attackCooldown:900,  aggroRange:280, width:22, height:30, xpValue:12 },
  goblinShaman:  { id:'goblinShaman',  name:'Goblin Shaman',  faction:'goblins', hp:25,  speed:100, damage:15, variant:'ranged', attackRange:260, minRange:120, attackCooldown:2200, projectileSpeed:240, aggroRange:300, width:22, height:32, xpValue:18 },
  orcBrute:      { id:'orcBrute',      name:'Orc Brute',      faction:'orcs',    hp:80,  speed:90,  damage:18, variant:'melee',  attackRange:45,  attackCooldown:1400, aggroRange:250, width:34, height:44, xpValue:20 },
  orcArcher:     { id:'orcArcher',     name:'Orc Archer',     faction:'orcs',    hp:50,  speed:70,  damage:15, variant:'ranged', attackRange:270, minRange:130, attackCooldown:2400, projectileSpeed:300, aggroRange:310, width:28, height:40, xpValue:18 },
});

const BossDefs = Object.freeze({
  banditBoss: { id:'banditBoss', name:'Bandit King',    faction:'bandits', hp:200, speed:140, damage:25, variant:'boss', attackRange:50, attackCooldown:1000, aggroRange:500, chargeSpeed:380, chargeCooldown:3500, width:36, height:48, phase2Threshold:0.5, xpValue:100 },
  goblinBoss: { id:'goblinBoss', name:'Goblin Warchief',faction:'goblins', hp:240, speed:160, damage:28, variant:'boss', attackRange:40, attackCooldown:900,  aggroRange:500, chargeSpeed:360, chargeCooldown:3000, width:32, height:40, phase2Threshold:0.5, xpValue:100 },
  orcBoss:    { id:'orcBoss',    name:'Orc Warlord',    faction:'orcs',    hp:300, speed:110, damage:35, variant:'boss', attackRange:60, attackCooldown:1200, aggroRange:500, chargeSpeed:420, chargeCooldown:4000, width:44, height:54, phase2Threshold:0.5, xpValue:100 },
});

// ─── StageDefs ────────────────────────────────────────────────────────────────
const StageDefs = [
  {
    id:1, name:'Bandit Camp', faction:'bandits', bgVariant:0,
    platforms:[
      {x:0,y:460,w:800,h:40,oneWay:false},
      {x:100,y:360,w:150,h:16,oneWay:true},{x:540,y:360,w:150,h:16,oneWay:true},
      {x:310,y:290,w:180,h:16,oneWay:true},
      {x:60,y:220,w:120,h:16,oneWay:true},{x:620,y:220,w:120,h:16,oneWay:true},
    ],
    spawnPoints:[{x:50,y:420},{x:750,y:420},{x:150,y:320},{x:620,y:320},{x:390,y:250}],
    playerStart:{x:380,y:400},
  },
  {
    id:2, name:'Bandit Outpost', faction:'bandits', bgVariant:0,
    platforms:[
      {x:0,y:460,w:800,h:40,oneWay:false},
      {x:50,y:370,w:130,h:16,oneWay:true},{x:330,y:370,w:140,h:16,oneWay:true},{x:600,y:370,w:160,h:16,oneWay:true},
      {x:180,y:280,w:120,h:16,oneWay:true},{x:490,y:280,w:130,h:16,oneWay:true},
      {x:320,y:200,w:160,h:16,oneWay:true},
    ],
    spawnPoints:[{x:40,y:420},{x:760,y:420},{x:110,y:330},{x:670,y:330},{x:400,y:160}],
    playerStart:{x:380,y:400},
  },
  {
    id:3, name:'Goblin Forest', faction:'goblins', bgVariant:1,
    platforms:[
      {x:0,y:460,w:800,h:40,oneWay:false},
      {x:80,y:380,w:120,h:16,oneWay:true},{x:280,y:340,w:100,h:16,oneWay:true},
      {x:470,y:380,w:120,h:16,oneWay:true},{x:620,y:310,w:130,h:16,oneWay:true},
      {x:150,y:270,w:140,h:16,oneWay:true},{x:380,y:250,w:120,h:16,oneWay:true},
      {x:240,y:180,w:100,h:16,oneWay:true},{x:500,y:190,w:110,h:16,oneWay:true},
    ],
    spawnPoints:[{x:30,y:420},{x:770,y:420},{x:130,y:340},{x:530,y:340},{x:440,y:210}],
    playerStart:{x:380,y:400},
  },
  {
    id:4, name:'Goblin Ruins', faction:'goblins', bgVariant:1,
    platforms:[
      {x:0,y:460,w:300,h:40,oneWay:false},{x:500,y:460,w:300,h:40,oneWay:false},
      {x:280,y:420,w:240,h:20,oneWay:false},
      {x:100,y:350,w:140,h:16,oneWay:true},{x:330,y:320,w:140,h:16,oneWay:true},{x:570,y:350,w:130,h:16,oneWay:true},
      {x:50,y:250,w:120,h:16,oneWay:true},{x:350,y:230,w:100,h:16,oneWay:true},{x:620,y:240,w:140,h:16,oneWay:true},
      {x:220,y:160,w:150,h:16,oneWay:true},{x:460,y:170,w:130,h:16,oneWay:true},
    ],
    spawnPoints:[{x:50,y:420},{x:750,y:420},{x:160,y:310},{x:620,y:310},{x:395,y:190}],
    playerStart:{x:380,y:380},
  },
  {
    id:5, name:'Orc Fortress', faction:'orcs', bgVariant:2,
    platforms:[
      {x:0,y:460,w:800,h:40,oneWay:false},
      {x:120,y:380,w:160,h:16,oneWay:true},{x:520,y:380,w:160,h:16,oneWay:true},
      {x:310,y:340,w:180,h:16,oneWay:true},
      {x:60,y:280,w:130,h:16,oneWay:true},{x:610,y:280,w:130,h:16,oneWay:true},
      {x:280,y:230,w:240,h:16,oneWay:true},
      {x:150,y:170,w:120,h:16,oneWay:true},{x:530,y:170,w:120,h:16,oneWay:true},
    ],
    spawnPoints:[{x:40,y:420},{x:760,y:420},{x:190,y:340},{x:590,y:340},{x:395,y:300}],
    playerStart:{x:380,y:400},
  },
];

// ─── Entity ───────────────────────────────────────────────────────────────────
let _nextId = 0;
class Entity {
  constructor(x, y, w, h) {
    this.id = _nextId++;
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.vx = 0; this.vy = 0;
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
    return this.left < other.right && this.right > other.left &&
           this.top < other.bottom && this.bottom > other.top;
  }
  storePrev() { this.prevBottom = this.bottom; this.prevTop = this.top; }
}

// ─── Platform ─────────────────────────────────────────────────────────────────
class Platform extends Entity {
  constructor(x, y, w, h, oneWay = false) {
    super(x, y, w, h);
    this.oneWay = oneWay;
    this.active = true;
  }
}

// ─── Projectile ───────────────────────────────────────────────────────────────
class Projectile extends Entity {
  constructor({ x, y, vx, vy, damage, owner, piercing = false, maxRange = 600, w = 12, h = 5 }) {
    super(x, y, w, h);
    this.vx = vx; this.vy = vy;
    this.damage = damage;
    this.owner = owner;
    this.piercing = piercing;
    this.maxRange = maxRange;
    this.hitEntities = new Set();
    this.startX = x; this.startY = y;
    this.affectedByGravity = false;
  }
  update(dt) {
    this.storePrev();
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    const dist = Math.hypot(this.x - this.startX, this.y - this.startY);
    if (dist > this.maxRange || this.x < -20 || this.x > 820 || this.y < -20 || this.y > 520) {
      this.active = false;
    }
  }
}

// ─── Player ───────────────────────────────────────────────────────────────────
class Player extends Entity {
  constructor(def, startX, startY) {
    super(startX - def.width / 2, startY - def.height, def.width, def.height);
    this.def = def;
    this.charId = def.id;
    this.maxHp = def.hp; this.hp = def.hp;
    this.speed = def.speed; this.defense = def.defense; this.jumpForce = def.jumpForce;
    this.maxLives = 3; this.lives = 3;
    this.facing = 1;
    this.state = 'idle';
    this.invincibleTimer = 0; this.attackTimer = 0;
    this.attackCooldownTimer = 0; this.specialCooldownTimer = 0;
    this.dead = false; this.respawnTimer = 0;
    this.groundPounding = false; this.gpLaunched = false;
    this.dashing = false; this.dashTimer = 0; this.dashDirection = 1;
    this.ignorePlatform = false; this.ignorePlatformTimer = 0;
    this.attackAnim = 0;
    this._pendingAttack = null; this._pendingSpecial = null; this._pendingAOE = null;
  }
  get isInvincible() { return this.invincibleTimer > 0; }
  get specialReady() { return this.specialCooldownTimer <= 0; }
  get attackReady()  { return this.attackCooldownTimer <= 0 && this.attackTimer <= 0; }
  get specialCooldownFraction() { return Math.max(0, this.specialCooldownTimer / this.def.specialAttack.cooldown); }

  update(dt, input) {
    if (this.dead) { this.respawnTimer -= dt * 1000; return; }
    this.invincibleTimer    = Math.max(0, this.invincibleTimer    - dt * 1000);
    this.attackCooldownTimer= Math.max(0, this.attackCooldownTimer- dt * 1000);
    this.specialCooldownTimer=Math.max(0, this.specialCooldownTimer-dt * 1000);
    this.attackTimer        = Math.max(0, this.attackTimer        - dt * 1000);
    if (this.ignorePlatformTimer > 0) {
      this.ignorePlatformTimer -= dt * 1000;
      this.ignorePlatform = true;
      if (this.ignorePlatformTimer <= 0) this.ignorePlatform = false;
    }
    this.attackAnim = this.attackTimer > 0 ? 1 - (this.attackTimer / this.def.normalAttack.duration) : 0;
    this._handleMovement(dt, input);
    this._handleAttacks(dt, input);
    this._updateState();
  }

  _handleMovement(dt, input) {
    if (this.dashing) return;
    if (this.groundPounding && this.gpLaunched) { this.vx = 0; return; }
    if (input.left)       { this.vx = -this.speed; this.facing = -1; }
    else if (input.right) { this.vx =  this.speed; this.facing =  1; }
    else                  { this.vx = 0; }
    if (input.jump && this.onGround) {
      if ((input.isDown('ArrowDown') || input.isDown('KeyS')) && this.onPlatform && this.onPlatform.oneWay) {
        this.ignorePlatform = true; this.ignorePlatformTimer = 300;
      } else {
        this.vy = this.jumpForce; this.onGround = false;
      }
    }
  }
  _handleAttacks(dt, input) {}
  _updateState() {
    if (this.dashing || this.groundPounding) { this.state = 'special'; return; }
    if (this.attackTimer > 0) { this.state = 'attack'; return; }
    if (!this.onGround) { this.state = this.vy < 0 ? 'jump' : 'fall'; }
    else if (this.vx !== 0) { this.state = 'run'; }
    else { this.state = 'idle'; }
  }
  takeDamage(amount, source) {
    if (this.isInvincible || this.dead) return;
    this.hp -= Math.max(1, amount / this.defense);
    this.invincibleTimer = 1500;
    if (source) { const dir = this.cx > (source.cx || source.x || 0) ? 1 : -1; this.vx += dir * 200; this.vy -= 80; }
    if (this.hp <= 0) { this.hp = 0; this._die(); }
  }
  _die() { this.lives--; this.dead = true; this.respawnTimer = 1500; this.vx = 0; }
  respawn(x, y) {
    this.dead = false; this.hp = this.maxHp;
    this.x = x - this.w / 2; this.y = y - this.h;
    this.vx = 0; this.vy = 0;
    this.invincibleTimer = 2000;
    this.groundPounding = false; this.gpLaunched = false; this.dashing = false;
  }
  restoreForStage() {
    this.hp = this.maxHp; this.lives = this.maxLives; this.dead = false;
    this.invincibleTimer = 0; this.specialCooldownTimer = 0;
    this.attackCooldownTimer = 0; this.attackTimer = 0;
    this.groundPounding = false; this.dashing = false;
  }
}

// ─── Champion ─────────────────────────────────────────────────────────────────
class Champion extends Player {
  constructor(def, x, y) {
    super(def, x, y);
    this.dashDuration = def.specialAttack.duration;
    this.dashSpeed = def.specialAttack.dashSpeed;
  }
  _handleAttacks(dt, input) {
    if (this.dashing) {
      this.dashTimer -= dt * 1000;
      this.vx = this.dashDirection * this.dashSpeed;
      if (this.dashTimer <= 0) { this.dashing = false; this.vx = 0; }
      return;
    }
    if (input.attack && this.attackReady) {
      this.attackTimer = this.def.normalAttack.duration;
      this.attackCooldownTimer = this.def.normalAttack.cooldown;
      this._pendingAttack = { type: 'melee' };
    }
    if (input.special && this.specialReady) {
      this.dashing = true; this.dashTimer = this.dashDuration;
      this.dashDirection = this.facing;
      this.specialCooldownTimer = this.def.specialAttack.cooldown;
      this.invincibleTimer = this.dashDuration + 100;
      this._pendingSpecial = { type: 'dash' };
    }
  }
}

// ─── Ranger ───────────────────────────────────────────────────────────────────
class Ranger extends Player {
  constructor(def, x, y) { super(def, x, y); }
  _handleAttacks(dt, input) {
    if (input.attack && this.attackReady) {
      this.attackTimer = 200; this.attackCooldownTimer = this.def.normalAttack.cooldown;
      this._pendingAttack = { type: 'projectile', piercing: false };
    }
    if (input.special && this.specialReady) {
      this.attackTimer = 300; this.specialCooldownTimer = this.def.specialAttack.cooldown;
      this._pendingSpecial = { type: 'volley', count: 3, piercing: true };
    }
  }
}

// ─── Savage ───────────────────────────────────────────────────────────────────
class Savage extends Player {
  constructor(def, x, y) { super(def, x, y); }
  _handleAttacks(dt, input) {
    if (this.groundPounding) {
      if (this.gpLaunched && this.onGround) {
        this.groundPounding = false; this.gpLaunched = false;
        this._pendingAOE = { type: 'aoe', radius: this.def.specialAttack.radius };
      }
      return;
    }
    if (input.attack && this.attackReady) {
      this.attackTimer = this.def.normalAttack.duration;
      this.attackCooldownTimer = this.def.normalAttack.cooldown;
      this._pendingAttack = { type: 'melee' };
    }
    if (input.special && this.specialReady && this.onGround) {
      this.vy = this.def.specialAttack.jumpForce; this.onGround = false;
      this.groundPounding = true; this.gpLaunched = false;
      this.specialCooldownTimer = this.def.specialAttack.cooldown;
    }
  }
  update(dt, input) {
    super.update(dt, input);
    if (this.groundPounding && !this.gpLaunched && this.vy >= 0) {
      this.gpLaunched = true; this.vy = 600;
    }
  }
}

// ─── Enemy ────────────────────────────────────────────────────────────────────
class Enemy extends Entity {
  constructor(def, x, y, difficultyMod = 1.0) {
    super(x - def.width / 2, y - def.height, def.width, def.height);
    this.def = def; this.enemyId = def.id; this.faction = def.faction; this.variant = def.variant;
    this.maxHp = Math.round(def.hp * difficultyMod); this.hp = this.maxHp;
    this.speed = def.speed * difficultyMod; this.damage = def.damage * difficultyMod;
    this.attackRange = def.attackRange; this.attackCooldown = def.attackCooldown;
    this.aggroRange = def.aggroRange; this.projectileSpeed = def.projectileSpeed || 260;
    this.aiState = 'patrol'; this.patrolDir = Math.random() < 0.5 ? -1 : 1; this.patrolTimer = 0;
    this.attackCooldownTimer = 0; this.facing = this.patrolDir;
    this.spawnX = x; this.patrolMinX = x - 100; this.patrolMaxX = x + 100;
    this.hitFlashTimer = 0; this.phase2 = false; this._pendingAttack = null;
  }
  takeDamage(amount, sourceX) {
    if (!this.active) return;
    this.hp -= amount; this.hitFlashTimer = 200;
    if (sourceX !== undefined) { const dir = this.cx > sourceX ? 1 : -1; this.vx += dir * 200; this.vy -= 80; }
    if (this.hp <= 0) { this.hp = 0; this.active = false; }
  }
  update(dt) {
    this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt * 1000);
    this.attackCooldownTimer = Math.max(0, this.attackCooldownTimer - dt * 1000);
    this.storePrev();
  }
}

// ─── Enemy subclasses ─────────────────────────────────────────────────────────
class BanditThug    extends Enemy { constructor(x,y,d=1){super(EnemyDefs.banditThug,   x,y,d);} }
class BanditArcher  extends Enemy { constructor(x,y,d=1){super(EnemyDefs.banditArcher,  x,y,d); this.minRange=EnemyDefs.banditArcher.minRange;} }
class GoblinWarrior extends Enemy { constructor(x,y,d=1){super(EnemyDefs.goblinWarrior, x,y,d);} }
class GoblinShaman  extends Enemy { constructor(x,y,d=1){super(EnemyDefs.goblinShaman,  x,y,d); this.minRange=EnemyDefs.goblinShaman.minRange;} }
class OrcBrute      extends Enemy { constructor(x,y,d=1){super(EnemyDefs.orcBrute,      x,y,d);} }
class OrcArcher     extends Enemy { constructor(x,y,d=1){super(EnemyDefs.orcArcher,     x,y,d); this.minRange=EnemyDefs.orcArcher.minRange;} }

// ─── Boss ─────────────────────────────────────────────────────────────────────
class Boss extends Enemy {
  constructor(bossDef, x, y, diff = 1.0) {
    super(bossDef, x, y, diff);
    this.isBoss = true;
    this.chargeCooldown = bossDef.chargeCooldown;
    this.chargeCooldownTimer = bossDef.chargeCooldown * 1.5;
    this.chargeSpeed = bossDef.chargeSpeed;
    this.charging = false; this.chargeTimer = 0; this.chargeDuration = 500; this.chargeDirection = 1;
    this.phase2Threshold = bossDef.phase2Threshold;
  }
  update(dt) {
    super.update(dt);
    this.chargeCooldownTimer = Math.max(0, this.chargeCooldownTimer - dt * 1000);
    if (!this.phase2 && this.hp / this.maxHp <= this.phase2Threshold) {
      this.phase2 = true; this.speed *= 1.5; this.attackCooldown *= 0.7; this.chargeCooldown *= 0.7;
    }
    if (this.charging) {
      this.chargeTimer -= dt * 1000;
      this.vx = this.chargeDirection * this.chargeSpeed;
      if (this.chargeTimer <= 0) { this.charging = false; this.vx = 0; }
    }
  }
  tryCharge(playerX) {
    if (this.chargeCooldownTimer > 0 || this.charging) return false;
    this.charging = true; this.chargeTimer = this.chargeDuration;
    this.chargeDirection = playerX > this.cx ? 1 : -1;
    this.chargeCooldownTimer = this.chargeCooldown;
    return true;
  }
}

// ─── InputManager ─────────────────────────────────────────────────────────────
class InputManager {
  constructor() {
    this._keys = {}; this._prevKeys = {};
    this._snapshot = {}; this._prevSnapshot = {};
    window.addEventListener('keydown', e => { this._keys[e.code] = true; e.preventDefault(); });
    window.addEventListener('keyup',   e => { this._keys[e.code] = false; });
  }
  snapshot() { this._prevSnapshot = Object.assign({}, this._snapshot); this._snapshot = Object.assign({}, this._keys); }
  isDown(code)    { return !!this._snapshot[code]; }
  isPressed(code) { return !!this._snapshot[code] && !this._prevSnapshot[code]; }
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
}

// ─── PhysicsEngine ────────────────────────────────────────────────────────────
class PhysicsEngine {
  update(dt, movables, platforms) {
    for (const e of movables) {
      if (!e.active || e.affectedByGravity === false) continue;
      e.storePrev();
      e.vy += 1400 * dt;
      if (e.vy > 900) e.vy = 900;
      e.x += e.vx * dt; e.y += e.vy * dt;
      if (e.x < 0) { e.x = 0; e.vx = 0; }
      if (e.x + e.w > 800) { e.x = 800 - e.w; e.vx = 0; }
      if (e.y > 600) { e.active = false; continue; }
      e.onGround = false; e.onPlatform = null;
      for (const p of platforms) { if (p.active) this._resolve(e, p); }
    }
  }
  _resolve(e, p) {
    if (e.right <= p.left || e.left >= p.right || e.bottom <= p.top || e.top >= p.bottom) return;
    if (p.oneWay) {
      if (e.prevBottom <= p.top + 2 && e.vy >= 0 && !e.ignorePlatform) {
        e.y = p.top - e.h; e.vy = 0; e.onGround = true; e.onPlatform = p;
      }
    } else {
      const oL = e.right  - p.left,  oR = p.right  - e.left;
      const oT = e.bottom - p.top,   oB = p.bottom - e.top;
      const mH = Math.min(oL, oR), mV = Math.min(oT, oB);
      if (mV < mH) {
        if (oT < oB) { e.y = p.top - e.h; if (e.vy > 0) e.vy = 0; e.onGround = true; e.onPlatform = p; }
        else         { e.y = p.bottom;     if (e.vy < 0) e.vy = 0; }
      } else {
        if (oL < oR) { e.x = p.left  - e.w; e.vx = 0; }
        else         { e.x = p.right;        e.vx = 0; }
      }
    }
  }
}

// ─── AttackSystem ─────────────────────────────────────────────────────────────
class AttackSystem {
  constructor() {
    this._hitboxes = []; this._aoes = []; this._dashHitboxes = [];
    this.effects = [];
  }
  registerMeleeHitbox(rect, damage, ownerEntity, duration) {
    this._hitboxes.push({ rect, damage, owner: ownerEntity, duration, hitEntities: new Set() });
  }
  registerAOE(cx, cy, radius, damage, duration, ownerEntity) {
    this._aoes.push({ cx, cy, radius, damage, duration, ownerEntity, hitEntities: new Set() });
    this.effects.push({ type:'aoe_ring', cx, cy, radius, timer:400, maxTimer:400 });
  }
  registerDashHitbox(ownerEntity, damage, duration) {
    this._dashHitboxes.push({ owner: ownerEntity, damage, duration, hitEntities: new Set() });
  }
  spawnProjectile(x, y, vx, vy, damage, owner, piercing, projectiles) {
    const p = new Projectile({ x, y, vx, vy, damage, owner, piercing });
    projectiles.push(p); return p;
  }
  update(dt, player, enemies, projectiles) {
    const dtMs = dt * 1000;
    this._handlePlayerAttacks(player, enemies, projectiles);
    this._hitboxes = this._hitboxes.filter(hb => { hb.duration -= dtMs; this._resolveHitboxVsTargets(hb, enemies, player); return hb.duration > 0; });
    this._aoes     = this._aoes.filter(    aoe=> { aoe.duration-= dtMs; this._resolveAOEVsTargets(aoe, enemies, player);    return aoe.duration> 0; });
    this._dashHitboxes = this._dashHitboxes.filter(dh => {
      dh.duration -= dtMs;
      if (dh.owner.active && dh.owner.dashing) {
        const rect = { left:dh.owner.x, right:dh.owner.right, top:dh.owner.top, bottom:dh.owner.bottom };
        this._resolveHitboxVsTargets({ rect, damage:dh.damage, hitEntities:dh.hitEntities }, enemies, player);
      }
      return dh.duration > 0 && dh.owner.dashing;
    });
    for (const proj of projectiles) {
      if (!proj.active) continue;
      if (proj.owner === 'player') {
        for (const enemy of enemies) {
          if (!enemy.active || proj.hitEntities.has(enemy.id)) continue;
          if (proj.intersects(enemy)) {
            proj.hitEntities.add(enemy.id);
            enemy.takeDamage(proj.damage, proj.cx);
            this._addHitEffect(enemy.cx, enemy.cy);
            if (!proj.piercing) proj.active = false;
          }
        }
      } else {
        if (player && !player.dead && !player.isInvincible && proj.intersects(player)) {
          player.takeDamage(proj.damage, proj); proj.active = false;
          this._addHitEffect(player.cx, player.cy);
        }
      }
    }
    this.effects = this.effects.filter(e => { e.timer -= dtMs; return e.timer > 0; });
    this._resolveEnemyAttacks(enemies, player, projectiles);
  }
  _handlePlayerAttacks(player, enemies, projectiles) {
    if (!player || player.dead) return;
    if (player._pendingAttack) {
      const pa = player._pendingAttack; player._pendingAttack = null;
      if (pa.type === 'melee') {
        const def = player.def.normalAttack, range = def.range;
        const rect = player.facing === 1
          ? { left:player.right,        right:player.right+range,  top:player.top+5, bottom:player.bottom-5 }
          : { left:player.left-range,   right:player.left,         top:player.top+5, bottom:player.bottom-5 };
        this.registerMeleeHitbox(rect, def.damage, player, def.duration);
        this.effects.push({ type:'slash', x:rect.left, y:rect.top, w:range, h:rect.bottom-rect.top, timer:150, maxTimer:150, facing:player.facing });
      } else if (pa.type === 'projectile') {
        const def = player.def.normalAttack;
        const px = player.facing === 1 ? player.right + 4 : player.left - 4;
        this.spawnProjectile(px, player.cy - 3, player.facing * def.speed, 0, def.damage, 'player', false, projectiles);
      }
    }
    if (player._pendingSpecial) {
      const ps = player._pendingSpecial; player._pendingSpecial = null;
      if (ps.type === 'dash') {
        this.registerDashHitbox(player, player.def.specialAttack.damage, player.def.specialAttack.duration);
      } else if (ps.type === 'volley') {
        const def = player.def.specialAttack;
        for (const angle of [-0.25, 0, 0.25]) {
          const bvx = player.facing * def.speed;
          const vx = bvx * Math.cos(angle);
          const vy = bvx * Math.sin(angle);
          const px = player.facing === 1 ? player.right + 4 : player.left - 4;
          this.spawnProjectile(px, player.cy - 3, vx, vy, def.damage, 'player', def.piercing, projectiles);
        }
      }
    }
    if (player._pendingAOE) {
      const pa = player._pendingAOE; player._pendingAOE = null;
      this.registerAOE(player.cx, player.bottom, player.def.specialAttack.radius, player.def.specialAttack.damage, 300, player);
    }
  }
  _resolveHitboxVsTargets(hb, enemies, player) {
    const r = hb.rect;
    const hit = (e) => e.left < r.right && e.right > r.left && e.top < r.bottom && e.bottom > r.top;
    if (hb.owner !== 'enemy') {
      for (const enemy of enemies) {
        if (!enemy.active || hb.hitEntities.has(enemy.id)) continue;
        if (hit(enemy)) { hb.hitEntities.add(enemy.id); enemy.takeDamage(hb.damage, hb.owner && hb.owner.cx); this._addHitEffect(enemy.cx, enemy.cy); }
      }
    } else {
      if (player && !player.dead && !player.isInvincible && !hb.hitEntities.has(player.id) && hit(player)) {
        hb.hitEntities.add(player.id); player.takeDamage(hb.damage, hb.owner); this._addHitEffect(player.cx, player.cy);
      }
    }
  }
  _resolveAOEVsTargets(aoe, enemies, player) {
    const rSq = aoe.radius ** 2;
    if (aoe.ownerEntity !== 'enemy') {
      for (const enemy of enemies) {
        if (!enemy.active || aoe.hitEntities.has(enemy.id)) continue;
        if ((aoe.cx-enemy.cx)**2 + (aoe.cy-enemy.cy)**2 <= rSq) {
          aoe.hitEntities.add(enemy.id); enemy.takeDamage(aoe.damage, aoe.cx); this._addHitEffect(enemy.cx, enemy.cy);
        }
      }
    }
  }
  _resolveEnemyAttacks(enemies, player, projectiles) {
    for (const enemy of enemies) {
      if (!enemy.active || !enemy._pendingAttack) continue;
      const pa = enemy._pendingAttack; enemy._pendingAttack = null;
      if (pa.type === 'melee') {
        const dir = (player && player.cx > enemy.cx) ? 1 : -1, range = enemy.attackRange;
        const rect = dir === 1
          ? { left:enemy.right,       right:enemy.right+range, top:enemy.top, bottom:enemy.bottom }
          : { left:enemy.left-range,  right:enemy.left,        top:enemy.top, bottom:enemy.bottom };
        this.registerMeleeHitbox(rect, enemy.damage, 'enemy', 300);
      } else if (pa.type === 'projectile' && player) {
        const dx = player.cx - enemy.cx, dy = player.cy - enemy.cy;
        const dist = Math.hypot(dx, dy) || 1, speed = enemy.projectileSpeed;
        this.spawnProjectile(enemy.cx, enemy.cy, (dx/dist)*speed, (dy/dist)*speed, enemy.damage, 'enemy', false, projectiles);
      }
    }
  }
  _addHitEffect(x, y) { this.effects.push({ type:'hit', x, y, timer:200, maxTimer:200 }); }
}

// ─── AISystem ─────────────────────────────────────────────────────────────────
class AISystem {
  update(dt, enemies, player, platforms) {
    if (!player || player.dead) return;
    for (const enemy of enemies) {
      if (!enemy.active) continue;
      this._tick(dt, enemy, player, platforms);
      enemy.update(dt);
    }
  }
  _tick(dt, enemy, player, platforms) {
    const dx = player.cx - enemy.cx, dist = Math.abs(dx), dir = dx > 0 ? 1 : -1;
    if (enemy.isBoss) { this._tickBoss(enemy, player, dir, dist); return; }
    switch (enemy.aiState) {
      case 'idle':
        enemy.vx = 0;
        if (dist < enemy.aggroRange) enemy.aiState = 'chase';
        break;
      case 'patrol':
        enemy.vx = enemy.patrolDir * enemy.speed * 0.5; enemy.facing = enemy.patrolDir;
        if (enemy.cx < enemy.patrolMinX) enemy.patrolDir = 1;
        else if (enemy.cx > enemy.patrolMaxX) enemy.patrolDir = -1;
        if (dist < enemy.aggroRange) enemy.aiState = 'chase';
        break;
      case 'chase':
        if (dist > enemy.aggroRange * 1.5) { enemy.aiState = 'patrol'; break; }
        enemy.facing = dir;
        if (enemy.variant === 'ranged') {
          const minR = enemy.minRange || 120;
          if (dist < minR)              { enemy.vx = -dir * enemy.speed; }
          else if (dist > enemy.attackRange) { enemy.vx = dir * enemy.speed * 0.6; }
          else                          { enemy.vx = 0; enemy.aiState = 'attack'; }
        } else {
          enemy.vx = dir * enemy.speed;
          if (dist < enemy.attackRange + 10) { enemy.vx = 0; enemy.aiState = 'attack'; }
        }
        this._tryJump(enemy, player, platforms);
        break;
      case 'attack':
        enemy.vx = 0; enemy.facing = dir;
        if (enemy.attackCooldownTimer <= 0) {
          if (dist <= enemy.attackRange + 20) {
            enemy._pendingAttack = { type: enemy.variant === 'ranged' ? 'projectile' : 'melee' };
            enemy.attackCooldownTimer = enemy.attackCooldown;
          } else { enemy.aiState = 'chase'; }
        }
        if (enemy.variant === 'melee'  && dist > enemy.attackRange + 40) enemy.aiState = 'chase';
        if (enemy.variant === 'ranged' && (dist > enemy.attackRange * 1.2 || dist < (enemy.minRange||100))) enemy.aiState = 'chase';
        break;
    }
  }
  _tickBoss(enemy, player, dir, dist) {
    if (enemy.charging) { enemy.facing = enemy.chargeDirection; return; }
    enemy.facing = dir;
    if (dist < enemy.attackRange + 5) {
      enemy.vx = 0;
      if (enemy.attackCooldownTimer <= 0) { enemy._pendingAttack = { type:'melee' }; enemy.attackCooldownTimer = enemy.attackCooldown; }
    } else {
      enemy.vx = dir * enemy.speed;
      if (dist > 150 && dist < enemy.aggroRange) enemy.tryCharge(player.cx);
    }
  }
  _tryJump(enemy, player, platforms) {
    if (!enemy.onGround) return;
    let pp = null;
    for (const p of platforms) {
      if (player.bottom >= p.top - 4 && player.bottom <= p.top + 8 && player.cx >= p.left && player.cx <= p.right) { pp = p; break; }
    }
    if (!pp || pp.top >= enemy.bottom) return;
    if (Math.abs(enemy.cx - pp.left) < 60 || Math.abs(enemy.cx - pp.right) < 60) enemy.vy = -400;
  }
}

// ─── HUDSystem ────────────────────────────────────────────────────────────────
class HUDSystem {
  constructor(ctx) {
    this.ctx = ctx; this.bossWarningTimer = 0; this.bossWarningActive = false; this.stageClearTimer = 0;
  }
  showBossWarning() { this.bossWarningTimer = 2500; this.bossWarningActive = true; }
  showStageClear()  { this.stageClearTimer = 3000; }
  update(dt) {
    this.bossWarningTimer = Math.max(0, this.bossWarningTimer - dt * 1000);
    if (this.bossWarningTimer <= 0) this.bossWarningActive = false;
    this.stageClearTimer = Math.max(0, this.stageClearTimer - dt * 1000);
  }
  render(player, stageNum, enemiesDefeated, totalEnemies) {
    if (!player) return;
    const ctx = this.ctx;
    // HP bar
    const hpFrac = player.hp / player.maxHp;
    ctx.fillStyle = Colors.HP_BG; ctx.fillRect(12, 12, 200, 18);
    ctx.fillStyle = hpFrac > 0.6 ? Colors.HP_HIGH : hpFrac > 0.3 ? Colors.HP_MED : Colors.HP_LOW;
    ctx.fillRect(12, 12, Math.round(200 * hpFrac), 18);
    ctx.strokeStyle = Colors.HP_BORDER; ctx.lineWidth = 2; ctx.strokeRect(12, 12, 200, 18);
    ctx.fillStyle = Colors.HUD_TEXT; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left'; ctx.fillText('HP', 16, 25);
    // Lives
    for (let i = 0; i < player.maxLives; i++) {
      const cx = 220 + i * 22, cy = 14;
      ctx.fillStyle = i < player.lives ? Colors.HEART : '#555555';
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+8,cy+7); ctx.lineTo(cx,cy+14); ctx.lineTo(cx-8,cy+7); ctx.closePath(); ctx.fill();
    }
    // Cooldown arc
    const cx2 = 400, cy2 = 478, r = 20;
    const frac = player.specialCooldownFraction, ready = frac <= 0;
    ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI*2); ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fill();
    if (!ready) {
      ctx.beginPath(); ctx.moveTo(cx2,cy2);
      ctx.arc(cx2, cy2, r-2, -Math.PI/2, -Math.PI/2 + (1-frac)*Math.PI*2); ctx.closePath();
      ctx.fillStyle = Colors.COOLDOWN_USED; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(cx2, cy2, r, 0, Math.PI*2);
    ctx.strokeStyle = ready ? Colors.COOLDOWN_READY : '#777'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = ready ? Colors.COOLDOWN_READY : '#aaa'; ctx.font = 'bold 10px monospace'; ctx.textAlign = 'center'; ctx.fillText('X', cx2, cy2+4);
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '9px monospace'; ctx.fillText(player.def.specialAttack.name, cx2, cy2+18);
    // Stage info
    ctx.fillStyle = Colors.HUD_BG; ctx.fillRect(650, 8, 142, 28);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.strokeRect(650, 8, 142, 28);
    ctx.fillStyle = Colors.HUD_ACCENT; ctx.font = 'bold 12px monospace'; ctx.textAlign = 'right'; ctx.fillText('Stage ' + stageNum, 788, 22);
    ctx.fillStyle = Colors.HUD_TEXT; ctx.font = '10px monospace'; ctx.fillText('Enemies ' + enemiesDefeated + '/' + totalEnemies, 788, 33);
    // Boss warning
    if (this.bossWarningActive) {
      const alpha = Math.min(1, this.bossWarningTimer / 500);
      ctx.save(); ctx.globalAlpha = alpha * (Math.sin(Date.now()/150)*0.3+0.7);
      ctx.fillStyle = Colors.BOSS_WARNING; ctx.font = 'bold 36px monospace'; ctx.textAlign = 'center';
      ctx.fillText('!! BOSS INCOMING !!', 400, 200); ctx.restore();
    }
    // Stage clear
    if (this.stageClearTimer > 0) {
      ctx.save(); ctx.globalAlpha = Math.min(1, this.stageClearTimer / 500);
      ctx.fillStyle = Colors.STAGE_CLEAR; ctx.font = 'bold 42px monospace'; ctx.textAlign = 'center';
      ctx.fillText('STAGE CLEAR!', 400, 220); ctx.restore();
    }
  }
}

// ─── Renderer ─────────────────────────────────────────────────────────────────
class Renderer {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.W = canvas.width; this.H = canvas.height;
    this._stars = [];
    for (let i = 0; i < 80; i++) this._stars.push({ x: Math.random()*800, y: Math.random()*200, r: Math.random()*1.5+0.3 });
  }
  render(state) {
    const { player, enemies, projectiles, platforms, effects, hud, stageNum, enemiesDefeated, totalEnemies, bgVariant } = state;
    this._drawBg(bgVariant || 0);
    this._drawPlatforms(platforms || []);
    if (enemies) for (const e of enemies) { if (e.active) this._drawEnemy(e); }
    if (player && !player.dead) this._drawPlayer(player);
    if (projectiles) for (const p of projectiles) { if (p.active) this._drawProjectile(p); }
    if (effects) for (const ef of effects) this._drawEffect(ef);
    if (hud && player) hud.render(player, stageNum, enemiesDefeated, totalEnemies);
  }
  _drawBg(v) {
    const ctx = this.ctx;
    const g = ctx.createLinearGradient(0, 0, 0, this.H);
    if (v===0) { g.addColorStop(0,'#0d1b2a'); g.addColorStop(0.6,'#1e3a5f'); g.addColorStop(1,'#2a4a30'); }
    else if (v===1) { g.addColorStop(0,'#0a1f0a'); g.addColorStop(0.6,'#1a3a1a'); g.addColorStop(1,'#2a3a1a'); }
    else { g.addColorStop(0,'#1a0a0a'); g.addColorStop(0.6,'#3a1a0a'); g.addColorStop(1,'#2a1a0a'); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, this.W, this.H);
    ctx.fillStyle = Colors.STAR;
    for (const s of this._stars) {
      ctx.globalAlpha = 0.6 + Math.sin(Date.now()/1000+s.x)*0.4;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = v===1 ? '#0d200d' : v===2 ? '#200d0d' : '#1a2744';
    ctx.beginPath(); ctx.moveTo(0,460); ctx.lineTo(0,320);
    for (const [px,py] of [[100,260],[250,200],[400,240],[550,190],[700,250],[800,220]]) ctx.lineTo(px,py);
    ctx.lineTo(800,320); ctx.lineTo(800,460); ctx.closePath(); ctx.fill();
  }
  _drawPlatforms(platforms) {
    const ctx = this.ctx;
    for (const p of platforms) {
      if (!p.active) continue;
      if (p.oneWay) {
        ctx.fillStyle = Colors.PLATFORM_TOP;    ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = Colors.PLATFORM_BODY;   ctx.fillRect(p.x, p.y+4, p.w, p.h-4);
        ctx.fillStyle = Colors.PLATFORM_DETAIL; ctx.fillRect(p.x+2, p.y+1, p.w-4, 2);
        ctx.fillStyle = Colors.PLATFORM_SHADOW; ctx.fillRect(p.x, p.y+p.h-3, p.w, 3);
        for (let cx=p.x+20; cx<p.right-10; cx+=30) { ctx.fillStyle=Colors.PLATFORM_SHADOW; ctx.fillRect(cx,p.y+2,1,p.h-4); }
      } else {
        ctx.fillStyle = Colors.PLATFORM_BODY;   ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = Colors.PLATFORM_TOP;    ctx.fillRect(p.x, p.y, p.w, 6);
        ctx.fillStyle = Colors.PLATFORM_DETAIL; ctx.fillRect(p.x, p.y+1, p.w, 2);
        ctx.fillStyle = Colors.PLATFORM_SHADOW; ctx.fillRect(p.x, p.y+p.h-6, p.w, 6);
        for (let bx=p.x; bx<p.right; bx+=40) for (let by=p.y+8; by<p.bottom-6; by+=12) {
          ctx.strokeStyle=Colors.PLATFORM_SHADOW; ctx.lineWidth=1; ctx.strokeRect(bx+1,by+1,38,10);
        }
      }
    }
  }
  _drawPlayer(player) {
    const ctx = this.ctx; ctx.save();
    if (player.isInvincible) ctx.globalAlpha = 0.5 + Math.sin(Date.now()/80)*0.5;
    const { x, y, w, h, facing: f, charId } = player;
    if (charId==='champion') this._drawChampion(ctx,x,y,w,h,f,player);
    else if (charId==='ranger') this._drawRanger(ctx,x,y,w,h,f,player);
    else if (charId==='savage') this._drawSavage(ctx,x,y,w,h,f,player);
    ctx.restore();
  }
  _drawChampion(ctx, x, y, w, h, f, player) {
    ctx.fillStyle=Colors.CHAMPION_ARMOR; ctx.fillRect(x+4,y+12,w-8,h-18);
    ctx.fillStyle=Colors.CHAMPION_ARMOR; ctx.fillRect(x+5,y+2,w-10,12);
    ctx.fillStyle='#aaaacc'; ctx.fillRect(x+7,y+5,w-14,5);
    ctx.fillStyle='#aa2222'; ctx.fillRect(f===1?x:x+2,y+10,6,h-12);
    ctx.fillStyle='#334466'; ctx.fillRect(x+4,y+h-12,8,12); ctx.fillRect(x+w-12,y+h-12,8,12);
    const sx=f===1?x-8:x+w+2;
    ctx.fillStyle=Colors.CHAMPION_SHIELD; ctx.fillRect(sx,y+14,8,18);
    ctx.fillStyle='#eecc00'; ctx.fillRect(sx+2,y+16,4,14);
    const swx=f===1?x+w+2:x-10, swOff=player.state==='attack'?8:0;
    ctx.fillStyle=Colors.CHAMPION_SWORD; ctx.fillRect(swx+(f===1?swOff:-swOff),y+8,4,20);
    ctx.fillStyle='#ccaa00'; ctx.fillRect(swx-2+(f===1?swOff:-swOff),y+26,8,4);
  }
  _drawRanger(ctx, x, y, w, h, f, player) {
    ctx.fillStyle=Colors.RANGER_CLOAK; ctx.fillRect(x+3,y+2,w-6,h-10);
    ctx.fillStyle=Colors.RANGER_CLOAK; ctx.beginPath(); ctx.arc(x+w/2,y+8,9,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#e8c090'; ctx.fillRect(x+7,y+5,w-14,9);
    ctx.fillStyle='#3d6028'; ctx.fillRect(x+4,y+h-12,7,12); ctx.fillRect(x+w-11,y+h-12,7,12);
    ctx.strokeStyle=Colors.RANGER_BOW; ctx.lineWidth=2.5;
    const bx=f===1?x-6:x+w+2;
    ctx.beginPath(); ctx.arc(bx+(f===1?3:-3),y+h/2-2,14,-1.1,1.1,f!==1); ctx.stroke();
    if (player.state!=='attack') {
      ctx.strokeStyle=Colors.RANGER_ARROW; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(bx+(f===1?-2:6),y+h/2-2); ctx.lineTo(bx+(f===1?8:-4),y+h/2-2); ctx.stroke();
    }
  }
  _drawSavage(ctx, x, y, w, h, f, player) {
    ctx.fillStyle=Colors.SAVAGE_FUR;  ctx.fillRect(x+3,y+10,w-6,h-16);
    ctx.fillStyle=Colors.SAVAGE_BODY; ctx.fillRect(x+5,y+14,w-10,h-22);
    ctx.fillStyle='#c87840'; ctx.fillRect(x+4,y+2,w-8,14);
    ctx.fillStyle='#3a1a00'; ctx.fillRect(x+2,y,w-4,8);
    ctx.fillStyle=Colors.SAVAGE_FUR;  ctx.fillRect(x+4,y+h-14,10,14); ctx.fillRect(x+w-14,y+h-14,10,14);
    const hx=f===1?x+w-4:x-18, hy=player.state==='attack'?y:y+10;
    ctx.fillStyle=Colors.SAVAGE_HANDLE; ctx.fillRect(hx+6,hy+4,4,20);
    ctx.fillStyle=Colors.SAVAGE_HAMMER; ctx.fillRect(hx,hy,16,12);
    ctx.fillStyle='#aaaaaa'; ctx.fillRect(hx+2,hy+1,12,4);
  }
  _drawEnemy(enemy) {
    const ctx = this.ctx; ctx.save();
    if (enemy.hitFlashTimer > 0) ctx.globalAlpha = 0.4 + Math.sin(Date.now()/40)*0.6;
    const { x, y, w, h, facing:f, faction, variant, isBoss } = enemy;
    if (isBoss)               this._drawBoss(ctx, enemy);
    else if (faction==='bandits') this._drawBandit(ctx,x,y,w,h,f,variant);
    else if (faction==='goblins') this._drawGoblin(ctx,x,y,w,h,f,variant);
    else if (faction==='orcs')    this._drawOrc(ctx,x,y,w,h,f,variant);
    // HP bar
    const bw=enemy.w+8, bx=enemy.x-4, by=enemy.y-10, fr=Math.max(0,enemy.hp/enemy.maxHp);
    ctx.fillStyle='#222'; ctx.fillRect(bx,by,bw,5);
    ctx.fillStyle=fr>0.5?Colors.HP_HIGH:fr>0.25?Colors.HP_MED:Colors.HP_LOW; ctx.fillRect(bx,by,Math.round(bw*fr),5);
    ctx.strokeStyle='#555'; ctx.lineWidth=1; ctx.strokeRect(bx,by,bw,5);
    ctx.restore();
  }
  _drawBandit(ctx,x,y,w,h,f,variant) {
    ctx.fillStyle=Colors.BANDIT_CLOTH; ctx.fillRect(x+3,y+10,w-6,h-16);
    ctx.fillStyle='#c8a070'; ctx.fillRect(x+4,y+2,w-8,12);
    ctx.fillStyle='#aa2222'; ctx.fillRect(x+3,y+2,w-6,5);
    ctx.fillStyle='#5c3c1a'; ctx.fillRect(x+3,y+h-10,7,10); ctx.fillRect(x+w-10,y+h-10,7,10);
    if (variant==='melee') { ctx.fillStyle=Colors.BANDIT_WEAPON; ctx.fillRect(f===1?x+w:x-6,y+8,4,16); }
    else { ctx.strokeStyle=Colors.RANGER_BOW; ctx.lineWidth=2; const bx=f===1?x+w+2:x-8; ctx.beginPath(); ctx.arc(bx+(f===1?2:-2),y+h/2,10,-1,1,f!==1); ctx.stroke(); }
  }
  _drawGoblin(ctx,x,y,w,h,f,variant) {
    ctx.fillStyle=Colors.GOBLIN_SKIN; ctx.fillRect(x+2,y+8,w-4,h-12); ctx.fillRect(x+1,y,w-2,14);
    ctx.fillStyle='#ff0000'; ctx.fillRect(x+4,y+4,4,3); ctx.fillRect(x+w-8,y+4,4,3);
    ctx.fillStyle=Colors.GOBLIN_SKIN; ctx.fillRect(x-3,y+3,5,7); ctx.fillRect(x+w-2,y+3,5,7);
    ctx.fillStyle='#3d6028'; ctx.fillRect(x+2,y+h-9,7,9); ctx.fillRect(x+w-9,y+h-9,7,9);
    ctx.fillStyle=Colors.GOBLIN_WEAPON;
    if (variant==='melee') { ctx.fillRect(f===1?x+w-2:x-4,y+6,3,12); ctx.fillRect(f===1?x+w-4:x-6,y+5,7,4); }
    else {
      ctx.fillRect(f===1?x+w:x-5,y+2,3,h-4);
      ctx.fillStyle='#aa44ff'; ctx.beginPath(); ctx.arc(f===1?x+w+1:x-4,y+3,5,0,Math.PI*2); ctx.fill();
    }
  }
  _drawOrc(ctx,x,y,w,h,f,variant) {
    ctx.fillStyle=Colors.ORC_ARMOR; ctx.fillRect(x+2,y+10,w-4,h-16);
    ctx.fillStyle=Colors.ORC_SKIN; ctx.fillRect(x+5,y+14,w-10,h-22); ctx.fillRect(x+3,y+1,w-6,14);
    ctx.fillStyle='#eeee88'; ctx.fillRect(x+4,y+12,4,5); ctx.fillRect(x+w-8,y+12,4,5);
    ctx.fillStyle=Colors.ORC_ARMOR; ctx.fillRect(x+3,y,w-6,7);
    ctx.fillStyle='#444'; ctx.fillRect(x+3,y+h-12,10,12); ctx.fillRect(x+w-13,y+h-12,10,12);
    if (variant==='melee') {
      const ax=f===1?x+w:x-12;
      ctx.fillStyle='#888'; ctx.fillRect(ax+(f===1?0:4),y+6,4,20);
      ctx.fillStyle='#aaa'; ctx.fillRect(ax,y+4,12,10);
    } else {
      ctx.strokeStyle='#664422'; ctx.lineWidth=3; const bx=f===1?x+w+2:x-10;
      ctx.beginPath(); ctx.arc(bx+(f===1?3:-3),y+h/2,14,-1.1,1.1,f!==1); ctx.stroke();
    }
  }
  _drawBoss(ctx, enemy) {
    const { x, y, w, h, facing:f, faction, phase2 } = enemy;
    ctx.save();
    if (phase2) ctx.globalAlpha = (ctx.globalAlpha||1) * (0.7 + Math.sin(Date.now()/100)*0.3);
    ctx.fillStyle=Colors.BOSS_ARMOR; ctx.fillRect(x+2,y+8,w-4,h-14);
    const skin=faction==='bandits'?'#8b6914':faction==='goblins'?'#5aaa3c':'#7a9e30';
    ctx.fillStyle=skin; ctx.fillRect(x+6,y+14,w-12,h-22); ctx.fillRect(x+4,y,w-8,16);
    ctx.fillStyle=Colors.COOLDOWN_READY; ctx.fillRect(x+4,y-6,w-8,8);
    for (let cx=x+6; cx<x+w-6; cx+=8) ctx.fillRect(cx,y-10,4,6);
    ctx.fillStyle='#888'; const wx=f===1?x+w:x-16; ctx.fillRect(wx,y+4,6,28);
    ctx.fillStyle='#bbb'; ctx.fillRect(wx-4,y+2,14,14);
    if (phase2) { ctx.strokeStyle='#ff4444'; ctx.lineWidth=3; ctx.strokeRect(x-2,y-2,w+4,h+4); }
    ctx.restore();
  }
  _drawProjectile(proj) {
    const ctx = this.ctx; ctx.save();
    ctx.fillStyle = proj.owner==='player' ? Colors.PROJECTILE_ARROW : Colors.PROJECTILE_BOLT;
    ctx.translate(proj.cx, proj.cy); ctx.rotate(Math.atan2(proj.vy, proj.vx));
    ctx.fillRect(-proj.w/2, -proj.h/2, proj.w, proj.h);
    if (proj.owner==='player') {
      ctx.fillStyle='#eeee22'; ctx.beginPath(); ctx.moveTo(proj.w/2,0); ctx.lineTo(proj.w/2-4,-3); ctx.lineTo(proj.w/2-4,3); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
  _drawEffect(ef) {
    const ctx = this.ctx, prog = ef.timer / ef.maxTimer;
    ctx.save(); ctx.globalAlpha = prog;
    if (ef.type==='hit') {
      ctx.fillStyle=Colors.HIT_FLASH; ctx.beginPath(); ctx.arc(ef.x,ef.y,12*(1-prog)+4,0,Math.PI*2); ctx.fill();
    } else if (ef.type==='aoe_ring') {
      ctx.strokeStyle=Colors.AOE_RING; ctx.lineWidth=4*prog;
      ctx.beginPath(); ctx.arc(ef.cx,ef.cy,ef.radius*(1-prog*0.3),0,Math.PI*2); ctx.stroke();
    } else if (ef.type==='slash') {
      ctx.strokeStyle=Colors.HIT_FLASH; ctx.lineWidth=3;
      const sx=ef.facing===1?ef.x:ef.x+ef.w;
      ctx.beginPath(); ctx.moveTo(sx,ef.y); ctx.lineTo(sx+ef.facing*ef.w*prog,ef.y+ef.h); ctx.stroke();
    }
    ctx.restore();
  }
  renderCharacterSelect(selectedIndex) {
    const ctx = this.ctx;
    const g = ctx.createLinearGradient(0,0,0,this.H); g.addColorStop(0,'#0d1b2a'); g.addColorStop(1,'#1e3a5f');
    ctx.fillStyle=g; ctx.fillRect(0,0,this.W,this.H);
    ctx.fillStyle=Colors.STAR;
    for (const s of this._stars) { ctx.globalAlpha=0.5; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); }
    ctx.globalAlpha=1;
    ctx.fillStyle=Colors.COOLDOWN_READY; ctx.font='bold 32px monospace'; ctx.textAlign='center'; ctx.fillText('MEDIEVAL FANTASY',400,55);
    ctx.fillStyle=Colors.HUD_TEXT; ctx.font='16px monospace'; ctx.fillText('Choose your champion',400,80);
    ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='12px monospace';
    ctx.fillText('\u2190 \u2192 to select   Enter to confirm',400,460);
    ctx.fillText('Z/J: Attack   X/K: Special   WASD/Arrows: Move   Space/W/Up: Jump',400,478);
    const defs = Object.values(CharacterDefs);
    const cardW=200, cardH=280, gap=30;
    const startX = (this.W - (defs.length*cardW + (defs.length-1)*gap)) / 2;
    defs.forEach((def, i) => {
      const cx=startX+i*(cardW+gap), cy=100, sel=i===selectedIndex;
      ctx.fillStyle=sel?'rgba(255,200,50,0.2)':'rgba(0,0,0,0.5)'; ctx.fillRect(cx,cy,cardW,cardH);
      ctx.strokeStyle=sel?Colors.COOLDOWN_READY:'rgba(255,255,255,0.3)'; ctx.lineWidth=sel?3:1; ctx.strokeRect(cx,cy,cardW,cardH);
      ctx.save(); ctx.translate(cx+cardW/2,cy+80); ctx.scale(2,2);
      const pw=def.width, ph=def.height, px=-pw/2, py=-ph/2;
      if (def.id==='champion') this._drawChampion(ctx,px,py,pw,ph,1,{state:'idle'});
      else if (def.id==='ranger') this._drawRanger(ctx,px,py,pw,ph,1,{state:'idle'});
      else if (def.id==='savage') this._drawSavage(ctx,px,py,pw,ph,1,{state:'idle'});
      ctx.restore();
      ctx.fillStyle=sel?Colors.COOLDOWN_READY:Colors.HUD_TEXT; ctx.font=`bold ${sel?18:16}px monospace`; ctx.textAlign='center';
      ctx.fillText(def.name,cx+cardW/2,cy+155);
      ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font='10px monospace'; ctx.fillText(def.description,cx+cardW/2,cy+172);
      const statY=cy+192;
      [['ATK',def.stats.attack],['DEF',def.stats.defense],['SPD',def.stats.speed],['SPC',def.stats.special]].forEach(([lbl,val],si) => {
        const sy=statY+si*18;
        ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='10px monospace'; ctx.textAlign='left'; ctx.fillText(lbl,cx+12,sy+10);
        ctx.fillStyle='#333'; ctx.fillRect(cx+40,sy+2,120,9);
        ctx.fillStyle=Colors.HP_HIGH; ctx.fillRect(cx+40,sy+2,Math.round(val/5*120),9);
      });
    });
  }
  renderGameOver() {
    const ctx = this.ctx; ctx.save();
    ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,this.W,this.H);
    ctx.fillStyle=Colors.HP_LOW; ctx.font='bold 52px monospace'; ctx.textAlign='center'; ctx.fillText('GAME OVER',400,220);
    ctx.fillStyle=Colors.HUD_TEXT; ctx.font='18px monospace'; ctx.fillText('Press Enter to return to character select',400,270);
    ctx.restore();
  }
}

// ─── StageManager ─────────────────────────────────────────────────────────────
const FACTION_ENEMIES = { bandits:[BanditThug,BanditArcher], goblins:[GoblinWarrior,GoblinShaman], orcs:[OrcBrute,OrcArcher] };
const FACTION_BOSS    = { bandits:'banditBoss', goblins:'goblinBoss', orcs:'orcBoss' };

class StageManager {
  constructor(game) {
    this.game=game; this.stageIndex=0; this.stageDef=null; this.platforms=[];
    this.totalEnemies=0; this.maxConcurrent=0; this.enemiesDefeated=0; this.enemiesSpawned=0; this.diffMod=1.0;
    this.bossSpawned=false; this.bossDefeated=false; this.spawnQueue=[]; this.spawnTimer=0; this.spawnDelay=1500;
    this.clearTimer=0; this.clearing=false;
  }
  get stageNum() { return this.stageIndex + 1; }
  get bgVariant() { return this.stageDef ? this.stageDef.bgVariant : 0; }
  loadStage(index) {
    const defIndex = index % StageDefs.length;
    this.stageIndex = index; this.stageDef = StageDefs[defIndex];
    const N = index + 1;
    this.totalEnemies = 8 + (N-1)*2; this.maxConcurrent = 2 + (N-1);
    this.diffMod = Math.min(2.0, 1.0 + (N-1)*0.05);
    this.enemiesDefeated=0; this.enemiesSpawned=0;
    this.bossSpawned=false; this.bossDefeated=false; this.clearing=false; this.clearTimer=0; this.spawnTimer=0;
    this.spawnQueue = this._buildQueue();
    this.platforms = this.stageDef.platforms.map(p => new Platform(p.x, p.y, p.w, p.h, p.oneWay));
    return { platforms: this.platforms, playerStart: this.stageDef.playerStart };
  }
  _buildQueue() {
    const types = FACTION_ENEMIES[this.stageDef.faction];
    const q = [];
    for (let i=0; i<this.totalEnemies; i++) q.push(types[i%types.length]);
    for (let i=q.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [q[i],q[j]]=[q[j],q[i]]; }
    return q;
  }
  _getSpawnPoint() { const pts=this.stageDef.spawnPoints; return pts[Math.floor(Math.random()*pts.length)]; }
  update(dt, activeEnemies) {
    if (this.clearing) { this.clearTimer -= dt*1000; return; }
    const living = activeEnemies.filter(e => e.active).length;
    if (living < this.maxConcurrent && this.spawnQueue.length > 0) {
      this.spawnTimer -= dt*1000;
      if (this.spawnTimer <= 0) { this._spawnNext(activeEnemies); this.spawnTimer = this.spawnDelay; }
    }
    const bossThreshold = Math.floor(this.totalEnemies * 0.8);
    if (!this.bossSpawned && this.enemiesDefeated >= bossThreshold && this.spawnQueue.length === 0) {
      this._spawnBoss(activeEnemies);
    }
    if (this.bossSpawned && this.bossDefeated && living === 0) { this.clearing=true; this.clearTimer=600; }
  }
  _spawnNext(activeEnemies) {
    if (!this.spawnQueue.length) return;
    const Cls=this.spawnQueue.shift(), pt=this._getSpawnPoint();
    activeEnemies.push(new Cls(pt.x, pt.y, this.diffMod)); this.enemiesSpawned++;
  }
  _spawnBoss(activeEnemies) {
    this.bossSpawned=true;
    const bossDef=BossDefs[FACTION_BOSS[this.stageDef.faction]], pt=this._getSpawnPoint();
    const boss=new Boss(bossDef, pt.x, pt.y, this.diffMod);
    activeEnemies.push(boss);
    this.game.onBossSpawned && this.game.onBossSpawned(boss);
  }
  checkBossDefeated(enemies) {
    if (!this.bossSpawned || this.bossDefeated) return;
    const boss = enemies.find(e => e.isBoss);
    if (boss && !boss.active) this.bossDefeated = true;
  }
  isStageClear() { return this.clearing && this.clearTimer <= 0; }
  recount(activeEnemies) {
    const living = activeEnemies.filter(e => e.active && !e.isBoss).length;
    this.enemiesDefeated = Math.max(0, this.enemiesSpawned - living);
    return this.enemiesDefeated;
  }
}

// ─── Game ─────────────────────────────────────────────────────────────────────
const CHAR_CLASSES = { champion:Champion, ranger:Ranger, savage:Savage };
const CHAR_LIST    = ['champion','ranger','savage'];

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.input   = new InputManager();
    this.renderer= new Renderer(canvas);
    this.physics = new PhysicsEngine();
    this.stageManager = new StageManager(this);
    this.attackSystem = new AttackSystem();
    this.aiSystem     = new AISystem();
    this.hud = new HUDSystem(this.renderer.ctx);
    this.state = 'CHARACTER_SELECT'; this.selectedCharIndex = 0;
    this.player = null; this.enemies = []; this.projectiles = []; this.platforms = [];
    this.stageIndex = 0; this._lastTime = 0;
  }
  init() {
    const loop = (ts) => {
      requestAnimationFrame(loop);
      const dt = Math.min((ts - this._lastTime) / 1000, 0.05);
      this._lastTime = ts;
      this.input.snapshot();
      this._update(dt);
      this._render();
    };
    requestAnimationFrame(loop);
  }
  _update(dt) {
    if      (this.state==='CHARACTER_SELECT') this._updateCharSelect();
    else if (this.state==='PLAYING')          this._updatePlaying(dt);
    else if (this.state==='STAGE_CLEAR')      this._updateStageClear(dt);
    else if (this.state==='GAME_OVER')        this._updateGameOver();
  }
  _updateCharSelect() {
    if (this.input.arrowLeftPress)  this.selectedCharIndex = (this.selectedCharIndex-1+CHAR_LIST.length)%CHAR_LIST.length;
    if (this.input.arrowRightPress) this.selectedCharIndex = (this.selectedCharIndex+1)%CHAR_LIST.length;
    if (this.input.confirm) { this.stageIndex=0; this._initStage(CHAR_LIST[this.selectedCharIndex]); this.state='PLAYING'; }
  }
  _initStage(charId) {
    const { platforms, playerStart } = this.stageManager.loadStage(this.stageIndex);
    this.platforms = platforms; this.enemies = []; this.projectiles = [];
    this.attackSystem._hitboxes=[]; this.attackSystem._aoes=[]; this.attackSystem._dashHitboxes=[]; this.attackSystem.effects=[];
    const id = (this.player && this.player.charId) || charId;
    const def = CharacterDefs[id], Cls = CHAR_CLASSES[id];
    if (this.player) {
      this.player.restoreForStage();
      this.player.x = playerStart.x - this.player.w/2;
      this.player.y = playerStart.y - this.player.h;
      this.player.vx = 0; this.player.vy = 0;
    } else {
      this.player = new Cls(def, playerStart.x, playerStart.y);
    }
  }
  _updatePlaying(dt) {
    if (this.player) {
      if (!this.player.dead) { this.player.update(dt, this.input); }
      else {
        this.player.respawnTimer -= dt*1000;
        if (this.player.respawnTimer <= 0) {
          if (this.player.lives <= 0) { this.state='GAME_OVER'; return; }
          const ps = this.stageManager.stageDef.playerStart;
          this.player.respawn(ps.x, ps.y);
        }
      }
    }
    this.aiSystem.update(dt, this.enemies, this.player, this.platforms);
    for (const p of this.projectiles) { if (p.active) p.update(dt); }
    const movables = [];
    if (this.player && !this.player.dead) movables.push(this.player);
    for (const e of this.enemies) { if (e.active) movables.push(e); }
    this.physics.update(dt, movables, this.platforms);
    this.attackSystem.update(dt, this.player, this.enemies, this.projectiles);
    this.stageManager.checkBossDefeated(this.enemies);
    this.stageManager.update(dt, this.enemies);
    this.enemies = this.enemies.filter(e => e.active);
    this.projectiles = this.projectiles.filter(p => p.active);
    this.hud.update(dt);
    if (this.stageManager.isStageClear()) { this.state='STAGE_CLEAR'; this.hud.showStageClear(); }
  }
  _updateStageClear(dt) {
    this.hud.update(dt);
    if (this.hud.stageClearTimer <= 0) { this.stageIndex++; this._initStage(); this.state='PLAYING'; }
  }
  _updateGameOver() {
    if (this.input.confirm) { this.player=null; this.enemies=[]; this.projectiles=[]; this.platforms=[]; this.state='CHARACTER_SELECT'; }
  }
  onBossSpawned(boss) { this.hud.showBossWarning(); }
  _render() {
    const ctx = this.renderer.ctx;
    ctx.clearRect(0, 0, 800, 500);
    if (this.state==='CHARACTER_SELECT') {
      this.renderer.renderCharacterSelect(this.selectedCharIndex);
    } else if (this.state==='PLAYING' || this.state==='STAGE_CLEAR') {
      this.renderer.render({
        player:this.player, enemies:this.enemies, projectiles:this.projectiles,
        platforms:this.platforms, effects:this.attackSystem.effects, hud:this.hud,
        stageNum:this.stageManager.stageNum,
        enemiesDefeated:this.stageManager.recount(this.enemies),
        totalEnemies:this.stageManager.totalEnemies+1,
        bgVariant:this.stageManager.bgVariant,
      });
    } else if (this.state==='GAME_OVER') {
      this.renderer.render({
        player:this.player, enemies:this.enemies, projectiles:this.projectiles,
        platforms:this.platforms, effects:[], hud:null,
        stageNum:this.stageManager.stageNum, enemiesDefeated:0, totalEnemies:0,
        bgVariant:this.stageManager.bgVariant,
      });
      this.renderer.renderGameOver();
    }
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const game = new Game(canvas);
  game.init();
});
