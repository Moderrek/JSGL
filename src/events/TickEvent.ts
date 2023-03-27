import { Game } from "../Game";
import { GameEvent } from './GameEvent';

/** @group Game Events */
export interface TickEvent extends GameEvent {
    /**
     * Stores time(in seconds) between the last frame to the current frame.
     */
    deltaTime: number;
}