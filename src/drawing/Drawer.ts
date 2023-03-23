import { Game } from '../Game';
import { Sprite } from '../gameobjects/Sprite';
import { Vector2 } from '../structs/Vector2';

export class Drawer {
    public handler: Game = undefined;
    public gridSize: number = undefined;
    public canvasParentSize: number = 1;

    resizeCanvas(): void{
        if(!(this.handler.canvas instanceof HTMLCanvasElement))
            throw new Error("Cannot resize undefined canvas!");
        
        const canvas = this.handler.canvas;
        const parent = canvas.parentElement;
        const maxWidth = parent.clientWidth;
        const maxHeight = parent.clientHeight;

        let width = (maxWidth * this.canvasParentSize) / this.handler.grid.x;
        let height = (maxHeight * this.canvasParentSize) / this.handler.grid.y;

        this.gridSize = Math.floor(Math.min(width, height));
        this.canvasWidth = this.handler.grid.x * this.gridSize;
        this.canvasHeight = this.handler.grid.y * this.gridSize;
    }

    public get canvasWidth(): number{
        return this.handler.canvas.width;
    }
    public set canvasWidth(width: number){
        this.handler.canvas.width = width;
    }

    public get canvasHeight(): number{
        return this.handler.canvas.height;
    }
    public set canvasHeight(height: number){
        this.handler.canvas.height = height;
    }

    public get ctx(): CanvasRenderingContext2D{
        return this.handler.canvas.getContext('2d');
    }

    public get canvasSize(): Vector2{
        return new Vector2(this.canvasWidth, this.canvasHeight);
    }

    public scale(x: number): number{
        return x * this.gridSize;
    }

    public drawRectangle(x: number, y: number, width: number, height: number, color: string|CanvasGradient|CanvasPattern = '#000000', angle: number = 0): void{
        const dx = this.scale(x);
        const dy = this.scale(y);
        const dw = this.scale(width);
        const dh = this.scale(height);
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        this.ctx.rotate(angle * Math.PI / 180);
        this.ctx.translate(- dx - dw / 2, - dy - dh / 2);
        this.ctx.fillStyle = color;
        this.ctx.fillRect(dx, dy, dw, dh);
        this.ctx.restore();
    }

    public strokeRectangle(x: number, y: number, width: number, height: number, color: string|CanvasGradient|CanvasPattern = '#000000', angle: number = 0): void{
        const dx = this.scale(x);
        const dy = this.scale(y);
        const dw = this.scale(width);
        const dh = this.scale(height);
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        this.ctx.rotate(angle * Math.PI / 180);
        this.ctx.translate(- dx - dw / 2, - dy - dh / 2);
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(dx, dy, dw, dh);
        this.ctx.restore();
    }

    public drawLine(x1: number, y1: number, x2: number, y2: number, color: string|CanvasGradient|CanvasPattern = '#000000'){
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.scale(x1), this.scale(y1));
        this.ctx.lineTo(this.scale(x2), this.scale(y2));
        this.ctx.stroke();
    }

    public clearFrame(): void{
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    public fillFrame(color: string|CanvasGradient|CanvasPattern = '#000000'): void{
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    public fillImageFrame(image: HTMLCanvasElement): void{
        this.ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
    }

    public drawImage(image: HTMLImageElement, x: number, y: number, width: number, height: number, angle: number = 0): void{
        const dx = this.scale(x);
        const dy = this.scale(y);
        const dw = this.scale(width);
        const dh = this.scale(height);
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        this.ctx.rotate(angle * Math.PI / 180);
        this.ctx.translate(- dx - dw / 2, - dy - dh / 2);
        this.ctx.drawImage(image, dx, dy, dw, dh);
        this.ctx.restore();
    }

    public drawSprite(sprite: Sprite): void{
        this.drawImage(
            sprite.texture,
            sprite.transform.position.x,
            sprite.transform.position.y,
            sprite.transform.scale.x,
            sprite.transform.scale.y,
            sprite.transform.rotation
        );
    }

    public drawSpriteHitbox(sprite: Sprite): void{
        this.strokeRectangle(
            sprite.transform.position.x,
            sprite.transform.position.y,
            sprite.transform.scale.x,
            sprite.transform.scale.y,
            'red',
            0
        );
        this.drawLine(
            sprite.transform.position.x,
            sprite.transform.position.y,
            sprite.transform.position.x + sprite.transform.scale.x,
            sprite.transform.position.y + sprite.transform.scale.y,
            'red',
        );
        this.drawLine(
            sprite.transform.position.x + sprite.transform.scale.x,
            sprite.transform.position.y,
            sprite.transform.position.x,
            sprite.transform.position.y + sprite.transform.scale.y,
            'red',
        );
    }

}