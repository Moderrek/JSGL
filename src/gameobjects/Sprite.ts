import { ClickableGameObject } from './ClickableGameObject';

import { DrawEvent } from '../events/DrawEvent';
import { GameObjectSpawnEvent } from '../events/gameobject/GameObjectSpawnEvent';
import { RotationStyle } from '../enums/RotationStyle';

/**
 * Represents sprite game object
 * @group Game Objects
 */
export class Sprite extends ClickableGameObject{

    /**
     * Sprite texture
     */
    public texture: HTMLImageElement | undefined;

    /**
     * Sprite rotation style
     */
    public rotationStyle: RotationStyle = RotationStyle.allAround;

    /**
     * Calls `event.game.Update()` at spawn
     * @override
     */
    public override Start(event: GameObjectSpawnEvent): void {
        event.game.Update();
    }

    /**
     * Calls sprite render on drawing
     * @override
     */
    public override OnDraw(event: DrawEvent): void {
        if (this.texture === undefined)
            return;
        if (this.visible){
            event.renderer.drawSprite(this);
        }
    }

}