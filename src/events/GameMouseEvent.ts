import { Vector2 } from "../structs/Vector2"
import { GameEvent } from "./GameEvent";

/** 
 * Invoked at client mouse event
 * @group Game Events 
 */
export interface GameMouseEvent extends GameEvent {
    /**
     * Integer Vector2 mouse position on grid
     */
    mousePos: Vector2;
    /**
     * Decimal Vector2 mouse position on grid (not snapped to integer)
     */
    mousePrecisePos: Vector2;
    /**
     * Integer Vector2 mouse position on canvas pixel
     */
    mouseClientPos: Vector2;
    /**
     * Is primary mouse button down
     */
    isMouseDown: boolean;
}