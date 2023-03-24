import { Drawer } from "../drawing/Drawer";
import { Game } from "../Game";
import { GameObject } from "./GameObject";
import { Vector2 } from "../structs/Vector2";

// const allowTextureTypes = [CSSImageValue, HTMLCanvasElement, HTMLImageElement, HTMLVideoElement, ImageBitmap, OffscreenCanvas, SVGImageElement, VideoFrame];

export class Sprite extends GameObject{
    
    public visible: boolean = true;
    public texture: HTMLImageElement = undefined;
    public showHitbox: boolean = false;

    public override OnStart(game: Game): void {
        game.Update();
    }

    public override OnDraw(renderer: Drawer, game: Game): void {
        if(this.visible){
            renderer.drawSprite(this);
            if(this.showHitbox)
                renderer.drawSpriteHitbox(this);
        }
    }

    public OnMouseClick(game: Game): boolean{ return false; /* not handled */ }

}