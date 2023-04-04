export * from './structs/Vector2';
export * from './structs/Transform';
export * from './structs/Rotation';
export * from './structs/Resource';
export * from './structs/GameSettings';

export * from './enums/ShapeType';
export * from './enums/RotationStyle';

export * from './events/Signals';

export * from './gameobjects/GameObject';
export * from './gameobjects/DrawableGameObject';
export * from './gameobjects/ClickableGameObject';
export * from './gameobjects/Shape';
export * from './gameobjects/SimpleShape';
export * from './gameobjects/Sprite';
export * from './gameobjects/SimpleSprite';

export * from './example/ExampleHTML';
export * from './example/DefaultGame';

export * from './utils/math/MathUtils';

export * from './events/GameEvent';
export * from './events/DrawEvent';
export * from './events/GameMouseEvent';
export * from './events/gameobject/GameObjectSpawnEvent';
export * from './events/gameobject/GameObjectDestroyEvent';
export * from './events/GameStartEvent';
export * from './events/TickEvent';

export * from './structs/DrawSettings';
export * from './drawing/Renderer';
export * from './structs/Shadow';

export * from './Game';

function dateForLog(): string {
  const date = new Date();
  return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(message: any) {
  console.log(`[${dateForLog()}] [LOG]:`, message);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function warn(message: any) {
  console.warn(`[${dateForLog()}] [WARN]:`, message);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function error(message: any) {
  console.error(`[${dateForLog()}] [ERR]:`, message);
}

export const license = 'MIT';
export const author = 'Tymon "MODERR" Woźniak';
