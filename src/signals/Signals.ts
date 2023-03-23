import { GameEvent } from "../events/GameEvent";

export interface Listener {
    channel: string;
    callback: Function;
}

export class Signals {

    listeners: Array<Listener>;

    constructor(){
        this.listeners = [];
    }

    emit(channel: string, event: GameEvent = {}){
        for(const listener of this.listeners){
            if(channel === listener.channel)
                listener.callback(event);
        }
    }
    on(channel: string, callback: Function){
        this.listeners.push({
            channel: channel,
            callback: callback
        });
    }
}