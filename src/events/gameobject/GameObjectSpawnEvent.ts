import { GameEvent } from '../GameEvent';

/**
 * Invoked at game object spawn
 * @group Game Events
 */
export type GameObjectSpawnEvent = GameEvent & {
  /**
   * Destroyed game object id
   */
  gameObjectId: string;
};
