import { GameObjectSpawnEvent } from '../events/gameobject/GameObjectSpawnEvent';
import { Sprite } from './Sprite';

/**
 * @group Game Objects
 */
export class SimpleSprite extends Sprite {

    private readonly _imageResourceKey: string;

    public constructor(imageResourceKey: string){
        super();
        this._imageResourceKey = imageResourceKey;
    }

    public override Start(event: GameObjectSpawnEvent): void {
        this.texture = event.game.GetImage(this._imageResourceKey) as HTMLImageElement;
        event.game.Update();
    }
}