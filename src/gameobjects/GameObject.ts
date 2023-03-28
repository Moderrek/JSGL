import { Transform } from "../structs/Transform";

import { GameObjectDestroyEvent } from "../events/gameobject/GameObjectDestroyEvent";
import { TickEvent } from "../events/TickEvent";
import { GameObjectSpawnEvent } from "../events/gameobject/GameObjectSpawnEvent";

/**
 * Represents plain GameObject
 * @group Game Objects
 */
export class GameObject {
    /**
     * Unique game object id
     */
    readonly id: string;
    /**
     * Is enabled
     */
    enabled: boolean;
    /**
     * Game object name
     */
    name: string | undefined;
    /**
     * Game object tag
     */
    tag: string | undefined;
    /**
     * Sorting order
     */
    sortingOrder: number;
    /**
     * Transform - position, width, height and rotation of game object
     */
    transform: Transform;

    /**
     * Constructs new GameObject
     */
    constructor(){
        this.id = crypto.getRandomValues(new Uint32Array(4)).join('-');
        this.enabled = true;
        this.name = undefined;
        this.tag = undefined;
        this.sortingOrder = 0;
        this.transform = new Transform(0, 0, 1, 1, 0);
    }

    /**
     * Invoked at game object spawn
     *  @virtual
     */
    OnStart(event: GameObjectSpawnEvent){}
    /** 
     * Invoked at game object destroy
     * @virtual
     */
    OnDestroy(event: GameObjectDestroyEvent){}
    /**
     * Invoked at every frame
     * @virtual
     */
    Update(event: TickEvent){}
    /**
     * Invoked at last update in every frame
     * @virtual
     */
    FixedUpdate(event: TickEvent){}

}