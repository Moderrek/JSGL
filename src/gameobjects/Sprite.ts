import { ClickableGameObject } from "./ClickableGameObject";

import { DrawEvent } from '../events/DrawEvent';
import { GameObjectSpawnEvent } from "../events/gameobject/GameObjectSpawnEvent";
import { RotationStyle } from "../enums/RotationStyle";

/** 
 * Represents sprite game object
 * @group Game Objects
 */
export class Sprite extends ClickableGameObject{
    
    /**
     * Sprite texture
     */
    texture: HTMLImageElement | undefined;

    /**
     * Sprite rotation style
     */
    rotationStyle: RotationStyle = RotationStyle.allAround;

    /** 
     * Calls `event.game.Update()` at spawn
     * @override
     */
    override OnStart(event: GameObjectSpawnEvent): void {
        event.game.Update();
    }

    /**
     * Calls sprite render on drawing
     * @override
     */
    override OnDraw(event: DrawEvent): void {
        if(this.texture === undefined)
            return;
        if(this.visible){
            event.renderer.drawSprite(this);
        }
    }

}