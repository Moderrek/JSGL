import GameEvent from '@/events/GameEvent';

/**
 * Invoked at every frame.
 * @group Game Events
 */
export type TickEvent = GameEvent & {
    /**
     * Stores time (in seconds) between the last frame to the current frame.
     */
    deltaTime: number;
    /**
     * Stores unscaled time (in seconds) between the last frame to the current frame.
     */
    unscaledDeltaTime: number;
    /**
     * Stores time (in seconds) from start of game.
     */
    unscaledTime: number;
    /**
     * Time scale factor of the game. Affects deltaTime.
     */
    timeScale: number;
};

export default TickEvent;
