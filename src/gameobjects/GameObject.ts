import { Transform } from "../structs/Transform";
import { GameStartEvent } from "../events/GameStartEvent";
import { GameObjectDestroyEvent } from "../events/GameObjectDestroyEvent";
import { TickEvent } from "../events/TickEvent";
import { DrawEvent } from '../events/DrawEvent';

/** @group Game Objects */
export class GameObject {
    readonly id: string;
    enabled: boolean;
    name: string | undefined;
    tag: string | undefined;
    sortingOrder: number;
    transform: Transform;

    constructor(){
        this.id = crypto.getRandomValues(new Uint32Array(4)).join('-');
        this.enabled = true;
        this.name = undefined;
        this.tag = undefined;
        this.sortingOrder = 0;
        this.transform = new Transform(0, 0, 1, 1, 0);
    }

    /** @virtual */
    OnStart(event: GameStartEvent){}
    /** @virtual */
    OnDestroy(event: GameObjectDestroyEvent){}
    /** @virtual */
    Update(event: TickEvent){}
    /** @virtual */
    OnDraw(event: DrawEvent){}
    /** @virtual */
    FixedUpdate(event: TickEvent){}

}