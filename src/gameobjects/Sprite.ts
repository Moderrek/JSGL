import { Drawer } from "../drawing/Drawer";
import { Game } from "../Game";
import { GameObject } from "./GameObject";
import { Vector2 } from "../structs/Vector2";
import { DrawEvent } from '../events/DrawEvent';
import { OnStartEvent } from "../events/OnStartEvent";

// const allowTextureTypes = [CSSImageValue, HTMLCanvasElement, HTMLImageElement, HTMLVideoElement, ImageBitmap, OffscreenCanvas, SVGImageElement, VideoFrame];

export class Sprite extends GameObject{
    
    public visible: boolean = true;
    public texture: HTMLImageElement = undefined;
    public showHitbox: boolean = false;

    public override OnStart(event: OnStartEvent): void {
        event.game.Update();
    }

    public override OnDraw(event: DrawEvent): void {
        if(this.visible){
            event.renderer.drawSprite(this);
            if(this.showHitbox)
                event.renderer.drawSpriteHitbox(this);
        }
    }

    public OnMouseClick(game: Game): boolean{ return false; /* not handled */ }

}