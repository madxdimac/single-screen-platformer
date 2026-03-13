// Platform format: { x, y, w, h, oneWay }
// SpawnPoints: array of {x, y} for enemy spawns
// Stage faction determines enemy pool

export const StageDefs = [
  // Stage 1 - Bandit Camp (simple layout)
  {
    id: 1,
    name: 'Bandit Camp',
    faction: 'bandits',
    bgVariant: 0,
    platforms: [
      // Ground
      { x: 0,   y: 460, w: 800, h: 40, oneWay: false },
      // Mid platforms
      { x: 100, y: 360, w: 150, h: 16, oneWay: true },
      { x: 540, y: 360, w: 150, h: 16, oneWay: true },
      { x: 310, y: 290, w: 180, h: 16, oneWay: true },
      // High platforms
      { x: 60,  y: 220, w: 120, h: 16, oneWay: true },
      { x: 620, y: 220, w: 120, h: 16, oneWay: true },
    ],
    spawnPoints: [
      { x: 50,  y: 420 },
      { x: 750, y: 420 },
      { x: 150, y: 320 },
      { x: 620, y: 320 },
      { x: 390, y: 250 },
    ],
    playerStart: { x: 380, y: 400 },
  },
  // Stage 2 - Bandit Outpost (more vertical)
  {
    id: 2,
    name: 'Bandit Outpost',
    faction: 'bandits',
    bgVariant: 0,
    platforms: [
      { x: 0,   y: 460, w: 800, h: 40, oneWay: false },
      { x: 0,   y: 460, w: 800, h: 40, oneWay: false },
      { x: 50,  y: 370, w: 130, h: 16, oneWay: true },
      { x: 330, y: 370, w: 140, h: 16, oneWay: true },
      { x: 600, y: 370, w: 160, h: 16, oneWay: true },
      { x: 180, y: 280, w: 120, h: 16, oneWay: true },
      { x: 490, y: 280, w: 130, h: 16, oneWay: true },
      { x: 320, y: 200, w: 160, h: 16, oneWay: true },
    ],
    spawnPoints: [
      { x: 40,  y: 420 },
      { x: 760, y: 420 },
      { x: 110, y: 330 },
      { x: 670, y: 330 },
      { x: 400, y: 160 },
    ],
    playerStart: { x: 380, y: 400 },
  },
  // Stage 3 - Goblin Forest
  {
    id: 3,
    name: 'Goblin Forest',
    faction: 'goblins',
    bgVariant: 1,
    platforms: [
      { x: 0,   y: 460, w: 800, h: 40, oneWay: false },
      { x: 80,  y: 380, w: 120, h: 16, oneWay: true },
      { x: 280, y: 340, w: 100, h: 16, oneWay: true },
      { x: 470, y: 380, w: 120, h: 16, oneWay: true },
      { x: 620, y: 310, w: 130, h: 16, oneWay: true },
      { x: 150, y: 270, w: 140, h: 16, oneWay: true },
      { x: 380, y: 250, w: 120, h: 16, oneWay: true },
      { x: 240, y: 180, w: 100, h: 16, oneWay: true },
      { x: 500, y: 190, w: 110, h: 16, oneWay: true },
    ],
    spawnPoints: [
      { x: 30,  y: 420 },
      { x: 770, y: 420 },
      { x: 130, y: 340 },
      { x: 530, y: 340 },
      { x: 440, y: 210 },
    ],
    playerStart: { x: 380, y: 400 },
  },
  // Stage 4 - Goblin Ruins
  {
    id: 4,
    name: 'Goblin Ruins',
    faction: 'goblins',
    bgVariant: 1,
    platforms: [
      { x: 0,   y: 460, w: 300, h: 40, oneWay: false },
      { x: 500, y: 460, w: 300, h: 40, oneWay: false },
      { x: 280, y: 420, w: 240, h: 20, oneWay: false },
      { x: 100, y: 350, w: 140, h: 16, oneWay: true },
      { x: 330, y: 320, w: 140, h: 16, oneWay: true },
      { x: 570, y: 350, w: 130, h: 16, oneWay: true },
      { x: 50,  y: 250, w: 120, h: 16, oneWay: true },
      { x: 350, y: 230, w: 100, h: 16, oneWay: true },
      { x: 620, y: 240, w: 140, h: 16, oneWay: true },
      { x: 220, y: 160, w: 150, h: 16, oneWay: true },
      { x: 460, y: 170, w: 130, h: 16, oneWay: true },
    ],
    spawnPoints: [
      { x: 50,  y: 420 },
      { x: 750, y: 420 },
      { x: 160, y: 310 },
      { x: 620, y: 310 },
      { x: 395, y: 190 },
    ],
    playerStart: { x: 380, y: 380 },
  },
  // Stage 5 - Orc Fortress
  {
    id: 5,
    name: 'Orc Fortress',
    faction: 'orcs',
    bgVariant: 2,
    platforms: [
      { x: 0,   y: 460, w: 800, h: 40, oneWay: false },
      { x: 120, y: 380, w: 160, h: 16, oneWay: true },
      { x: 520, y: 380, w: 160, h: 16, oneWay: true },
      { x: 310, y: 340, w: 180, h: 16, oneWay: true },
      { x: 60,  y: 280, w: 130, h: 16, oneWay: true },
      { x: 610, y: 280, w: 130, h: 16, oneWay: true },
      { x: 280, y: 230, w: 240, h: 16, oneWay: true },
      { x: 150, y: 170, w: 120, h: 16, oneWay: true },
      { x: 530, y: 170, w: 120, h: 16, oneWay: true },
    ],
    spawnPoints: [
      { x: 40,  y: 420 },
      { x: 760, y: 420 },
      { x: 190, y: 340 },
      { x: 590, y: 340 },
      { x: 395, y: 300 },
    ],
    playerStart: { x: 380, y: 400 },
  },
];
