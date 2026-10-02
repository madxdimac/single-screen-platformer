'use strict';

// ─── AssetManager ────────────────────────────────────────────────────────────
const Colors = Object.freeze({
  SKY_TOP: '#1a0a2e', SKY_BOTTOM: '#3a1a4a', STAR: '#ffffff', MOUNTAIN: '#221040',
  PLATFORM_TOP: '#7a6040', PLATFORM_BODY: '#6a5030', PLATFORM_SHADOW: '#4a3820', PLATFORM_DETAIL: '#5aaa28',
  CHAMPION_BODY: '#8866cc', CHAMPION_ARMOR: '#6644aa', CHAMPION_SHIELD: '#c8a820', CHAMPION_SWORD: '#c8c8d8',
  RANGER_BODY: '#8b5030', RANGER_CLOAK: '#2a2a3a', RANGER_BOW: '#8b5a20', RANGER_ARROW: '#c8a800',
  SAVAGE_BODY: '#8a5025', SAVAGE_FUR: '#c8a040', SAVAGE_HAMMER: '#888888', SAVAGE_HANDLE: '#6b4226',
  BANDIT_BODY: '#d8d0c0', BANDIT_CLOTH: '#2a3040', BANDIT_WEAPON: '#aaaaaa',
  GOBLIN_BODY: '#6aaa3c', GOBLIN_SKIN: '#6aaa3c', GOBLIN_WEAPON: '#aaaaaa',
  ORC_BODY: '#5a7a20', ORC_SKIN: '#5a7a20', ORC_ARMOR: '#555555',
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
  get tab()  { return this.isPressed('Tab'); }
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
        this.effects.push({ type:'slash', x:rect.left, y:rect.top, w:range, h:rect.bottom-rect.top, timer:150, maxTimer:150, facing:dir, enemy:true });
      } else if (pa.type === 'projectile' && player) {
        const dx = player.cx - enemy.cx, dy = player.cy - enemy.cy;
        const dist = Math.hypot(dx, dy) || 1, speed = enemy.projectileSpeed;
        this.spawnProjectile(enemy.cx, enemy.cy, (dx/dist)*speed, (dy/dist)*speed, enemy.damage, 'enemy', false, projectiles).kind = enemy.enemyId;
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
  static VISUAL_SCALE = 1.45; // sprite height relative to hitbox height
  static OUTLINE_PX = 3;      // outline thickness in source-sprite pixels
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.W = 800; this.H = 500; // logical size; the backing store may be larger (see setDisplaySize)
    this._stars = [];
    for (let i = 0; i < 80; i++) this._stars.push({ x: Math.random()*800, y: Math.random()*200, r: Math.random()*1.5+0.3 });
    this._sprites = {};  // key -> outlined sprite canvas
    this._flash = {};    // key -> white silhouette canvas (hit flash)
    this._spritesReady = false;
    this._anim = new WeakMap(); // entity -> per-entity animation state
    this._now = performance.now(); this._dt = 0;
    this._platforms = [];
    this._initSprites();
    this.setDisplaySize(800, 500);
  }
  // Size the backing store to the on-screen size so art stays sharp when scaled up;
  // game code keeps drawing in 800×500 logical coordinates.
  setDisplaySize(cssW, cssH) {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.style.width = cssW + 'px'; this.canvas.style.height = cssH + 'px';
    this.canvas.width = Math.round(cssW * dpr); this.canvas.height = Math.round(cssH * dpr);
    this.ctx.setTransform(this.canvas.width / this.W, 0, 0, this.canvas.height / this.H, 0, 0);
    this._invalidateCaches();
  }
  _initSprites() {
    if (typeof SPRITE_DATA === 'undefined') return;
    let loaded = 0;
    const keys = Object.keys(SPRITE_DATA);
    const total = keys.length;
    for (const key of keys) {
      const img = new Image();
      img.onload = () => {
        this._sprites[key] = this._makeOutlined(img, Renderer.OUTLINE_PX, '#140a1c');
        this._flash[key] = this._makeSilhouette(this._sprites[key], '#ffffff');
        loaded++; if (loaded === total) this._spritesReady = true;
      };
      img.src = SPRITE_DATA[key];
    }
  }
  _makeSilhouette(src, color) {
    const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
    const g = c.getContext('2d');
    g.drawImage(src, 0, 0);
    g.globalCompositeOperation = 'source-in'; g.fillStyle = color; g.fillRect(0, 0, c.width, c.height);
    return c;
  }
  // Sprite with a dark outline: silhouette stamped in 8 directions, sprite on top.
  _makeOutlined(img, p, color) {
    const sil = this._makeSilhouette(img, color);
    const c = document.createElement('canvas'); c.width = img.width + p*2; c.height = img.height + p*2;
    const g = c.getContext('2d');
    for (let a = 0; a < 8; a++) {
      g.drawImage(sil, p + Math.round(Math.cos(a*Math.PI/4)*p), p + Math.round(Math.sin(a*Math.PI/4)*p));
    }
    g.drawImage(img, p, p);
    return c;
  }
  _animState(e) {
    let s = this._anim.get(e);
    if (!s) { s = { t: Math.random()*10, runPhase: 0, wasGround: e.onGround, land: 0 }; this._anim.set(e, s); }
    return s;
  }
  // Top of the nearest platform under (x, y), for ground shadows.
  _groundBelow(x, y) {
    let best = null;
    for (const p of this._platforms) {
      if (!p.active || x < p.x || x > p.x + p.w || p.y < y - 2) continue;
      if (best === null || p.y < best) best = p.y;
    }
    return best;
  }
  // Draws an entity's sprite at its natural aspect, feet on the hitbox bottom, with a
  // ground shadow, procedural squash/stretch animation, hit flash and optional glow.
  // Returns false if the sprite isn't available (caller falls back to procedural art).
  _drawActor(e, key, o) {
    const spr = this._sprites[key];
    if (!spr) return false;
    const ctx = this.ctx, s = this._animState(e), dt = this._dt;
    s.t += dt;
    // landing squash
    if (e.onGround && !s.wasGround && s.t > 0.2) s.land = 1;
    s.wasGround = e.onGround;
    s.land = Math.max(0, s.land - dt * 6);

    const visH = e.h * Renderer.VISUAL_SCALE * (o.scale || 1);
    const visW = visH * spr.width / spr.height;
    const footX = e.x + e.w / 2, footY = e.y + e.h + 1;
    const f = e.facing === -1 ? -1 : 1;

    let sx = 1, sy = 1, rot = 0, offX = 0, offY = 0;
    const moving = e.onGround && Math.abs(e.vx) > 5;
    if (!e.onGround) {
      if (e.vy < 0) { sy = 1.07; sx = 0.94; } else { sy = 1.03; sx = 0.97; }
    } else if (moving) {
      s.runPhase += Math.abs(e.vx) * dt * 0.06;
      offY = -Math.abs(Math.sin(s.runPhase)) * 2.5;
      rot = 0.06 * f;
      sy = 1 + Math.sin(s.runPhase * 2) * 0.02;
    } else {
      const br = Math.sin(s.t * 2.6) * 0.018; // idle breathing
      sy = 1 + br; sx = 1 - br * 0.6;
    }
    if (s.land > 0) { sy *= 1 - 0.14 * s.land; sx *= 1 + 0.12 * s.land; }
    const atk = o.attack || 0; // 0..1 attack progress
    if (atk > 0) {
      const k = Math.sin(atk * Math.PI);
      offX += k * 6 * f; rot += k * 0.14 * f;
    }
    if (o.dash) { rot += 0.18 * f; sx *= 1.08; sy *= 0.95; }

    // ground shadow on the surface below
    const gy = e.onGround ? footY - 1 : this._groundBelow(footX, e.y + e.h);
    if (gy !== null) {
      const fade = Math.max(0, 1 - (gy - (e.y + e.h)) / 160);
      ctx.save();
      ctx.globalAlpha = 0.35 * fade * (o.alpha ?? 1);
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.ellipse(footX, gy, visW * 0.42 * (0.6 + 0.4*fade), 3.5 * (0.6 + 0.4*fade), 0, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = o.alpha ?? 1;
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.translate(footX + offX, footY + offY);
    ctx.rotate(rot);
    ctx.scale(sx * f, sy);
    if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.glowBlur || 14; }
    ctx.drawImage(spr, -visW / 2, -visH, visW, visH);
    ctx.shadowBlur = 0;
    if (o.flash > 0) {
      ctx.globalAlpha = (o.alpha ?? 1) * Math.min(1, o.flash) * 0.65;
      ctx.drawImage(this._flash[key], -visW / 2, -visH, visW, visH);
    }
    ctx.restore();
    e._visTop = footY - visH * sy; // for HP bar placement
    return true;
  }
  render(state) {
    const { player, enemies, projectiles, platforms, effects, hud, stageNum, enemiesDefeated, totalEnemies, bgVariant } = state;
    const now = performance.now();
    this._dt = Math.min(0.05, (now - this._now) / 1000); this._now = now;
    this._platforms = platforms || [];
    this._drawBg(bgVariant || 0);
    // light screen shake when the player is hit or a boss starts charging
    if (player && player.invincibleTimer > 1440 && !player.dead) this._shake = Math.max(this._shake || 0, 4);
    if (enemies) for (const e of enemies) if (e.charging && e.chargeTimer > e.chargeDuration - 60) this._shake = Math.max(this._shake || 0, 3);
    this._shake = Math.max(0, (this._shake || 0) - this._dt * 25);
    const ctx = this.ctx; ctx.save();
    if (this._shake > 0) ctx.translate((Math.random() - 0.5) * this._shake, (Math.random() - 0.5) * this._shake);
    this._drawPlatforms(platforms || []);
    if (enemies) for (const e of enemies) { if (e.active) this._drawEnemy(e); }
    if (player && !player.dead) this._drawPlayer(player);
    if (projectiles) for (const p of projectiles) { if (p.active) this._drawProjectile(p); }
    if (effects) for (const ef of effects) this._drawEffect(ef);
    ctx.restore();
    this._drawVignette();
    if (hud && player) hud.render(player, stageNum, enemiesDefeated, totalEnemies);
  }
  // ── World art ───────────────────────────────────────────────────────────────
  // Static layers (sky, silhouettes, platforms, vignette) are painted once into
  // offscreen canvases at backing-store resolution; only lights/particles animate.
  static _rng(seed) {
    return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  _offscreen(draw) {
    const c = document.createElement('canvas'); c.width = this.canvas.width; c.height = this.canvas.height;
    const g = c.getContext('2d'); g.scale(c.width / this.W, c.height / this.H); draw(g); return c;
  }
  _invalidateCaches() { this._bgCache = null; this._platCache = null; this._vignette = null; }
  // Jagged/rolling silhouette from x=0..800 at baseY, filled to the bottom.
  _ridge(g, rnd, baseY, amp, step, color, smooth = true) {
    g.fillStyle = color; g.beginPath(); g.moveTo(0, this.H);
    let px = 0, py = baseY - rnd() * amp; g.lineTo(0, py);
    for (let x = step; x <= this.W + step; x += step) {
      const y = baseY - rnd() * amp;
      if (smooth) g.quadraticCurveTo(px + step / 2, Math.min(py, y) - amp * 0.25, x, y); else g.lineTo(x, y);
      px = x; py = y;
    }
    g.lineTo(this.W, this.H); g.closePath(); g.fill();
  }
  _glow(g, x, y, r, color) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, color); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  _buildBackdrop(v) {
    return this._offscreen(g => {
      const rnd = Renderer._rng(1000 + v), W = this.W, H = this.H;
      const sky = g.createLinearGradient(0, 0, 0, H);
      if (v === 0) {        // Bandit camp at dusk
        sky.addColorStop(0, '#1b0f33'); sky.addColorStop(0.45, '#4a2050'); sky.addColorStop(0.72, '#a8503c'); sky.addColorStop(1, '#f0a050');
        g.fillStyle = sky; g.fillRect(0, 0, W, H);
        this._glow(g, 560, 330, 230, 'rgba(255,190,110,0.45)');
        g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(560, 330, 44, 0, Math.PI * 2); g.fill();
        this._ridge(g, rnd, 330, 70, 90, '#6a3058');
        this._ridge(g, rnd, 380, 40, 70, '#43203f');
        // tents and a palisade on the horizon
        g.fillStyle = '#26112b';
        for (const [tx, tw, th] of [[70, 80, 52], [215, 64, 42], [655, 90, 58]]) {
          g.beginPath(); g.moveTo(tx, 432); g.lineTo(tx + tw / 2, 432 - th); g.lineTo(tx + tw, 432); g.closePath(); g.fill();
          g.fillRect(tx + tw / 2 - 1, 432 - th - 8, 2, 10);
        }
        g.fillRect(0, 430, W, 40);
        for (let x = 330; x < 540; x += 12) {
          const h = 50 + rnd() * 18;
          g.beginPath(); g.moveTo(x, 440); g.lineTo(x, 440 - h); g.lineTo(x + 5, 440 - h - 8); g.lineTo(x + 10, 440 - h); g.lineTo(x + 10, 440); g.fill();
        }
        const haze = g.createLinearGradient(0, 360, 0, 460);
        haze.addColorStop(0, 'rgba(255,150,90,0)'); haze.addColorStop(1, 'rgba(255,150,90,0.18)');
        g.fillStyle = haze; g.fillRect(0, 360, W, 100);
      } else if (v === 1) { // Goblin forest at night
        sky.addColorStop(0, '#04100b'); sky.addColorStop(0.55, '#0d2618'); sky.addColorStop(1, '#1c3c26');
        g.fillStyle = sky; g.fillRect(0, 0, W, H);
        this._glow(g, 160, 95, 120, 'rgba(190,240,190,0.22)');
        g.fillStyle = '#d6efcd'; g.beginPath(); g.arc(160, 95, 24, 0, Math.PI * 2); g.fill();
        const pines = (baseY, minH, maxH, color, spacing) => {
          g.fillStyle = color;
          for (let x = -20; x < W + 20; x += spacing * (0.6 + rnd() * 0.8)) {
            const h = minH + rnd() * (maxH - minH), w = h * 0.42;
            for (let k = 0; k < 3; k++) { // three stacked tiers per pine
              const ty = baseY - h + k * h * 0.28, tw = w * (0.55 + k * 0.25);
              g.beginPath(); g.moveTo(x, ty); g.lineTo(x - tw / 2, ty + h * 0.45); g.lineTo(x + tw / 2, ty + h * 0.45); g.closePath(); g.fill();
            }
            g.fillRect(x - 2, baseY - 10, 4, 12);
          }
          g.fillRect(0, baseY, W, H - baseY);
        };
        pines(330, 70, 120, '#173a26', 34);
        const mist = g.createLinearGradient(0, 280, 0, 360);
        mist.addColorStop(0, 'rgba(160,210,180,0)'); mist.addColorStop(1, 'rgba(160,210,180,0.16)');
        g.fillStyle = mist; g.fillRect(0, 280, W, 80);
        pines(390, 90, 150, '#0d2618', 46);
        const mist2 = g.createLinearGradient(0, 360, 0, 460);
        mist2.addColorStop(0, 'rgba(150,200,170,0)'); mist2.addColorStop(1, 'rgba(150,200,170,0.14)');
        g.fillStyle = mist2; g.fillRect(0, 360, W, 100);
        // foreground trunks at the edges, canopy and hanging vines
        for (const [tx, tw] of [[-6, 38], [772, 40]]) {
          g.fillStyle = '#06110a'; g.fillRect(tx, 0, tw, H);
          g.fillStyle = '#122a1a'; g.fillRect(tx + (tx < 400 ? tw - 4 : 0), 0, 4, H);
        }
        g.fillStyle = '#040c07';
        for (let x = 0; x < W; x += 26) { g.beginPath(); g.arc(x, -4, 18 + rnd() * 16, 0, Math.PI * 2); g.fill(); }
        g.lineWidth = 2;
        for (let i = 0; i < 9; i++) {
          const x = 40 + rnd() * 720, len = 40 + rnd() * 110, sway = (rnd() - 0.5) * 24;
          g.strokeStyle = '#1d4a2a'; g.beginPath(); g.moveTo(x, 0); g.quadraticCurveTo(x + sway, len / 2, x - sway / 2, len); g.stroke();
          g.fillStyle = '#2a6a38';
          for (let l = 14; l < len; l += 14) { g.beginPath(); g.ellipse(x + sway * (l / len) * 0.4 + 3, l, 4, 2, 0.6, 0, Math.PI * 2); g.fill(); }
        }
      } else {              // Orc fortress under a volcanic sky
        sky.addColorStop(0, '#120405'); sky.addColorStop(0.5, '#3a0d08'); sky.addColorStop(1, '#7c2c10');
        g.fillStyle = sky; g.fillRect(0, 0, W, H);
        // volcano with glowing crater and lava streaks
        g.fillStyle = '#2c0b09';
        g.beginPath(); g.moveTo(380, 370); g.lineTo(590, 165); g.lineTo(640, 165); g.lineTo(840, 370); g.closePath(); g.fill();
        this._glow(g, 615, 160, 110, 'rgba(255,110,30,0.55)');
        g.strokeStyle = 'rgba(255,110,30,0.7)'; g.lineWidth = 2;
        for (const [x1, x2] of [[600, 560], [620, 650], [630, 700]]) {
          g.beginPath(); g.moveTo(x1, 168); g.quadraticCurveTo((x1 + x2) / 2 + 8, 230, x2, 290); g.stroke();
        }
        this._ridge(g, rnd, 370, 40, 80, '#260a08', false);
        // fortress wall with towers
        const stone = '#1c0d0d', wallTop = 345;
        g.fillStyle = stone; g.fillRect(0, wallTop, W, H - wallTop);
        for (let x = 0; x < W; x += 28) g.fillRect(x, wallTop - 12, 15, 12);
        for (const tx of [55, 655]) {
          g.fillRect(tx, 250, 90, H - 250);
          for (let x = tx; x < tx + 90; x += 22) g.fillRect(x, 236, 13, 14);
          g.fillStyle = '#ff8a30'; g.fillRect(tx + 40, 290, 6, 16); g.fillRect(tx + 40, 330, 6, 16); g.fillStyle = stone;
          // banner with a notched tail
          g.fillStyle = '#8a1a14';
          g.beginPath(); g.moveTo(tx + 14, 262); g.lineTo(tx + 32, 262); g.lineTo(tx + 32, 318); g.lineTo(tx + 23, 308); g.lineTo(tx + 14, 318); g.closePath(); g.fill();
          g.fillStyle = '#1a0a0a'; g.beginPath(); g.arc(tx + 23, 282, 5, 0, Math.PI * 2); g.fill();
          g.fillStyle = stone;
        }
        g.strokeStyle = 'rgba(255,255,255,0.04)'; g.lineWidth = 1;
        for (let y = wallTop + 12; y < H; y += 14) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
        const haze = g.createLinearGradient(0, 300, 0, 470);
        haze.addColorStop(0, 'rgba(255,80,20,0)'); haze.addColorStop(1, 'rgba(255,80,20,0.16)');
        g.fillStyle = haze; g.fillRect(0, 300, W, 170);
      }
    });
  }
  _initParticles(v) {
    const rnd = Math.random;
    this._particles = [];
    const n = v === 0 ? 18 : v === 1 ? 26 : 40;
    for (let i = 0; i < n; i++) this._particles.push({ x: rnd() * 800, y: rnd() * 470, s: rnd(), p: rnd() * 6.28 });
  }
  _drawAmbient(v) {
    const ctx = this.ctx, dt = this._dt, t = this._now / 1000;
    ctx.save();
    if (v === 0) {
      // stars fade out toward the bright horizon
      ctx.fillStyle = '#ffffff';
      for (const s of this._stars) {
        ctx.globalAlpha = Math.max(0, (0.6 + Math.sin(t + s.x) * 0.4) * (1 - s.y / 200));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      // campfire between the tents
      const fl = 0.8 + Math.sin(t * 13) * 0.1 + Math.sin(t * 7.3) * 0.1;
      ctx.globalAlpha = 1; this._glow(ctx, 170, 438, 70 * fl, 'rgba(255,150,60,0.45)');
      ctx.fillStyle = '#ffb040';
      ctx.beginPath(); ctx.moveTo(162, 444); ctx.quadraticCurveTo(170, 420 - fl * 8, 178, 444); ctx.fill();
      ctx.fillStyle = '#fff0a0';
      ctx.beginPath(); ctx.moveTo(166, 444); ctx.quadraticCurveTo(170, 432 - fl * 4, 174, 444); ctx.fill();
      // drifting dust
      ctx.fillStyle = '#ffd8a0';
      for (const p of this._particles) {
        p.x += (8 + p.s * 10) * dt; if (p.x > 805) p.x = -5;
        ctx.globalAlpha = 0.25 + 0.2 * Math.sin(t * 2 + p.p);
        ctx.fillRect(p.x, p.y + Math.sin(t + p.p) * 6, 1.5, 1.5);
      }
    } else if (v === 1) {
      // fireflies
      for (const p of this._particles) {
        p.x += Math.cos(t * 0.7 + p.p) * 12 * dt; p.y += Math.sin(t * 0.9 + p.p * 2) * 10 * dt;
        const a = Math.max(0, Math.sin(t * (1 + p.s) + p.p));
        ctx.globalAlpha = a * 0.5; this._glow(ctx, p.x, p.y, 7, 'rgba(200,255,120,0.8)');
        ctx.globalAlpha = a; ctx.fillStyle = '#eaffb0'; ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
      }
    } else {
      // braziers on the towers
      for (const bx of [100, 700]) {
        const fl = 0.8 + Math.sin(t * 11 + bx) * 0.12 + Math.sin(t * 6.1) * 0.08;
        ctx.globalAlpha = 1; this._glow(ctx, bx, 226, 50 * fl, 'rgba(255,120,40,0.5)');
        ctx.fillStyle = '#2a1410'; ctx.fillRect(bx - 9, 228, 18, 8);
        ctx.fillStyle = '#ff8a2a'; ctx.beginPath(); ctx.moveTo(bx - 8, 229); ctx.quadraticCurveTo(bx, 206 - fl * 8, bx + 8, 229); ctx.fill();
        ctx.fillStyle = '#ffe080'; ctx.beginPath(); ctx.moveTo(bx - 4, 229); ctx.quadraticCurveTo(bx, 216 - fl * 4, bx + 4, 229); ctx.fill();
      }
      // rising embers
      ctx.fillStyle = '#ffa040';
      for (const p of this._particles) {
        p.y -= (18 + p.s * 30) * dt; p.x += Math.sin(t * 1.5 + p.p) * 10 * dt;
        if (p.y < -5) { p.y = 470; p.x = Math.random() * 800; }
        ctx.globalAlpha = 0.4 + 0.5 * Math.abs(Math.sin(t * 3 + p.p));
        ctx.fillRect(p.x, p.y, 1.5 + p.s, 1.5 + p.s);
      }
    }
    ctx.restore();
  }
  _drawBg(v) {
    if (!this._bgCache || this._bgCache.v !== v) {
      this._bgCache = { v, img: this._buildBackdrop(v) };
      this._initParticles(v);
    }
    this.ctx.drawImage(this._bgCache.img, 0, 0, this.W, this.H);
    this._drawAmbient(v);
  }
  // ── Platforms ───────────────────────────────────────────────────────────────
  _paintGround(g, p, v, rnd) {
    const pal = [
      { top: '#7a5c3e', bot: '#4a3524', grass: '#5f9e34', lite: '#9ad25a' },
      { top: '#56634a', bot: '#2e3a28', grass: '#3d8a3a', lite: '#6cc060' },
      { top: '#4e3c38', bot: '#2a1e1c', grass: '#3a2a26', lite: '#6a5048' },
    ][v];
    const body = g.createLinearGradient(0, p.y, 0, p.y + p.h);
    body.addColorStop(0, pal.top); body.addColorStop(1, pal.bot);
    g.fillStyle = body; g.fillRect(p.x, p.y, p.w, p.h);
    // stone blocks with per-block shading
    g.save(); g.beginPath(); g.rect(p.x, p.y, p.w, p.h); g.clip();
    let row = 0;
    for (let by = p.y + 6; by < p.y + p.h; by += 12, row++) {
      for (let bx = p.x - (row % 2) * 18; bx < p.x + p.w; ) {
        const bw = 30 + Math.floor(rnd() * 14);
        const shade = rnd() * 0.16 - 0.08;
        g.fillStyle = shade > 0 ? `rgba(255,240,220,${shade})` : `rgba(0,0,0,${-shade})`;
        g.fillRect(bx + 1, by + 1, bw - 2, 10);
        g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(bx + 1, by + 1, bw - 2, 1);
        g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(bx + 1, by + 10, bw - 2, 1); g.fillRect(bx + bw - 1, by + 1, 1, 10);
        bx += bw;
      }
    }
    g.restore();
    this._paintTopEdge(g, p, pal, v, rnd, 6);
    g.strokeStyle = 'rgba(0,0,0,0.55)'; g.lineWidth = 1.5; g.strokeRect(p.x + 0.75, p.y + 0.75, p.w - 1.5, p.h - 1.5);
  }
  // Grass lip (or scorched crust for the fortress) with tufts hanging over the edge.
  _paintTopEdge(g, p, pal, v, rnd, band) {
    g.fillStyle = pal.grass; g.fillRect(p.x, p.y, p.w, band);
    g.fillStyle = pal.lite; g.fillRect(p.x, p.y, p.w, 2);
    if (v === 2) {
      g.strokeStyle = 'rgba(255,110,30,0.8)'; g.lineWidth = 1;
      for (let x = p.x + 8; x < p.x + p.w - 8; x += 22 + rnd() * 30) {
        g.beginPath(); g.moveTo(x, p.y + 2); g.lineTo(x + 4, p.y + band - 1); g.lineTo(x + 9, p.y + band + 1); g.stroke();
      }
      return;
    }
    g.fillStyle = pal.grass;
    for (let x = p.x + 3; x < p.x + p.w - 3; x += 5 + rnd() * 7) {
      g.beginPath(); g.arc(x, p.y + band, 1.5 + rnd() * 2.5, 0, Math.PI); g.fill(); // hanging tufts
    }
    g.fillStyle = pal.lite;
    for (let x = p.x + 4; x < p.x + p.w - 4; x += 6 + rnd() * 10) {
      const h = 2 + rnd() * 3; // blades poking up
      g.beginPath(); g.moveTo(x, p.y + 1); g.lineTo(x + 1, p.y - h); g.lineTo(x + 2.5, p.y + 1); g.fill();
    }
  }
  _paintPlank(g, p, v, rnd) {
    // soft shadow under the plank
    const sh = g.createLinearGradient(0, p.y + p.h, 0, p.y + p.h + 8);
    sh.addColorStop(0, 'rgba(0,0,0,0.28)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = sh; g.fillRect(p.x + 4, p.y + p.h, p.w - 8, 8);
    // support brackets
    g.fillStyle = '#2a1a10';
    for (const bx of [p.x + 10, p.x + p.w - 18]) {
      g.beginPath(); g.moveTo(bx, p.y + p.h); g.lineTo(bx + 8, p.y + p.h); g.lineTo(bx + 4, p.y + p.h + 7); g.closePath(); g.fill();
    }
    const wood = v === 2 ? ['#6a4430', '#3e2618'] : ['#9a6a3c', '#5e3a1e'];
    const body = g.createLinearGradient(0, p.y, 0, p.y + p.h);
    body.addColorStop(0, wood[0]); body.addColorStop(1, wood[1]);
    g.fillStyle = body;
    g.beginPath(); g.roundRect ? g.roundRect(p.x, p.y, p.w, p.h, 3) : g.rect(p.x, p.y, p.w, p.h); g.fill();
    g.save(); g.clip();
    // grain
    g.strokeStyle = 'rgba(40,20,8,0.35)'; g.lineWidth = 1;
    for (let gy = p.y + 5; gy < p.y + p.h - 2; gy += 4) {
      g.beginPath(); g.moveTo(p.x, gy + rnd()); g.bezierCurveTo(p.x + p.w * 0.3, gy - 1, p.x + p.w * 0.6, gy + 1.5, p.x + p.w, gy); g.stroke();
    }
    // plank seams with nails
    for (let sx = p.x + 24 + rnd() * 14; sx < p.x + p.w - 10; sx += 28 + rnd() * 16) {
      g.fillStyle = 'rgba(0,0,0,0.45)'; g.fillRect(sx, p.y, 1.5, p.h);
      g.fillStyle = 'rgba(255,220,170,0.15)'; g.fillRect(sx + 1.5, p.y, 1, p.h);
      g.fillStyle = '#c8b090'; g.fillRect(sx - 3, p.y + 5, 1.5, 1.5); g.fillRect(sx + 4, p.y + 5, 1.5, 1.5);
    }
    if (v === 2) { // iron end bands
      g.fillStyle = '#4a4648';
      g.fillRect(p.x + 3, p.y, 6, p.h); g.fillRect(p.x + p.w - 9, p.y, 6, p.h);
      g.fillStyle = '#8a8488'; g.fillRect(p.x + 5, p.y + 3, 2, 2); g.fillRect(p.x + p.w - 7, p.y + 3, 2, 2);
    }
    g.restore();
    g.fillStyle = 'rgba(255,230,190,0.25)'; g.fillRect(p.x + 2, p.y + 1, p.w - 4, 1.5);
    if (v === 1) { // moss patches and drips in the forest
      for (let x = p.x + 6; x < p.x + p.w - 10; x += 18 + rnd() * 26) {
        const w = Math.min(8 + rnd() * 16, p.x + p.w - 4 - x);
        g.fillStyle = '#3d8a3a'; g.fillRect(x, p.y, w, 3);
        g.beginPath(); g.ellipse(x + w / 2, p.y + 3, w / 2, 2.5, 0, 0, Math.PI); g.fill();
        if (rnd() < 0.5) { g.fillStyle = '#2f6e30'; g.fillRect(x + w * 0.6, p.y + p.h, 1.5, 3 + rnd() * 6); }
      }
    }
    g.strokeStyle = 'rgba(0,0,0,0.6)'; g.lineWidth = 1.2;
    g.beginPath(); g.roundRect ? g.roundRect(p.x + 0.6, p.y + 0.6, p.w - 1.2, p.h - 1.2, 3) : g.rect(p.x + 0.6, p.y + 0.6, p.w - 1.2, p.h - 1.2); g.stroke();
  }
  _drawPlatforms(platforms) {
    const v = this._bgCache ? this._bgCache.v : 0;
    if (!this._platCache || this._platCache.list !== platforms || this._platCache.v !== v) {
      const rnd = Renderer._rng(7 + v * 31 + platforms.length);
      this._platCache = { list: platforms, v, img: this._offscreen(g => {
        for (const p of platforms) {
          if (p.oneWay) this._paintPlank(g, p, v, rnd); else this._paintGround(g, p, v, rnd);
        }
      }) };
    }
    this.ctx.drawImage(this._platCache.img, 0, 0, this.W, this.H);
  }
  _drawVignette() {
    if (!this._vignette) this._vignette = this._offscreen(g => {
      const gr = g.createRadialGradient(400, 260, 220, 400, 260, 520);
      gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.45)');
      g.fillStyle = gr; g.fillRect(0, 0, this.W, this.H);
    });
    this.ctx.drawImage(this._vignette, 0, 0, this.W, this.H);
  }
  _drawPlayer(player) {
    const { x, y, w, h, facing: f, charId } = player;
    const alpha = player.isInvincible ? 0.55 + Math.sin(Date.now()/70)*0.35 : 1;
    // bright flash right after taking damage (invincibleTimer starts at 1500)
    const flash = player.invincibleTimer > 1300 ? (player.invincibleTimer - 1300) / 200 : 0;
    if (this._drawActor(player, charId, {
      alpha, flash,
      attack: player.state === 'attack' ? player.attackAnim : 0,
      dash: player.state === 'special',
    })) return;
    // Procedural fallback
    const ctx = this.ctx; ctx.save();
    ctx.globalAlpha = alpha;
    if (charId==='champion') this._drawChampion(ctx,x,y,w,h,f,player);
    else if (charId==='ranger') this._drawRanger(ctx,x,y,w,h,f,player);
    else if (charId==='savage') this._drawSavage(ctx,x,y,w,h,f,player);
    ctx.restore();
  }
  _drawChampion(ctx, x, y, w, h, f, player) {
    ctx.save();
    if (f===-1) { ctx.translate(x+w/2,0); ctx.scale(-1,1); ctx.translate(-(x+w/2),0); }
    const r=(c,lx,ly,lw,lh)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);};
    const ro=(c,lx,ly,lw,lh,lw2=1.5)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);ctx.strokeStyle='#111';ctx.lineWidth=lw2;ctx.strokeRect(lx+lw2/2,ly+lw2/2,lw-lw2,lh-lw2);};
    const ci=(c,cx,cy,cr,sw=1.5)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=sw;ctx.stroke();};
    // cape behind body (left side)
    ro('#2244bb', x, y+10, 7, h-14, 1.5);
    // legs + boots
    ro('#221155', x+3, y+h-14, 9, 14, 1.5);
    ro('#221155', x+w-12, y+h-14, 9, 14, 1.5);
    // body armor
    ro('#8866cc', x+4, y+16, w-8, h-26, 1.5);
    // shoulder pads
    ro('#6644aa', x+1, y+16, 7, 7, 1.5);
    ro('#6644aa', x+w-8, y+16, 7, 7, 1.5);
    // chest highlight
    r('#aa88ee', x+6, y+17, w-12, 4);
    // shield on left side
    ro('#8b5a20', x-4, y+18, 9, 14, 1.5);
    r('#c8a820', x-1, y+22, 4, 4);
    // sword on right side (shift forward if attacking)
    const swOff = (player && player.state==='attack') ? 7 : 0;
    ro('#c8c8d8', x+w+2+swOff, y+10, 4, 22, 1.5);
    ro('#c89820', x+w+swOff, y+28, 8, 4, 1.5);
    // large chibi head
    ci('#c8906a', x+w/2, y+9, 9, 2);
    // dark hair base rect
    r('#1a1a2e', x+w/2-8, y, 16, 8);
    // 3 spiky triangles up
    ctx.fillStyle='#1a1a2e';
    ctx.beginPath(); ctx.moveTo(x+w/2-6,y+2); ctx.lineTo(x+w/2-8,y-5); ctx.lineTo(x+w/2-3,y+1); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+w/2-1,y+1); ctx.lineTo(x+w/2,y-7); ctx.lineTo(x+w/2+3,y+1); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+w/2+3,y+2); ctx.lineTo(x+w/2+7,y-5); ctx.lineTo(x+w/2+8,y+2); ctx.closePath(); ctx.fill();
    // eyes
    r('#111', x+w/2-5, y+7, 4, 3);
    r('#111', x+w/2+1, y+7, 4, 3);
    r('#fff', x+w/2-4, y+7, 1, 1);
    r('#fff', x+w/2+2, y+7, 1, 1);
    // smile
    ctx.strokeStyle='#111'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.arc(x+w/2, y+12, 3, 0.1, Math.PI-0.1); ctx.stroke();
    ctx.restore();
  }
  _drawRanger(ctx, x, y, w, h, f, player) {
    ctx.save();
    if (f===-1) { ctx.translate(x+w/2,0); ctx.scale(-1,1); ctx.translate(-(x+w/2),0); }
    const r=(c,lx,ly,lw,lh)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);};
    const ro=(c,lx,ly,lw,lh,lw2=1.5)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);ctx.strokeStyle='#111';ctx.lineWidth=lw2;ctx.strokeRect(lx+lw2/2,ly+lw2/2,lw-lw2,lh-lw2);};
    const ci=(c,cx,cy,cr,sw=1.5)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=sw;ctx.stroke();};
    // quiver of arrows on back (right side behind body)
    ro('#8b5a20', x+w-5, y+12, 6, 14, 1);
    r('#c8a800', x+w-4, y+10, 1, 4);
    r('#c8a800', x+w-2, y+9, 1, 5);
    r('#c8a800', x+w, y+10, 1, 4);
    // legs + boots
    ro('#1a1a2a', x+2, y+h-14, 8, 14, 1.5);
    ro('#1a1a2a', x+w-10, y+h-14, 8, 14, 1.5);
    ro('#5a3a1a', x+2, y+h-7, 8, 7, 1.5);
    ro('#5a3a1a', x+w-10, y+h-7, 8, 7, 1.5);
    // dark body top
    ro('#2a2a3a', x+3, y+16, w-6, h-24, 1.5);
    // red vest on top of body
    ro('#cc3322', x+4, y+16, w-8, h-28, 1.5);
    r('#dd5544', x+5, y+17, w-10, 4);
    // bow on left side
    const bowOff = (player && player.state==='attack') ? -3 : 0;
    ctx.strokeStyle='#8b5a20'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(x-2+bowOff, y+h/2-2, 12, -1.1, 1.1, false); ctx.stroke();
    // bowstring
    ctx.strokeStyle='#c8c0a0'; ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(x-2+bowOff, y+h/2-2-12*Math.sin(1.1));
    ctx.lineTo(x-2+bowOff, y+h/2-2+12*Math.sin(1.1));
    ctx.stroke();
    // head
    ci('#8b5030', x+w/2, y+8, 8, 2);
    // black wavy hair covering top half
    r('#1a1010', x+w/2-8, y, 16, 9);
    r('#1a1010', x+w/2-9, y+2, 4, 5);
    r('#1a1010', x+w/2+5, y+2, 4, 5);
    // eyes
    r('#111', x+w/2-4, y+7, 3, 2);
    r('#111', x+w/2+1, y+7, 3, 2);
    r('#fff', x+w/2-3, y+7, 1, 1);
    r('#fff', x+w/2+2, y+7, 1, 1);
    // smile
    ctx.strokeStyle='#111'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.arc(x+w/2, y+11, 2.5, 0.1, Math.PI-0.1); ctx.stroke();
    ctx.restore();
  }
  _drawSavage(ctx, x, y, w, h, f, player) {
    ctx.save();
    if (f===-1) { ctx.translate(x+w/2,0); ctx.scale(-1,1); ctx.translate(-(x+w/2),0); }
    const r=(c,lx,ly,lw,lh)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);};
    const ro=(c,lx,ly,lw,lh,lw2=1.5)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);ctx.strokeStyle='#111';ctx.lineWidth=lw2;ctx.strokeRect(lx+lw2/2,ly+lw2/2,lw-lw2,lh-lw2);};
    const ci=(c,cx,cy,cr,sw=1.5)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=sw;ctx.stroke();};
    // wide legs (slightly spread)
    ro('#5a7a1a', x, y+h-16, 11, 16, 1.5);
    ro('#5a7a1a', x+w-11, y+h-16, 11, 16, 1.5);
    // fur trim on bottom of pants
    ro('#c8a040', x-1, y+h-18, w+2, 4, 1);
    // muscular body (wider)
    ro('#8a5025', x+1, y+14, w-2, h-26, 2);
    r('#a06030', x+3, y+15, w-6, 6);
    // bead necklace
    for (let bx = x+4; bx < x+w-4; bx += 4) {
      ctx.fillStyle='#c8a820'; ctx.beginPath(); ctx.arc(bx, y+22, 2, 0, Math.PI*2); ctx.fill();
    }
    // hammer on right side
    const hy = (player && player.state==='attack') ? y : y+10;
    ro('#6b4226', x+w+2, hy+6, 4, 20, 1.5);
    ro('#888888', x+w-2, hy, 14, 10, 2);
    r('#aaaaaa', x+w, hy+1, 10, 3);
    // large chibi head (bigger than others)
    ci('#8a5025', x+w/2, y+9, 10, 2);
    // wild hair in all directions
    ctx.fillStyle='#1a0808';
    const hairSpikes = [[-10,-8],[-8,-12],[-4,-14],[0,-15],[4,-14],[8,-12],[10,-8],[12,-4],[-12,-4],[-11,0],[11,0]];
    for (const [dx,dy] of hairSpikes) {
      ctx.beginPath(); ctx.arc(x+w/2+dx, y+9+dy, 3.5, 0, Math.PI*2); ctx.fill();
    }
    r('#1a0808', x+w/2-10, y, 20, 8);
    // angry eyes (thicker)
    r('#111', x+w/2-5, y+7, 5, 3);
    r('#111', x+w/2+1, y+7, 5, 3);
    r('#ff4444', x+w/2-4, y+7, 2, 2);
    r('#ff4444', x+w/2+2, y+7, 2, 2);
    // angry brow
    ctx.strokeStyle='#111'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(x+w/2-6,y+5); ctx.lineTo(x+w/2-1,y+6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+w/2+1,y+6); ctx.lineTo(x+w/2+6,y+5); ctx.stroke();
    // tongue sticking out
    ro('#dd5555', x+w/2-3, y+14, 6, 4, 1);
    ctx.restore();
  }
  _drawEnemy(enemy) {
    const { x, y, w, h, facing:f, faction, variant, isBoss, enemyId } = enemy;
    // Sprite-based drawing (uses enemyId which matches SPRITE_DATA keys)
    const spriteKey = enemyId || (isBoss ? FACTION_BOSS[faction] : null);
    // attack progress: first 250ms after the cooldown is re-armed
    const sinceAtk = enemy.attackCooldown - enemy.attackCooldownTimer;
    const attack = enemy.attackCooldownTimer > 0 && sinceAtk < 250 ? sinceAtk / 250 : 0;
    const pulse = 0.6 + Math.sin(Date.now()/100)*0.4;
    const drawn = spriteKey && this._drawActor(enemy, spriteKey, {
      flash: enemy.hitFlashTimer / 200,
      attack,
      dash: !!enemy.charging,
      scale: isBoss ? 0.97 : 1,
      glow: enemy.phase2 ? `rgba(255,60,30,${0.6 + pulse*0.4})` : null,
      glowBlur: 10 + pulse * 10,
    });
    if (!drawn) {
      const alpha = enemy.hitFlashTimer > 0 ? 0.4 + Math.sin(Date.now()/40)*0.6 : 1;
      // Procedural fallback
      const ctx = this.ctx; ctx.save();
      ctx.globalAlpha = alpha;
      if (isBoss)                  this._drawBoss(ctx, enemy);
      else if (faction==='bandits') this._drawBandit(ctx,x,y,w,h,f,variant);
      else if (faction==='goblins') this._drawGoblin(ctx,x,y,w,h,f,variant);
      else if (faction==='orcs')    this._drawOrc(ctx,x,y,w,h,f,variant);
      ctx.restore();
    }
    // HP bar (always drawn on top)
    const ctx = this.ctx;
    const top = drawn && enemy._visTop !== undefined ? Math.min(enemy.y, enemy._visTop) : enemy.y;
    const bw=enemy.w+8, bx=enemy.x-4, by=top-8, fr=Math.max(0,enemy.hp/enemy.maxHp);
    if (fr >= 1 && !isBoss) return;
    const rr = (x0, w0) => { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x0, by, w0, 5, 2.5) : ctx.rect(x0, by, w0, 5); };
    ctx.fillStyle='rgba(10,6,14,0.75)'; rr(bx-1, bw+2); ctx.fill();
    ctx.fillStyle=isBoss ? '#e04040' : fr>0.5?Colors.HP_HIGH:fr>0.25?Colors.HP_MED:Colors.HP_LOW;
    if (fr > 0) { rr(bx, Math.max(3, bw*fr)); ctx.fill(); }
    ctx.fillStyle='rgba(255,255,255,0.25)'; ctx.fillRect(bx+2, by+1, Math.max(0, bw*fr-4), 1);
  }
  _drawBandit(ctx,x,y,w,h,f,variant) {
    ctx.save();
    if (f===-1) { ctx.translate(x+w/2,0); ctx.scale(-1,1); ctx.translate(-(x+w/2),0); }
    const r=(c,lx,ly,lw,lh)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);};
    const ro=(c,lx,ly,lw,lh,lw2=1.5)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);ctx.strokeStyle='#111';ctx.lineWidth=lw2;ctx.strokeRect(lx+lw2/2,ly+lw2/2,lw-lw2,lh-lw2);};
    const ci=(c,cx,cy,cr,sw=1.5)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=sw;ctx.stroke();};
    // ragged cloak body (wider at bottom)
    ro('#2a3040', x+2, y+10, w-4, h-14, 2);
    ro('#1a2030', x+4, y+12, w-8, h-18, 1);
    // ragged bottom edges
    r('#2a3040', x, y+h-10, 5, 10);
    r('#2a3040', x+w-5, y+h-10, 5, 10);
    r('#1a2030', x+1, y+h-8, 4, 8);
    // dark pants legs
    ro('#111828', x+3, y+h-12, 8, 12, 1.5);
    ro('#111828', x+w-11, y+h-12, 8, 12, 1.5);
    // weapon
    if (variant==='melee') {
      ro('#aaaaaa', x+w+1, y+8, 4, 18, 1.5);
      ro('#666666', x+w-1, y+22, 8, 3, 1);
    } else {
      ctx.strokeStyle='#8b5a20'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.arc(x-3, y+h/2-2, 11, -1.1, 1.1, false); ctx.stroke();
      ctx.strokeStyle='#c8c0a0'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x-3, y+h/2-2-11*Math.sin(1.1)); ctx.lineTo(x-3, y+h/2-2+11*Math.sin(1.1)); ctx.stroke();
    }
    // skull face (large oval, bone white)
    ci('#d8d0c0', x+w/2, y+7, 8, 2);
    // dark hood above skull
    r('#1a2030', x+w/2-9, y-2, 18, 10);
    r('#2a3040', x+w/2-8, y-4, 16, 8);
    // large black oval eye sockets
    ctx.fillStyle='#111';
    ctx.beginPath(); ctx.ellipse(x+w/2-4, y+6, 3, 4, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+w/2+4, y+6, 3, 4, 0, 0, Math.PI*2); ctx.fill();
    // orange glow inside eye sockets
    ctx.fillStyle='#ff8800'; ctx.globalAlpha=0.7;
    ctx.beginPath(); ctx.ellipse(x+w/2-4, y+6, 2, 2.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(x+w/2+4, y+6, 2, 2.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
    // small nose dots
    r('#111', x+w/2-1, y+10, 2, 1);
    // thin grim mouth line
    ctx.strokeStyle='#111'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(x+w/2-4, y+12); ctx.lineTo(x+w/2+4, y+12); ctx.stroke();
    ctx.restore();
  }
  _drawGoblin(ctx,x,y,w,h,f,variant) {
    ctx.save();
    if (f===-1) { ctx.translate(x+w/2,0); ctx.scale(-1,1); ctx.translate(-(x+w/2),0); }
    const r=(c,lx,ly,lw,lh)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);};
    const ro=(c,lx,ly,lw,lh,lw2=1.5)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);ctx.strokeStyle='#111';ctx.lineWidth=lw2;ctx.strokeRect(lx+lw2/2,ly+lw2/2,lw-lw2,lh-lw2);};
    const ci=(c,cx,cy,cr,sw=1.5)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=sw;ctx.stroke();};
    // weapon (drawn first so it appears behind body for positioning)
    if (variant==='melee') {
      ro('#aaaaaa', x+w+1, y+8, 3, 14, 1.5);
      ro('#888888', x+w-1, y+7, 7, 4, 1);
    } else {
      // staff extends above head
      ro('#6b4226', x-3, y-10, 3, h+6, 1.5);
      // glowing orb at top of staff
      const ci2=(c,cx,cy,cr,sw=1.5)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=sw;ctx.stroke();};
      ci2('#44ff88', x-1, y-10, 6, 2);
      ctx.fillStyle='rgba(100,255,150,0.4)'; ctx.beginPath(); ctx.arc(x-1,y-10,9,0,Math.PI*2); ctx.fill();
      // right hand glow
      ctx.fillStyle='rgba(100,255,150,0.5)'; ctx.beginPath(); ctx.arc(x+w+2, y+h/2, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#44ff88'; ctx.beginPath(); ctx.arc(x+w+2, y+h/2, 3, 0, Math.PI*2); ctx.fill();
    }
    // leather body armor
    ro('#8b5a20', x+2, y+h-20, w-4, 20, 1.5);
    // legs with sash
    ro('#6b4226', x+1, y+h-12, 8, 12, 1.5);
    ro('#6b4226', x+w-9, y+h-12, 8, 12, 1.5);
    // red sash
    r('#cc2222', x+1, y+h-20, w-2, 4);
    // body with leather
    ro('#6aaa3c', x+3, y+12, w-6, h-22, 1.5);
    // big pointy ears (triangles)
    ctx.fillStyle='#6aaa3c';
    ctx.beginPath(); ctx.moveTo(x, y+10); ctx.lineTo(x-7, y+4); ctx.lineTo(x, y+16); ctx.closePath();
    ctx.fill(); ctx.strokeStyle='#111'; ctx.lineWidth=1.5; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x+w, y+10); ctx.lineTo(x+w+7, y+4); ctx.lineTo(x+w, y+16); ctx.closePath();
    ctx.fill(); ctx.stroke();
    // large head
    ci('#6aaa3c', x+w/2, y+8, 8, 2);
    // blue mohawk rect + spikes on top
    r('#1a5a6a', x+w/2-4, y+2, 8, 6);
    ctx.fillStyle='#1a5a6a';
    ctx.beginPath(); ctx.moveTo(x+w/2-3,y+3); ctx.lineTo(x+w/2-1,y-4); ctx.lineTo(x+w/2+1,y+3); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+w/2,y+2); ctx.lineTo(x+w/2+2,y-5); ctx.lineTo(x+w/2+4,y+2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+w/2-4,y+2); ctx.lineTo(x+w/2-3,y-3); ctx.lineTo(x+w/2-1,y+2); ctx.closePath(); ctx.fill();
    // red eyes
    r('#ff2222', x+w/2-4, y+6, 3, 2);
    r('#ff2222', x+w/2+1, y+6, 3, 2);
    // fangs
    ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.moveTo(x+w/2-2,y+12); ctx.lineTo(x+w/2-1,y+15); ctx.lineTo(x+w/2,y+12); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+w/2+1,y+12); ctx.lineTo(x+w/2+2,y+15); ctx.lineTo(x+w/2+3,y+12); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  _drawOrc(ctx,x,y,w,h,f,variant) {
    ctx.save();
    if (f===-1) { ctx.translate(x+w/2,0); ctx.scale(-1,1); ctx.translate(-(x+w/2),0); }
    const r=(c,lx,ly,lw,lh)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);};
    const ro=(c,lx,ly,lw,lh,lw2=1.5)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);ctx.strokeStyle='#111';ctx.lineWidth=lw2;ctx.strokeRect(lx+lw2/2,ly+lw2/2,lw-lw2,lh-lw2);};
    const ci=(c,cx,cy,cr,sw=1.5)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=sw;ctx.stroke();};
    // very wide legs
    ro('#5a7a20', x, y+h-14, 12, 14, 2);
    ro('#5a7a20', x+w-12, y+h-14, 12, 14, 2);
    if (variant==='melee') {
      // brute: bare skin thick arms on both sides
      ro('#5a7a20', x-8, y+14, 10, 20, 2);
      ro('#5a7a20', x+w-2, y+14, 10, 20, 2);
      // wide bare body
      ro('#5a7a20', x, y+10, w, h-20, 2);
      r('#6a8a28', x+2, y+12, w-4, 5);
    } else {
      // vest body for archer
      ro('#5a7a20', x+2, y+12, w-4, h-22, 2);
      ro('#6b4226', x+3, y+13, w-6, h-26, 1.5);
      // topknot hair on back
      r('#1a1a1a', x+w/2-3, y+2, 6, 4);
      ctx.fillStyle='#1a1a1a';
      ctx.beginPath(); ctx.moveTo(x+w/2-2,y+3); ctx.lineTo(x+w/2,y-4); ctx.lineTo(x+w/2+2,y+3); ctx.closePath(); ctx.fill();
      // bow on left side
      ctx.strokeStyle='#8b5a20'; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.arc(x-3, y+h/2, 13, -1.1, 1.1, false); ctx.stroke();
      ctx.strokeStyle='#c8c0a0'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(x-3, y+h/2-13*Math.sin(1.1)); ctx.lineTo(x-3, y+h/2+13*Math.sin(1.1)); ctx.stroke();
    }
    // head (slightly smaller relative to body)
    ci('#5a7a20', x+w/2, y+8, 8, 2);
    // angry brow ridge (thick dark rect)
    ro('#1a1a1a', x+w/2-6, y+4, 12, 3, 1);
    // for brute: small stubby mohawk
    if (variant==='melee') {
      r('#1a1a1a', x+w/2-3, y+1, 6, 4);
      ctx.fillStyle='#1a1a1a';
      ctx.beginPath(); ctx.moveTo(x+w/2-2,y+2); ctx.lineTo(x+w/2,y-3); ctx.lineTo(x+w/2+2,y+2); ctx.closePath(); ctx.fill();
    }
    // orange-red eyes
    r('#ff6600', x+w/2-4, y+6, 3, 3);
    r('#ff6600', x+w/2+1, y+6, 3, 3);
    r('#ffaa00', x+w/2-3, y+6, 1, 1);
    r('#ffaa00', x+w/2+2, y+6, 1, 1);
    // protruding lower jaw / tusk hints
    r('#5a7a20', x+w/2-5, y+12, 10, 4);
    ctx.fillStyle='#d8d0a0';
    ctx.beginPath(); ctx.moveTo(x+w/2-3,y+12); ctx.lineTo(x+w/2-2,y+16); ctx.lineTo(x+w/2-1,y+12); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x+w/2+1,y+12); ctx.lineTo(x+w/2+2,y+16); ctx.lineTo(x+w/2+3,y+12); ctx.closePath(); ctx.fill();
    // melee weapon (axe head + handle)
    if (variant==='melee') {
      ro('#888888', x+w+2, y+8, 4, 24, 2);
      ro('#aaaaaa', x+w-2, y+6, 12, 12, 2);
      r('#cccccc', x+w, y+8, 6, 4);
    }
    ctx.restore();
  }
  _drawBoss(ctx, enemy) {
    const { x, y, w, h, facing:f, faction, phase2 } = enemy;
    ctx.save();
    if (f===-1) { ctx.translate(x+w/2,0); ctx.scale(-1,1); ctx.translate(-(x+w/2),0); }
    const r=(c,lx,ly,lw,lh)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);};
    const ro=(c,lx,ly,lw,lh,lw2=1.5)=>{ctx.fillStyle=c;ctx.fillRect(lx,ly,lw,lh);ctx.strokeStyle='#111';ctx.lineWidth=lw2;ctx.strokeRect(lx+lw2/2,ly+lw2/2,lw-lw2,lh-lw2);};
    const ci=(c,cx,cy,cr,sw=1.5)=>{ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx,cy,cr,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=sw;ctx.stroke();};
    if (faction==='bandits') {
      // Bandit King: skull face with golden crown, gray fur collar, dark cape
      // cape
      ro('#1a1830', x-2, y+8, 8, h-10, 2);
      // fur collar
      ro('#888880', x+2, y+12, w-4, 10, 2);
      r('#aaaaaa', x+3, y+12, w-6, 4);
      // legs
      ro('#111828', x+3, y+h-16, 11, 16, 2);
      ro('#111828', x+w-14, y+h-16, 11, 16, 2);
      // dark cloak body
      ro('#2a3040', x+2, y+18, w-4, h-28, 2);
      // weapon on right side
      ro('#aaaaaa', x+w+2, y+8, 5, 24, 2);
      ro('#666666', x+w, y+22, 10, 4, 2);
      // skull face (large)
      ci('#d8d0c0', x+w/2, y+9, 11, 2.5);
      // dark hood
      r('#1a2030', x+w/2-12, y-2, 24, 12);
      // Golden crown
      ro('#c8a820', x+w/2-10, y-4, 20, 6, 2);
      ctx.fillStyle='#c8a820';
      for (let cx2=x+w/2-8; cx2<=x+w/2+4; cx2+=6) {
        ctx.beginPath(); ctx.moveTo(cx2,y-4); ctx.lineTo(cx2+3,y-10); ctx.lineTo(cx2+6,y-4); ctx.closePath(); ctx.fill();
      }
      // Large hollow eye sockets
      ctx.fillStyle='#111';
      ctx.beginPath(); ctx.ellipse(x+w/2-4, y+8, 4, 5, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x+w/2+4, y+8, 4, 5, 0, 0, Math.PI*2); ctx.fill();
      // orange glow in eyes
      ctx.fillStyle='#ff8800'; ctx.globalAlpha=0.8;
      ctx.beginPath(); ctx.ellipse(x+w/2-4, y+8, 2.5, 3, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x+w/2+4, y+8, 2.5, 3, 0, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha=1;
      r('#111', x+w/2-1, y+12, 2, 1);
      ctx.strokeStyle='#111'; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(x+w/2-5, y+15); ctx.lineTo(x+w/2+5, y+15); ctx.stroke();
    } else if (faction==='goblins') {
      // Goblin Warchief: large blue-tinted goblin, spiked metal crown, heavy chest armor, spear
      // spear extends above head
      ro('#6b4226', x-2, y-16, 4, h+12, 2);
      ro('#888888', x-5, y-20, 10, 14, 2);
      r('#aaaaaa', x-3, y-18, 6, 4);
      // gold bead necklace
      for (let bx = x+4; bx < x+w-4; bx += 5) {
        ctx.fillStyle='#c8a820'; ctx.beginPath(); ctx.arc(bx, y+22, 2.5, 0, Math.PI*2); ctx.fill();
      }
      // heavy chest armor
      ro('#555555', x+2, y+14, w-4, h-22, 2.5);
      r('#777777', x+3, y+15, w-6, 6);
      // wide legs
      ro('#3a6a7a', x, y+h-16, 12, 16, 2);
      ro('#3a6a7a', x+w-12, y+h-16, 12, 16, 2);
      // big pointy ears
      ctx.fillStyle='#3a6a7a';
      ctx.beginPath(); ctx.moveTo(x, y+12); ctx.lineTo(x-10, y+5); ctx.lineTo(x, y+20); ctx.closePath();
      ctx.fill(); ctx.strokeStyle='#111'; ctx.lineWidth=2; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x+w, y+12); ctx.lineTo(x+w+10, y+5); ctx.lineTo(x+w, y+20); ctx.closePath();
      ctx.fill(); ctx.stroke();
      // large head
      ci('#3a6a7a', x+w/2, y+9, 11, 2.5);
      // spiked metal crown
      ro('#888888', x+w/2-10, y-1, 20, 7, 2);
      ctx.fillStyle='#888888';
      for (let cx2=x+w/2-8; cx2<=x+w/2+2; cx2+=7) {
        ctx.beginPath(); ctx.moveTo(cx2,y-1); ctx.lineTo(cx2+3,y-7); ctx.lineTo(cx2+6,y-1); ctx.closePath(); ctx.fill();
      }
      // glowing red eyes
      r('#ff2222', x+w/2-5, y+7, 4, 3);
      r('#ff2222', x+w/2+1, y+7, 4, 3);
      r('#ff6666', x+w/2-4, y+7, 2, 2);
      r('#ff6666', x+w/2+2, y+7, 2, 2);
      // fangs
      ctx.fillStyle='#ffffff';
      ctx.beginPath(); ctx.moveTo(x+w/2-3,y+13); ctx.lineTo(x+w/2-2,y+17); ctx.lineTo(x+w/2-1,y+13); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x+w/2+1,y+13); ctx.lineTo(x+w/2+2,y+17); ctx.lineTo(x+w/2+3,y+13); ctx.closePath(); ctx.fill();
    } else {
      // Orc Warlord: large dark green, tall spiked black mohawk, heavy fur+metal armor, dual weapons
      // left weapon
      ro('#888888', x-8, y+12, 5, 26, 2);
      ro('#aaaaaa', x-12, y+10, 13, 12, 2);
      // right weapon
      ro('#888888', x+w+3, y+12, 5, 26, 2);
      ro('#aaaaaa', x+w-1, y+10, 13, 12, 2);
      // very wide legs
      ro('#3a6020', x-2, y+h-18, 14, 18, 2);
      ro('#3a6020', x+w-12, y+h-18, 14, 18, 2);
      // fur + metal armor body (very wide stance)
      ro('#555555', x, y+8, w, h-22, 2.5);
      ro('#8b6914', x+2, y+10, w-4, h-26, 2);
      r('#6a5010', x+3, y+11, w-6, 6);
      // shoulder pads (very wide)
      ro('#555555', x-6, y+10, 12, 10, 2);
      ro('#555555', x+w-6, y+10, 12, 10, 2);
      r('#777777', x-5, y+11, 10, 4);
      r('#777777', x+w-5, y+11, 10, 4);
      // thick arms
      ro('#3a6020', x-4, y+18, 8, 18, 2);
      ro('#3a6020', x+w-4, y+18, 8, 18, 2);
      // head
      ci('#3a6020', x+w/2, y+9, 12, 2.5);
      // tall spiked black mohawk
      r('#1a1a1a', x+w/2-4, y+1, 8, 8);
      ctx.fillStyle='#1a1a1a';
      ctx.beginPath(); ctx.moveTo(x+w/2-4,y+2); ctx.lineTo(x+w/2-1,y-9); ctx.lineTo(x+w/2+2,y+2); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x+w/2-1,y+2); ctx.lineTo(x+w/2+1,y-12); ctx.lineTo(x+w/2+4,y+2); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x+w/2+2,y+2); ctx.lineTo(x+w/2+4,y-8); ctx.lineTo(x+w/2+6,y+2); ctx.closePath(); ctx.fill();
      // angry brow ridge
      ro('#1a1a1a', x+w/2-8, y+4, 16, 4, 1.5);
      // orange-red eyes
      r('#ff6600', x+w/2-5, y+8, 4, 3);
      r('#ff6600', x+w/2+1, y+8, 4, 3);
      r('#ffaa00', x+w/2-4, y+8, 2, 2);
      r('#ffaa00', x+w/2+2, y+8, 2, 2);
      // protruding jaw + tusks
      r('#3a6020', x+w/2-6, y+14, 12, 5);
      ctx.fillStyle='#d8d0a0';
      ctx.beginPath(); ctx.moveTo(x+w/2-4,y+14); ctx.lineTo(x+w/2-3,y+19); ctx.lineTo(x+w/2-2,y+14); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x+w/2+2,y+14); ctx.lineTo(x+w/2+3,y+19); ctx.lineTo(x+w/2+4,y+14); ctx.closePath(); ctx.fill();
      // phase2: speed lines
      if (phase2) {
        ctx.strokeStyle='rgba(255,100,0,0.5)'; ctx.lineWidth=2;
        for (let i=0; i<4; i++) {
          ctx.beginPath(); ctx.moveTo(x-20-i*8, y+10+i*8); ctx.lineTo(x-6-i*8, y+10+i*8); ctx.stroke();
        }
      }
    }
    // phase2 red glow outline for all bosses
    if (phase2) {
      ctx.strokeStyle='#ff4444'; ctx.lineWidth=3;
      const pulse = 0.6 + Math.sin(Date.now()/100)*0.4;
      ctx.globalAlpha = pulse;
      ctx.strokeRect(x-3, y-3, w+6, h+6);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }
  _drawProjectile(proj) {
    const ctx = this.ctx; ctx.save();
    const ang = Math.atan2(proj.vy, proj.vx);
    if (proj.kind === 'goblinShaman') {
      // spirit-fire orb with a fading trail
      const sp = Math.hypot(proj.vx, proj.vy) || 1, ux = proj.vx / sp, uy = proj.vy / sp;
      for (let i = 4; i >= 1; i--) {
        ctx.globalAlpha = 0.12 * (5 - i);
        ctx.fillStyle = '#7dffb0'; ctx.beginPath(); ctx.arc(proj.cx - ux * i * 6, proj.cy - uy * i * 6, 5 - i * 0.8, 0, Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 1; this._glow(ctx, proj.cx, proj.cy, 14, 'rgba(100,255,170,0.6)');
      ctx.fillStyle = '#e8fff0'; ctx.beginPath(); ctx.arc(proj.cx, proj.cy, 3, 0, Math.PI*2); ctx.fill();
      ctx.restore(); return;
    }
    ctx.translate(proj.cx, proj.cy); ctx.rotate(ang);
    const player = proj.owner === 'player', len = player ? 18 : proj.kind === 'orcArcher' ? 20 : 16;
    if (player && proj.piercing) { ctx.globalAlpha = 0.35; this._glow(ctx, 0, 0, 14, 'rgba(255,220,90,0.8)'); ctx.globalAlpha = 1; }
    ctx.strokeStyle = player ? '#d8b878' : '#5a4030'; ctx.lineWidth = proj.kind === 'orcArcher' ? 2 : 1.5;
    ctx.beginPath(); ctx.moveTo(-len/2, 0); ctx.lineTo(len/2 - 3, 0); ctx.stroke();
    ctx.fillStyle = player ? '#e8e8f0' : '#9a9aa0';
    ctx.beginPath(); ctx.moveTo(len/2 + 2, 0); ctx.lineTo(len/2 - 4, -3); ctx.lineTo(len/2 - 4, 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = player ? '#cc3322' : '#3a2a2a';
    ctx.beginPath(); ctx.moveTo(-len/2 + 4, 0); ctx.lineTo(-len/2 - 1, -3.5); ctx.lineTo(-len/2 + 1, 0); ctx.lineTo(-len/2 - 1, 3.5); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  _drawEffect(ef) {
    const ctx = this.ctx, prog = ef.timer / ef.maxTimer; // 1 -> 0
    ctx.save(); ctx.globalAlpha = Math.min(1, prog * 1.3);
    if (ef.type==='hit') {
      if (ef._a === undefined) ef._a = Math.random() * Math.PI;
      const t = 1 - prog;
      ctx.strokeStyle = 'rgba(255,240,200,0.9)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ef.x, ef.y, 4 + t * 14, 0, Math.PI*2); ctx.stroke();
      ctx.strokeStyle = '#ffe070'; ctx.lineWidth = 2; ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const a = ef._a + i * Math.PI / 3, r0 = 3 + t * 10, r1 = r0 + 7 * prog + 2;
        ctx.beginPath(); ctx.moveTo(ef.x + Math.cos(a) * r0, ef.y + Math.sin(a) * r0); ctx.lineTo(ef.x + Math.cos(a) * r1, ef.y + Math.sin(a) * r1); ctx.stroke();
      }
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(ef.x, ef.y, 4 * prog, 0, Math.PI*2); ctx.fill();
    } else if (ef.type==='aoe_ring') {
      const t = 1 - prog, r = ef.radius * (0.3 + t * 0.8);
      ctx.strokeStyle = 'rgba(255,190,80,0.85)'; ctx.lineWidth = 5 * prog + 1;
      ctx.beginPath(); ctx.ellipse(ef.cx, ef.cy, r, r * 0.35, 0, 0, Math.PI*2); ctx.stroke();
      ctx.fillStyle = 'rgba(140,110,80,0.5)';
      for (let i = 0; i < 10; i++) {
        const a = i / 10 * Math.PI * 2;
        ctx.beginPath(); ctx.arc(ef.cx + Math.cos(a) * r * 0.9, ef.cy + Math.sin(a) * r * 0.3 - t * 8, 3 + t * 5, 0, Math.PI*2); ctx.fill();
      }
    } else if (ef.type==='slash') {
      // crescent swoosh in front of the attacker
      const f = ef.facing, sx = f===1 ? ef.x : ef.x+ef.w, t = 1 - prog;
      const reach = ef.w * (0.6 + t * 0.6), y0 = ef.y - 4, y1 = ef.y + ef.h;
      ctx.fillStyle = ef.enemy ? 'rgba(255,120,100,0.75)' : 'rgba(255,255,255,0.85)';
      ctx.beginPath(); ctx.moveTo(sx, y0);
      ctx.quadraticCurveTo(sx + f * reach * 1.6, (y0 + y1) / 2, sx, y1);
      ctx.quadraticCurveTo(sx + f * reach * 0.9, (y0 + y1) / 2, sx, y0);
      ctx.fill();
    }
    ctx.restore();
  }
  renderCharacterSelect(selectedIndex, selectedResolution=0) {
    const ctx = this.ctx;
    const g = ctx.createLinearGradient(0,0,0,this.H); g.addColorStop(0,'#0d1b2a'); g.addColorStop(1,'#1e3a5f');
    ctx.fillStyle=g; ctx.fillRect(0,0,this.W,this.H);
    ctx.fillStyle=Colors.STAR;
    for (const s of this._stars) { ctx.globalAlpha=0.5; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); }
    ctx.globalAlpha=1;
    ctx.fillStyle=Colors.COOLDOWN_READY; ctx.font='bold 32px monospace'; ctx.textAlign='center'; ctx.fillText('MEDIEVAL FANTASY',400,55);
    ctx.fillStyle=Colors.HUD_TEXT; ctx.font='16px monospace'; ctx.fillText('Choose your champion',400,80);
    // Resolution selector
    const resOptions = ['\u25a0 800\u00d7500', '\u25a0 1280\u00d7800', '\u25a0 FULLSCREEN'];
    const resLabels  = ['Standard', 'Large', 'Fullscreen'];
    const btnW=130, btnH=28, btnGap=12;
    const totalW = resOptions.length*btnW + (resOptions.length-1)*btnGap;
    const bx0 = (this.W - totalW) / 2;
    const by  = 392;
    ctx.font='11px monospace'; ctx.textAlign='center';
    ctx.fillStyle='rgba(255,255,255,0.5)'; ctx.fillText('RESOLUTION  \u2014  Tab to change',400,by-10);
    resOptions.forEach((label, i) => {
      const bx = bx0 + i*(btnW+btnGap);
      const sel = i===selectedResolution;
      ctx.fillStyle = sel ? 'rgba(255,200,50,0.25)' : 'rgba(0,0,0,0.5)';
      ctx.fillRect(bx, by, btnW, btnH);
      ctx.strokeStyle = sel ? Colors.COOLDOWN_READY : 'rgba(255,255,255,0.3)';
      ctx.lineWidth = sel ? 2 : 1;
      ctx.strokeRect(bx, by, btnW, btnH);
      ctx.fillStyle = sel ? Colors.COOLDOWN_READY : 'rgba(255,255,255,0.7)';
      ctx.font = `${sel?'bold ':''}11px monospace`;
      ctx.fillText(resLabels[i], bx + btnW/2, by + 12);
      ctx.fillStyle = sel ? 'rgba(255,200,50,0.8)' : 'rgba(255,255,255,0.4)';
      ctx.font='10px monospace';
      ctx.fillText(resOptions[i].slice(2), bx + btnW/2, by + 23);
    });
    ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font='12px monospace';
    ctx.fillText('\u2190 \u2192 to select   Tab: resolution   Enter to confirm',400,446);
    ctx.fillText('Z/J: Attack   X/K: Special   WASD/Arrows: Move   Space/W/Up: Jump',400,462);
    const defs = Object.values(CharacterDefs);
    const cardW=200, cardH=280, gap=30;
    const startX = (this.W - (defs.length*cardW + (defs.length-1)*gap)) / 2;
    defs.forEach((def, i) => {
      const cx=startX+i*(cardW+gap), cy=100, sel=i===selectedIndex;
      ctx.fillStyle=sel?'rgba(255,200,50,0.2)':'rgba(0,0,0,0.5)'; ctx.fillRect(cx,cy,cardW,cardH);
      ctx.strokeStyle=sel?Colors.COOLDOWN_READY:'rgba(255,255,255,0.3)'; ctx.lineWidth=sel?3:1; ctx.strokeRect(cx,cy,cardW,cardH);
      const sprImg = this._sprites[def.id];
      if (sprImg) {
        const dispH = 118;
        const dispW = Math.round(sprImg.width / sprImg.height * dispH);
        const bob = sel ? Math.sin(Date.now()/300) * 3 : 0;
        ctx.save();
        // spotlight + floor shadow behind the portrait
        const spot = ctx.createRadialGradient(cx+cardW/2, cy+90, 4, cx+cardW/2, cy+90, 90);
        spot.addColorStop(0, sel ? 'rgba(255,210,120,0.35)' : 'rgba(255,255,255,0.08)'); spot.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = spot; ctx.fillRect(cx, cy, cardW, 150);
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath(); ctx.ellipse(cx+cardW/2, cy+136, dispW*0.42, 5, 0, 0, Math.PI*2); ctx.fill();
        if (!sel) ctx.globalAlpha = 0.75;
        ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(sprImg, cx + cardW/2 - dispW/2, cy + 136 - dispH + bob, dispW, dispH);
        ctx.restore();
      } else {
        ctx.save(); ctx.translate(cx+cardW/2,cy+80); ctx.scale(2,2);
        const pw=def.width, ph=def.height, px=-pw/2, py=-ph/2;
        if (def.id==='champion') this._drawChampion(ctx,px,py,pw,ph,1,{state:'idle'});
        else if (def.id==='ranger') this._drawRanger(ctx,px,py,pw,ph,1,{state:'idle'});
        else if (def.id==='savage') this._drawSavage(ctx,px,py,pw,ph,1,{state:'idle'});
        ctx.restore();
      }
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
    this.selectedResolution = 0; // 0=800×500, 1=1280×800, 2=Fullscreen
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
    window.addEventListener('resize', () => {
      if (this.selectedResolution === 2) this._scaleToWindow();
    });
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && this.selectedResolution === 2) {
        // User pressed Escape to exit fullscreen — revert to standard
        this.selectedResolution = 0;
        this.renderer.setDisplaySize(800, 500);
      }
    });
  }
  _applyResolution(idx) {
    const canvas = this.canvas;
    const container = canvas.parentElement;
    if (idx === 0) {
      this.renderer.setDisplaySize(800, 500);
      if (document.fullscreenElement) document.exitFullscreen();
    } else if (idx === 1) {
      this.renderer.setDisplaySize(1280, 800);
      if (document.fullscreenElement) document.exitFullscreen();
    } else {
      const req = container.requestFullscreen || container.webkitRequestFullscreen;
      if (req) {
        req.call(container).then(() => this._scaleToWindow()).catch(() => this._scaleToWindow());
      } else {
        this._scaleToWindow();
      }
    }
  }
  _scaleToWindow() {
    const scale = Math.min(window.innerWidth / 800, window.innerHeight / 500);
    this.renderer.setDisplaySize(Math.floor(800 * scale), Math.floor(500 * scale));
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
    if (this.input.tab) this.selectedResolution = (this.selectedResolution + 1) % 3;
    if (this.input.confirm) {
      this._applyResolution(this.selectedResolution);
      this.stageIndex=0; this._initStage(CHAR_LIST[this.selectedCharIndex]); this.state='PLAYING';
    }
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
      this.renderer.renderCharacterSelect(this.selectedCharIndex, this.selectedResolution);
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
