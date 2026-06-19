import ClickableGameObject from '@/gameobjects/ClickableGameObject';
import RotationStyle from '@/enums/RotationStyle';

import type DrawEvent from '@/events/DrawEvent';
import type GameObjectSpawnEvent from '@/events/gameobject/GameObjectSpawnEvent';

/**
 * Represents sprite game object
 * 
 * @class
 * @group Game Objects
 * @author Tymon Woźniak
 * 
 */
export class Sprite extends ClickableGameObject {
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
        if (this.texture === undefined) return;
        if (this.visible) {
            event.renderer.drawSprite(this);
        }
    }
}

export default Sprite;