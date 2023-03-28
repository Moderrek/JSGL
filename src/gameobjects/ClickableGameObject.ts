import { GameMouseEvent } from "../events/GameMouseEvent";
import { DrawableGameObject } from "./DrawableGameObject";

/** 
 * Represents clickable and drawable game object
 * @group Game Objects
 */
export class ClickableGameObject extends DrawableGameObject {

    /**
     * Is hitbox visible?
     */
    showHitbox: boolean = false;

    /**
     * Invoked at click on Sprite
     * @returns is handled?
     * @virtual
     */
    OnMouseClick(event: GameMouseEvent): boolean{
        return false;
    }
}