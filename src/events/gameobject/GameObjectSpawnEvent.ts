import GameEvent from '@/events/GameEvent';

/**
 * Invoked at game object spawn
 * @group Game Events
 */
export type GameObjectSpawnEvent = GameEvent & {
    /**
     * Spawned game object id
     */
    gameObjectId: string;
};

export default GameObjectSpawnEvent;

