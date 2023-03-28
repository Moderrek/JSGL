import { GameObject } from "./GameObject";
import { DrawEvent } from '../events/DrawEvent';
import { GameStartEvent } from "../events/GameStartEvent";
import { GameMouseEvent } from "../events/GameMouseEvent";

/** @group Game Objects */
export class Sprite extends GameObject{
    
    /**
     * Is sprite visible?
     */
    visible: boolean = true;
    /**
     * Sprite texture
     */
    texture: HTMLImageElement | undefined;
    /**
     * Is sprite hitbox visible?
     */
    showHitbox: boolean = false;

    /** 
     * Calls `event.game.Update()` at spawn
     * @override
     */
    override OnStart(event: GameStartEvent): void {
        event.game.Update();
    }

    /**
     * Calls sprite render on drawing
     * @override
     */
    override OnDraw(event: DrawEvent): void {
        if(this.visible){
            event.renderer.drawSprite(this);
            if(this.showHitbox)
                event.renderer.drawSpriteHitBox(this);
        }
    }

    /**
     * Invoked at click on Sprite
     * @returns is handled?
     * @virtual
     */
    OnMouseClick(event: GameMouseEvent): boolean{ return false; /* not handled */ }

}