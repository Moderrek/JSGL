import GameEvent from '@/events/GameEvent';

import type Input from '@/Input';

/**
 * Event emitted when a key event occurs in the game.
 * Contains a reference to the game instance and the input details.
 * 
 * @group Game Events
 * 
 */
export type KeyEvent = GameEvent & {
    /**
     * Input reference for key event details
     */
    input: Input;
};

export default KeyEvent;
