/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import DrawableGameObject from '@/gameobjects/DrawableGameObject';

import type MouseEvent from '@/events/input/MouseEvent';

/**
 * Represents clickable and drawable game object
 * 
 * @class
 * @group Game Objects
 * @author Tymon Woźniak
 * @example
 * class MyClickableGameObject extends ClickableGameObject {
 *     OnMouseClick(event: MouseEvent) {
 *         log('Clicked!');
 *     }
 * }
 */
export class ClickableGameObject extends DrawableGameObject {
    /**
     * Defines is this game object has hitbox visible in game.
     * @property
     */
    public showHitbox = false;
    /**
     * Defines is this game object ignoring mouse events.
     * @property
     */
    public ignoreRaycast = false;

    /**
     * Invoked at click on drawed game object
     * @virtual
     */
    public OnMouseClick(event: MouseEvent) {}
    public OnMouseUp(event: MouseEvent) {}
    public OnMouseDown(event: MouseEvent) {}
    /**
     * Invoked at hover start on drawed game object
     * @returns is handled?
     * @virtual
     */
    public OnMouseHoverStart(event: MouseEvent) {}
    /**
     * Invoked at hover end on drawed game object
     * @returns is handled?
     * @virtual
     */
    public OnMouseHoverEnd(event: MouseEvent) {}
}

export default ClickableGameObject;