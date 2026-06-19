/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Transform from '@/structs/Transform';

import { TickEvent, GameObjectSpawnEvent, GameObjectDestroyEvent } from '@/events';

export type GameObjectId = string;

export function generateId(): GameObjectId {
    return crypto.getRandomValues(new Uint32Array(4)).join('-');
}

/**
 * Represents plain GameObject
 * Which can be extended to create more complex game objects, like {@link Sprite} or {@link Shape}.
 * It is the base class for all game objects in JSGL, and it is not drawable by itself,
 * but it can be extended to create drawable game objects, like {@link DrawableGameObject}.
 * 
 * @class
 * @group Game Objects
 * @author Tymon Woźniak
 * 
 * @example
 * class MyGameObject extends GameObject {
 *     Start(event: GameObjectSpawnEvent) {
 *         log('I have been spawned!');
 *     }
 * }
 */
export class GameObject {
    /**
     * The unique id of this game object.
     * @property
     */
    public readonly id: GameObjectId;
    /**
     * Defines is this game object enabled in game.
     * @property
     */
    public enabled: boolean;
    /**
     * The name of this game object.
     * @property
     */
    public name: string | undefined;
    /**
     * The tag of this game object.
     * @property
     */
    public tag: string | undefined;
    /**
     * The order in game objects hierarchy.
     * @property
     */
    public sortingOrder: number;
    /**
     * The Transform - position, width, height and rotation of this game object.
     * @property
     */
    public transform: Transform;

    /**
     * Constructs new GameObject.
     * @constructor
     */
    public constructor() {
        this.id = generateId();
        this.enabled = true;
        this.name = undefined;
        this.tag = undefined;
        this.sortingOrder = 0;
        this.transform = new Transform(0, 0, 1, 1, 0);
    }

    /**
     * Invoked at game object spawn.
     * @method
     * @param event - {@link GameObjectSpawnEvent}
     * @virtual
     * @example
     * Start(event){
     *  console.log('I have been spawned!');
     * }
     */
    public Start(event: GameObjectSpawnEvent) {}

    /**
     * Invoked at game object destroy.
     * @method
     * @param event - {@link GameObjectDestroyEvent}
     * @virtual
     * @example
     * Destroy(event){
     *  console.log('I have been destroyed!');
     * }
     */
    public Destroy(event: GameObjectDestroyEvent) {}

    /**
     * Invoked at every frame.
     * @method
     * @param event - {@link TickEvent}
     * @virtual
     * @example
     * Update(event){
     *  this.transform.translate(new JSGL.Vector2(1, 0).multiply(event.deltaTime));
     * }
     */
    public Update(event: TickEvent) {}

    /**
     * Invoked at last update in every frame.
     * @method
     * @param event - {@link TickEvent}
     * @virtual
     * @example
     * FixedUpdate(event){
     *  this.transform.translate(new JSGL.Vector2(1, 0).multiply(event.deltaTime));
     * }
     */
    public FixedUpdate(event: TickEvent) {}
}

export default GameObject;
