import { describe, expect, it, vi } from 'vitest';

import Signals from '@/events/Signals';

import type Game from '@/Game';
import type GameEvent from '@/events/GameEvent';

const createEvent = (): GameEvent => ({
    game: {} as Game,
});

describe('Signals', () => {
    it('emits events to listeners on the same channel', () => {
        const signals = new Signals();
        const event = createEvent();
        const callback = vi.fn();

        signals.on('player:spawn', callback);

        const count = signals.emit('player:spawn', event);

        expect(count).toBe(1);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(event);
    });

    it('removes a listener by id', () => {
        const signals = new Signals();
        const callback = vi.fn();

        const listenerId = signals.on('player:spawn', callback);

        expect(signals.off(listenerId)).toBe(true);
        expect(signals.emit('player:spawn', createEvent())).toBe(0);
        expect(callback).not.toHaveBeenCalled();
    });

    it('removes all listeners from a channel', () => {
        const signals = new Signals();
        const spawnCallback = vi.fn();
        const moveCallback = vi.fn();

        signals.on('player:spawn', spawnCallback);
        signals.on('player:move', moveCallback);

        signals.offChannel('player:spawn');

        expect(signals.emit('player:spawn', createEvent())).toBe(0);
        expect(signals.emit('player:move', createEvent())).toBe(1);
        expect(spawnCallback).not.toHaveBeenCalled();
        expect(moveCallback).toHaveBeenCalledTimes(1);
    });

    it('clears all listeners', () => {
        const signals = new Signals();

        signals.on('player:spawn', vi.fn());
        signals.on('player:move', vi.fn());

        signals.clear();

        expect(signals.emit('player:spawn', createEvent())).toBe(0);
        expect(signals.emit('player:move', createEvent())).toBe(0);
    });

    it('removing non-existent listener', () => {
        const signals = new Signals();

        expect(signals.off('non-existent-id')).toBe(false);
    });

});