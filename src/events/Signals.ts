import GameEvent from '@/events//GameEvent';
import { Listener, ListenerID } from '@/structs/Listener';

export type SignalChannel = string;

/**
 * Event system for managing game events and listeners.
 * Uses a channel-based pub/sub pattern optimized for performance.
 * @group Game Events
 * @example
 * const signals = new Signals();
 * const listener = signals.on('player:spawn', (event) => console.log('Player spawned!'));
 * signals.emit('player:spawn', new GameEvent('player:spawn'));
 * signals.off(listener); // Remove listener
 */
export class Signals {
    private listeners: Array<Listener>;
    private listenersByChannel: Map<SignalChannel, Listener[]>;
    private listenerCounter: number;

    constructor() {
        this.listeners = [];
        this.listenersByChannel = new Map();
        this.listenerCounter = 0;
    }

    /**
     * Emits an event on a specific channel to all registered listeners.
     * Optimized to only iterate through listeners on that channel.
     * @param channel - Channel name
     * @param event - Event to emit
     * @return Number of listeners that were invoked
     */
    emit(channel: SignalChannel, event: GameEvent): number {
        let counter = 0;
        const channelListeners = this.listenersByChannel.get(channel);
        if (channelListeners) {
            for (const listener of channelListeners) {
                listener.callback(event);
                ++counter;
            }
        }
        return counter;
    }

    /**
     * Registers a listener on a specific channel.
     * Returns the listener ID for later removal.
     * @param channel - Channel name to listen on
     * @param callback - Callback function to execute when event is emitted
     * @returns Listener ID for removal via off()
     */
    on(channel: SignalChannel, callback: (event: GameEvent) => void): ListenerID {
        // Auto-generate a unique listener ID
        const id: ListenerID = this._generateListenerId();

        // Create listener
        const listener: Listener = {
            id,
            channel,
            callback,
        };

        // Store listener globally and by channel for efficient lookup
        this.listeners.push(listener);

        if (!this.listenersByChannel.has(channel)) {
            this.listenersByChannel.set(channel, []);
        }
        this.listenersByChannel.get(channel)!.push(listener);

        return id;
    }

    /**
     * Removes a listener by its ID.
     * @param listenerId - Listener ID returned from on()
     * @returns True if listener was found and removed, false otherwise
     */
    off(listenerId: ListenerID): boolean {
        const index = this.listeners.findIndex((l) => l.id === listenerId);
        if (index === -1) return false;

        const listener = this.listeners[index];
        this.listeners.splice(index, 1);

        const channelListeners = this.listenersByChannel.get(listener.channel);
        if (channelListeners) {
            const channelIndex = channelListeners.findIndex(
                (l) => l.id === listenerId
            );
            if (channelIndex !== -1) {
                channelListeners.splice(channelIndex, 1);
            }
            if (channelListeners.length === 0) {
                this.listenersByChannel.delete(listener.channel);
            }
        }

        return true;
    }

    /**
     * Removes all listeners on a specific channel.
     * @param channel - Channel name
     */
    offChannel(channel: SignalChannel): void {
        const channelListeners = this.listenersByChannel.get(channel);
        if (channelListeners) {
            for (const listener of channelListeners) {
                const index = this.listeners.findIndex(
                    (l) => l.id === listener.id
                );
                if (index !== -1) {
                    this.listeners.splice(index, 1);
                }
            }
            this.listenersByChannel.delete(channel);
        }
    }

    /**
     * Removes all listeners.
     */
    clear(): void {
        this.listeners = [];
        this.listenersByChannel.clear();
    }

    /**
     * Generates a unique listener ID based on an internal counter.
     * @returns Unique listener ID
     */
    private _generateListenerId(): ListenerID {
        return `listener_${this.listenerCounter++}`;
    }
}

export default Signals;
