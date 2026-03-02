export const COLOR = "rgba(0,100,255,1)";

export const UNIT_STATS = {
  RECTANGLE: {
    color: COLOR,
    speed: 0.004,
    hp: 100,
    mass: 20,
    attack: 2,
    defense: 10,
    size: 40,
    price: 150,
    sides: 4,
  },
  CIRCLE: {
    color: COLOR,
    speed: 0.008,
    hp: 100,
    mass: 2,
    attack: 10,
    defense: 5,
    size: 40,
    price: 100,
    sides: 0,
  },
  TRIANGLE: {
    color: COLOR,
    speed: 0.012,
    mass: 0.5,
    hp: 60,
    attack: 25,
    defense: 2,
    size: 40,
    price: 120,
    sides: 3,
  },
  PENTAGON: {
    color: COLOR,
    speed: 0.01,
    mass: 2,
    hp: 120,
    attack: 18,
    defense: 8,
    size: 40,
    price: 130,
    sides: 5,
  },
};

export const UNIT_PROPERTIES = {
  hpYellow: 0.6,
  hpRed: 0.3,
};
export const PHYSICS = {
  friction: 0.5,
  impulseToTarget: 30,
  speedMultiplier: 500,
  predictionFactor: 10,
};
