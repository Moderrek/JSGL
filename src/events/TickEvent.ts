import { GameEvent } from './GameEvent';

/**
 * Invoked at every frame
 * @group Game Events
 */
export interface TickEvent extends GameEvent {
    /**
     * Stores time(in seconds) between the last frame to the current frame.
     */
    deltaTime: number;
    /**
     * Stores unscaled time(in seconds) between the last frame to the current frame.
     */
    unscaledDeltaTime: number;
    /**
     * Stores time(in seconds) from start of game.
     */
    unscaledTime: number;
    /**
     * Time scale
     */
    timeScale: number;
}