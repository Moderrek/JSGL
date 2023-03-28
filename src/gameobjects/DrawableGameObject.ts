import { DrawEvent } from "../events/DrawEvent";
import { GameObject } from "./GameObject";

/** 
 * Represents drawable game object
 * @group Game Objects
 */
export class DrawableGameObject extends GameObject {
    /**
     * Is game object visible?
     */
    visible: boolean = true;

    /** 
     * Invoked at frame when drawing
     * @virtual
     */
    OnDraw(event: DrawEvent){

    }

}