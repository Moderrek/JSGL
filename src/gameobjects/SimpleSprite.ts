import { GameObjectSpawnEvent } from '../events/gameobject/GameObjectSpawnEvent';
import { Sprite } from './Sprite';
export class SimpleSprite extends Sprite {

    private readonly _imageResourceKey: string;

    constructor(imageResourceKey: string){
        super();
        this._imageResourceKey = imageResourceKey;
    }

    OnStart(event: GameObjectSpawnEvent): void {
        this.texture = event.game.GetImage(this._imageResourceKey) as HTMLImageElement;
        event.game.Update();
    }
}