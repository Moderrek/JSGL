import { GameEvent } from './GameEvent';
import { Listener } from '../structs/Listener';

/**
 * @group Game Events
 */
export class Signals {
  listeners: Array<Listener>;

  constructor() {
    this.listeners = [];
  }

  emit(channel: string, event: GameEvent) {
    for (const listener of this.listeners) {
      if (channel === listener.channel) listener.callback(event);
    }
  }
  on(channel: string, callback: (event: GameEvent) => void) {
    this.listeners.push({
      channel: channel,
      callback: callback,
    });
  }
}
