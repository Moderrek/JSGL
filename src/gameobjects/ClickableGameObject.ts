/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GameMouseEvent } from '../events/GameMouseEvent';
import { DrawableGameObject } from './DrawableGameObject';

/**
 * Represents clickable and drawable game object
 * @group Game Objects
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
    public OnMouseClick(event: GameMouseEvent){}
    public OnMouseUp(event: GameMouseEvent){}
    public OnMouseDown(event: GameMouseEvent){}
    /**
     * Invoked at hover start on drawed game object
     * @returns is handled?
     * @virtual
     */
    public OnMouseHoverStart(event: GameMouseEvent){}
    /**
     * Invoked at hover end on drawed game object
     * @returns is handled?
     * @virtual
     */
    public OnMouseHoverEnd(event: GameMouseEvent){}
}