import { Vector2 } from "../structs/Vector2"

export type GameMouseEvent = {
    mousePos: Vector2;
    mousePrecisePos: Vector2;
    mouseClientPos: Vector2;
    isMouseDown: boolean;
}