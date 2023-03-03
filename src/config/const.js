const dev = 1;
export const constGame = {
  time_card_move: 20 * dev,
  time_card_raise: 30 * dev,
  time_card_delay: 20 * dev,
  time_chip_bet: 20 * dev,
  time_chip_reward: 20 * dev,
  time_chip_over: 20 * dev,
  time_community_card: 20 * dev,
  time_community_turn: 10 * dev,
  time_timer_duration: 60 * dev,
  time_chip_reward: 50 * dev,
};

export const gameStates = {
  preLoading: "PRELOADING",
  preWaiting: "WAIT",
  preflop: "PREFLOP",
  active: "ACTIVE",
  bet: "BET",
  wait: "IDLE",
  flop: "FLOP",
  turn: "TURN",
  river: "RIVER",
  final: "FINAL",
  over: "OVER",
  join: "JOIN",
  fold: "FOLD",
};
export const constPositions = {
  table: {
    x: 310,
    y: 250,
    w: 1300,
    h: 680,
  },
  buttons: {
    x: 960,
    y: 977,
    w: 958,
    h: 102,
  },
  button: {
    w: 300,
    h: 80,
  },
  pot: {
    x: 960,
    y: 450,
  },
  community: [
    { x: 760, y: 550, w: 84, h: 118 },
    { x: 860, y: 550, w: 84, h: 118 },
    { x: 960, y: 550, w: 84, h: 118 },
    { x: 1060, y: 550, w: 84, h: 118 },
    { x: 1160, y: 550, w: 84, h: 118 },
  ],
  players: [
    {
      avatar: { x: 800, y: 760, w: 154, h: 152 },
      information: { x: 920, y: 800, w: 185, h: 112 },
      dealer: { x: 850, y: 670, w: 38, h: 33 },
      chip: { x: 960, y: 680, w: 38, h: 33 },
    },
    {
      avatar: { x: 180, y: 560, w: 154, h: 152 },
      information: { x: 300, y: 600, w: 185, h: 112 },
      dealer: { x: 540, y: 650, w: 38, h: 33 },
      chip: { x: 550, y: 600, w: 38, h: 33 },
    },
    {
      avatar: { x: 270, y: 260, w: 154, h: 152 },
      information: { x: 390, y: 300, w: 185, h: 112 },
      dealer: { x: 580, y: 430, w: 38, h: 33 },
      chip: { x: 650, y: 415, w: 38, h: 33 },
    },
    {
      avatar: { x: 800, y: 180, w: 154, h: 152 },
      information: { x: 920, y: 220, w: 185, h: 112 },
      dealer: { x: 860, y: 360, w: 38, h: 33 },
      chip: { x: 970, y: 400, w: 38, h: 33 },
    },
    {
      avatar: { x: 1320, y: 260, w: 154, h: 152 },
      information: { x: 1440, y: 300, w: 185, h: 112 },
      dealer: { x: 1300, y: 430, w: 38, h: 33 },
      chip: { x: 1260, y: 415, w: 38, h: 33 },
    },
    {
      avatar: { x: 1450, y: 560, w: 154, h: 152 },
      information: { x: 1570, y: 600, w: 185, h: 112 },
      dealer: { x: 1340, y: 650, w: 38, h: 33 },
      chip: { x: 1360, y: 600, w: 38, h: 33 },
    },
  ],
};
export const constAnimations = {
  card: {
    idle: "IDLE",
    preflop: "PREFLOP",
    raise: "RAISE",
    hide: "HIDE",
  },
  community: {
    idle: "IDLE",
    show: "SHOW",
    rotate: "ROTATE",
  },
  chip: {
    idle: "IDLE",
    bet: "BET",
    over: "OVER",
    reward: "REWARD",
    beted: "BETED",
  },
};
