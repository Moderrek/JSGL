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

export * from './Input';
export * from './Game';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function msg(type: string, message: any) {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milis = date.getMilliseconds().toString().padStart(3, '0');
  console.log(`[${hours}:${minutes}:${seconds}:${milis}] [${type}]:`, message);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(message: any) {
  msg('LOG', message);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function warn(message: any) {
  msg('WARN', message);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function error(message: any) {
  msg('ERR', message);
}

export const license = 'MIT';
export const author = 'Tymon "MODERR" Woźniak';
