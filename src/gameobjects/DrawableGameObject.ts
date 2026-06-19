/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import GameObject from '@/gameobjects/GameObject';
import DrawEvent from '@/events/DrawEvent';
import { IsInRange } from '@/utils/math/MathUtils';

/**
 * Drawable game object, which can be drawn on canvas and can interact with other drawables.
 * It is the base class for all game objects which can be drawn on canvas, like {@link Sprite} or {@link Shape}.
 * 
 * @class
 * @group Game Objects
 * @author Tymon Woźniak
 * 
 * @example
 * class MyDrawableGameObject extends DrawableGameObject {
 *     OnDraw(event: DrawEvent) {
 *        event.renderer.drawRectangle(0, 0, 1, 1);
 *     }
 * }
 */
export class DrawableGameObject extends GameObject {
    public static IsTouching(o1: DrawableGameObject, o2: DrawableGameObject): boolean {
        if (o1 === o2) return false;
        if (!o1.visible || !o2.visible) return false;

        return IsInRange(
                o1.transform.position.x,
                o2.transform.position.x,
                o2.transform.position.x + o2.transform.scale.x) &&
            IsInRange(
                o1.transform.position.y,
                o2.transform.position.y,
                o2.transform.position.y + o2.transform.scale.y,
            );
    }

    /**
     * Defines is this game object visible in game.
     * @property
     */
    public visible = true;

    /**
     * Invoked at frame when drawing
     * @method
     * @param event - {@link DrawEvent}
     * @virtual
     * @example
     * OnDraw(event){
     *  event.renderer.drawRectangle(0, 0, 1, 1);
     * }
     */
    public OnDraw(event: DrawEvent) {}

    public isTouching(anotherGameObject: DrawableGameObject): boolean {
        return DrawableGameObject.IsTouching(this, anotherGameObject);
    }
}

export default DrawableGameObject;
