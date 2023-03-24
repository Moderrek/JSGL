import { Game } from '../Game';
import { Sprite } from '../gameobjects/Sprite';
import { Vector2 } from '../structs/Vector2';

export interface DrawSettings {
    color?: string|CanvasGradient|CanvasPattern;
    borderColor?: string|CanvasGradient|CanvasPattern;
    angle?: number;
}

const defaultDrawSettings: DrawSettings = {
    color: '#000000',
    borderColor: '#000000',
    angle: 0
};

export class Drawer {
    handler: Game = undefined;
    gridSize: number = undefined;
    canvasParentSize: number = 1;

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

    get canvasHeight(): number{
        return this.handler.canvas.height;
    }
    set canvasHeight(height: number){
        this.handler.canvas.height = height;
    }

    get ctx(): CanvasRenderingContext2D{
        return this.handler.canvas.getContext('2d');
    }

    get canvasSize(): Vector2{
        return new Vector2(this.canvasWidth, this.canvasHeight);
    }

    scale(x: number): number{
        return x * this.gridSize;
    }

    radians(degress: number): number{
        degress %= 360;
        return degress * Math.PI / 180;
    }

    degress(radians: number): number{
        return radians / Math.PI * 180;
    }

    combineDrawSettings(drawSettings: DrawSettings): DrawSettings{
        return { ...defaultDrawSettings, ...drawSettings };
    }

    setupDraw(drawSettings: DrawSettings){
        this.ctx.fillStyle = drawSettings.color;
        this.ctx.strokeStyle = drawSettings.borderColor;
    }

    drawRectangle(x: number, y: number, width: number, height: number, drawSettings: DrawSettings = undefined){
        drawSettings = this.combineDrawSettings(drawSettings);
        const dx = this.scale(x);
        const dy = this.scale(y);
        const dw = this.scale(width);
        const dh = this.scale(height);
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        this.ctx.rotate(this.radians(drawSettings.angle));
        this.ctx.translate(- dx - dw / 2, - dy - dh / 2);
        this.setupDraw(drawSettings);
        this.ctx.fillRect(dx, dy, dw, dh);
        this.ctx.restore();
    }

    strokeRectangle(x: number, y: number, width: number, height: number, drawSettings: DrawSettings = undefined){
        drawSettings = this.combineDrawSettings(drawSettings);
        const dx = this.scale(x);
        const dy = this.scale(y);
        const dw = this.scale(width);
        const dh = this.scale(height);
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        this.ctx.rotate(this.radians(drawSettings.angle));
        this.ctx.translate(- dx - dw / 2, - dy - dh / 2);
        this.setupDraw(drawSettings);
        this.ctx.strokeRect(dx, dy, dw, dh);
        this.ctx.restore();
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, drawSettings: DrawSettings = undefined){
        drawSettings = this.combineDrawSettings(drawSettings);
        this.ctx.lineWidth = this.gridSize/64;
        this.setupDraw(drawSettings);
        this.ctx.beginPath();
        this.ctx.moveTo(this.scale(x1), this.scale(y1));
        this.ctx.lineTo(this.scale(x2), this.scale(y2));
        this.ctx.stroke();
    }

    drawArrow(x1: number, y1: number, x2: number, y2: number, size: number, drawSettings: DrawSettings = undefined) {
        drawSettings = this.combineDrawSettings(drawSettings);
        // Scaling
        size *= this.gridSize / 16;
        this.ctx.lineWidth = size * this.gridSize / 512;
        this.setupDraw(drawSettings);
        const p1 = new Vector2(x1 * this.gridSize, y1 * this.gridSize);
        const p2 = new Vector2(x2 * this.gridSize, y2 * this.gridSize);
        // Angle
        var angle = Math.atan2((p2.y - p1.y) , (p2.x - p1.x));
        var hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
        // Rotate
        this.ctx.save();
        this.ctx.translate(p1.x, p1.y);
        this.ctx.rotate(angle);
        // Line
        this.ctx.beginPath();	
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(hyp - size, 0);
        this.ctx.stroke();
        // Triangle
        this.ctx.beginPath();
        this.ctx.lineTo(hyp - size, size);
        this.ctx.lineTo(hyp, 0);
        this.ctx.lineTo(hyp - size, -size);
        this.ctx.fill();

        this.ctx.restore();
      }

    clearFrame(){
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    fillFrame(drawSettings: DrawSettings = undefined){
        drawSettings = this.combineDrawSettings(drawSettings);
        this.setupDraw(drawSettings);
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    fillImageFrame(image: HTMLCanvasElement){
        this.ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
    }

    drawImage(image: HTMLImageElement, x: number, y: number, width: number, height: number, drawSettings: DrawSettings = undefined){
        drawSettings = this.combineDrawSettings(drawSettings);
        const dx = this.scale(x);
        const dy = this.scale(y);
        const dw = this.scale(width);
        const dh = this.scale(height);
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        this.ctx.rotate(this.radians(drawSettings.angle));
        this.ctx.translate(- dx - dw / 2, - dy - dh / 2);
        this.ctx.drawImage(image, dx, dy, dw, dh);
        this.ctx.restore();
    }

    drawSprite(sprite: Sprite){
        this.drawImage(
            sprite.texture,
            sprite.transform.position.x,
            sprite.transform.position.y,
            sprite.transform.scale.x,
            sprite.transform.scale.y,
            { angle: sprite.transform.rotation }
        );
    }

    drawSpriteHitbox(sprite: Sprite){
        const pos = sprite.transform.position;
        const center = sprite.transform.positionCenter;
        const scale = sprite.transform.scale;
        this.strokeRectangle(
            pos.x,
            pos.y,
            scale.x,
            scale.y,
            { borderColor: 'red' }
        );
        this.drawLine(
            pos.x,
            pos.y,
            pos.x + scale.x,
            pos.y + scale.y,
            { borderColor: 'red' }
        );
        this.drawLine(
            pos.x + scale.x,
            pos.y,
            pos.x,
            pos.y + scale.y,
            { borderColor: 'red' }
        );
        const angle = sprite.transform.getRadians();
        this.drawArrow(
            center.x,
            center.y,
            center.x + ((scale.x / 2 ) * Math.cos(angle)),
            center.y + ((scale.y / 2 ) * Math.sin(angle)),
            1,
            { color: 'red', borderColor: 'red' }
        )
    }

}