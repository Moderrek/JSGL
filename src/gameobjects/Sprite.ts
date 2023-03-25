import { GameObject } from "./GameObject";
import { DrawEvent } from '../events/DrawEvent';
import { OnStartEvent } from "../events/OnStartEvent";
import { GameMouseEvent } from "../events/GameMouseEvent";

export class Sprite extends GameObject{
    
    visible: boolean = true;
    texture: HTMLImageElement = undefined;
    showHitbox: boolean = false;

    override OnStart(event: OnStartEvent): void {
        event.game.Update();
    }

    override OnDraw(event: DrawEvent): void {
        if(this.visible){
            event.renderer.drawSprite(this);
            if(this.showHitbox)
                event.renderer.drawSpriteHitBox(this);
        }
    }

    OnMouseClick(event: GameMouseEvent): boolean{ return false; /* not handled */ }

}