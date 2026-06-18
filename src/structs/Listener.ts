import GameEvent from '@/events/GameEvent';

export type ListenerID = string;

/**
 * Represents a listener for game events.
 * Each listener is associated with a specific channel and callback function.
 * Listener ID is auto-generated and can be used to remove the listener later.
 * @group Structs
 * @example
 * const listener: Listener = {
 *     id: 'my-listener',
 *     channel: 'player:move',
 *     callback: (event) => console.log('Player moved!'),
 * };
 */
export type Listener = {
    /** Unique identifier for this listener (auto-generated if not provided) */
    id?: ListenerID;
    /** Channel name to listen for events on */
    channel: string;
    /** Callback function invoked when event is emitted on this channel */
    callback: (event: GameEvent) => void;
};

export default Listener;

