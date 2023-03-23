import { Transform } from "../structs/Transform";
import { Game } from '../Game';
import { Drawer } from "../drawing/Drawer";

export class GameObject {
    public readonly id: string;
    public enabled: boolean;
    public name: string;
    public tag: string;
    public sortingOrder: number;
    public transform: Transform;

    constructor(){
        this.id = crypto.getRandomValues(new Uint32Array(4)).join('-');
        this.enabled = true;
        this.name = undefined;
        this.tag = undefined;
        this.sortingOrder = 0;
        this.transform = new Transform(0, 0, 1, 1, 0);
    }

    public OnStart(game: Game): void{}
    public OnDestroy(game: Game): void{}
    public Update(deltaTime: number, game: Game): void{}
    public OnDraw(renderer: Drawer, game: Game): void{}
    public FixedUpdate(deltaTime: number, game: Game): void{}

}