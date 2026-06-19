import Sprite from '@/gameobjects/Sprite';

import type Game from '@/Game';
import type GameObjectSpawnEvent from '@/events/gameobject/GameObjectSpawnEvent';

/**
 * Represents simple sprite game object with texture from resources
 * 
 * @class
 * @group Game Objects
 * @author Tymon Woźniak
 * 
 * @example
 * const mySprite = new SimpleSprite('my-image');
 * 
 */
export class SimpleSprite extends Sprite {

    private _resourceUid: string;
    private _isTextureLoaded = false;

    public constructor(resourceUid: string) {
        super();

        this._resourceUid = resourceUid;
    }

    public override Start(event: GameObjectSpawnEvent): void {
        this.LoadTexture(event.game, this._resourceUid);

        event.game.Update();
    }

    public LoadTexture(game: Game, resourceUid: string): void {
        this._resourceUid = resourceUid;
        this.texture = game.GetImage(resourceUid) as HTMLImageElement;
        this._isTextureLoaded = this.texture !== undefined;
    }

    public get isTextureLoaded(): boolean {
        return this._isTextureLoaded;
    }
}
