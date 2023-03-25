import { Transform } from "../structs/Transform";
import { OnStartEvent } from "../events/OnStartEvent";
import { OnDestroyEvent } from "../events/OnDestroyEvent";
import { TickEvent } from "../events/TickEvent";
import { DrawEvent } from '../events/DrawEvent';

export class GameObject {
    readonly id: string;
    enabled: boolean;
    name: string;
    tag: string;
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

    OnStart(event: OnStartEvent){}
    OnDestroy(event: OnDestroyEvent){}
    Update(event: TickEvent){}
    OnDraw(event: DrawEvent){}
    FixedUpdate(event: TickEvent){}

}