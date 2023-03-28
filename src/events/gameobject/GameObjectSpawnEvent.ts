import { GameEvent } from '../GameEvent';

/** 
 * Invoked at game object spawn
 * @group Game Events 
 */
export interface GameObjectSpawnEvent extends GameEvent {
    /**
     * Destroyed game object id
     */
    gameObjectId: string;
}