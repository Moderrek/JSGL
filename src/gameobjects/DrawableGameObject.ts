import { DrawEvent } from "../events/DrawEvent";
import { GameObject } from "./GameObject";

/** 
 * Represents drawable game object
 * @group Game Objects
 */
export class DrawableGameObject extends GameObject {
    
    /**
     * Defines is this game object visible in game.
     * @property
     */
    public visible: boolean = true;

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
    public OnDraw(event: DrawEvent){}

}