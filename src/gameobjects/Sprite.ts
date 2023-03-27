import { GameObject } from "./GameObject";
import { DrawEvent } from '../events/DrawEvent';
import { GameStartEvent } from "../events/GameStartEvent";
import { GameMouseEvent } from "../events/GameMouseEvent";

/** @group Game Objects */
export class Sprite extends GameObject{
    
    visible: boolean = true;
    texture: HTMLImageElement | undefined;
    showHitbox: boolean = false;

    /** @override */
    override OnStart(event: GameStartEvent): void {
        event.game.Update();
    }

    /** @override */
    override OnDraw(event: DrawEvent): void {
        if(this.visible){
            event.renderer.drawSprite(this);
            if(this.showHitbox)
                event.renderer.drawSpriteHitBox(this);
        }
    }

    /** @virtual */
    OnMouseClick(event: GameMouseEvent): boolean{ return false; /* not handled */ }

}