import { GameEvent } from '../events/GameEvent';

export type Listener = {
    channel: string;
    callback: (event: GameEvent) => void;
}