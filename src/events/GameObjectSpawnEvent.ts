import { Game } from '../Game';
import { GameEvent } from './GameEvent';

/** @group Game Events */
export interface GameObjectSpawnEvent extends GameEvent {
    /**
     * Destroyed game object id
     */
    gameObjectId: string;
}