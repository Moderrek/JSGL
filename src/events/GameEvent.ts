import { Game } from '@/Game';

/**
 * @group Game Events
 * The base event type for all game events.
 */
export type GameEvent = {
    /**
     * Event owner reference
     */
    game: Game;
};

export default GameEvent;
