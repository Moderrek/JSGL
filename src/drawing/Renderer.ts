import { Game } from '../Game';
import { Sprite } from '../gameobjects/Sprite';
import { Vector2 } from '../structs/Vector2';
import { DrawSettings, defaultDrawSettings } from './DrawSettings';
import { ClickableGameObject } from '../gameobjects/ClickableGameObject';
import { Clamp01 } from '../utils/math/MathUtils';
import { RotationStyle } from '../enums/RotationStyle';

/**
 * Class represents Game Renderer.
 */
export class Renderer {
    /**
     * Renderer owner.
     */
    private readonly handler: Game;
    /**
     * How many pixels have one grid unit.
     */
    gridSize: number = 0;
    /**
     * The decimal midpoint of parent element size.
     */
    canvasParentSize: number = 1;

    /**
     * Constructs new Renderer.
     * @param handler The {@link Game} reference
     */
    constructor(handler: Game){
        this.handler = handler;
    }

    /**
     * Resize canvas to parent element size by canvasParentSize (decimal midpoint).
     */
    resizeCanvas(){
        if(!(this.handler.canvas instanceof HTMLCanvasElement))
            throw new Error("Cannot resize undefined canvas!");
        
        const canvas = this.handler.canvas;
        const parent = canvas.parentElement;
        if(parent == null)
            throw new Error("Parent cannot be null!");
        const maxWidth = parent.clientWidth;
        const maxHeight = parent.clientHeight;

        const width = (maxWidth * this.canvasParentSize) / this.handler.grid.x;
        const height = (maxHeight * this.canvasParentSize) / this.handler.grid.y;

        this.gridSize = Math.floor(Math.min(width, height));
        this.canvasWidth = this.handler.grid.x * this.gridSize;
        this.canvasHeight = this.handler.grid.y * this.gridSize;
    }

    /**
     * Gets canvas width in pixels.
     */
    get canvasWidth(): number{
        return this.handler.canvas.width;
    }
    /**
     * Sets canvas width in pixels.
     * @param width The new width
     */
    set canvasWidth(width: number){
        this.handler.canvas.width = width;
    }

    /**
     * Gets canvas height in pixels.
     */
    get canvasHeight(): number{
        return this.handler.canvas.height;
    }
    /**
     * Sets canvas height in pixels.
     * @param height The new height
     */
    set canvasHeight(height: number){
        this.handler.canvas.height = height;
    }

    /**
     * Gets the {@link CanvasRenderingContext2D}.
     */
    get ctx(): CanvasRenderingContext2D{
        const context = this.handler.canvas.getContext('2d');
        if(context == null)
            throw new Error("There was a problem during getting the context");
        return context;
    }

    /**
     * Gets the Vector2 of width and height in pixels.
     */
    get canvasSize(): Vector2{
        return new Vector2(this.canvasWidth, this.canvasHeight);
    }

    /**
     * Scales number from client coordinate to grid coordinate.
     * @param x The client coordinate
     * @returns The scaled number
     */
    scale(x: number): number{
        return x * this.gridSize;
    }

    /**
     * Converts degrees to radians.
     * @param degrees The degrees
     * @returns The radians
     */
    private radians(degrees: number): number{
        degrees %= 360;
        return degrees * Math.PI / 180;
    }

    /**
     * Converts radians to degrees.
     * @param radians The radians
     * @returns The degrees
     */
    private degrees(radians: number): number{
        return radians / Math.PI * 180;
    }

    /**
     * Combines given draw settings with default draw settings.
     * @param drawSettings The given draw settings 
     * @returns The combined draw settings
     */
    private combineDrawSettings(drawSettings: DrawSettings | undefined): DrawSettings{
        return { ...defaultDrawSettings, ...drawSettings };
    }

    /**
     * Sets canvas context properties to given settings.
     * @param drawSettings The draw settings
     */
    private setContextSettings(drawSettings: DrawSettings){
        if(drawSettings.color !== undefined)
            this.ctx.fillStyle = drawSettings.color;
        if(drawSettings.borderColor !== undefined)
            this.ctx.strokeStyle = drawSettings.borderColor;
        if(drawSettings.borderSize !== undefined)
            this.ctx.lineWidth = this.scale(drawSettings.borderSize/64);
        if(drawSettings.alpha !== undefined)
            this.ctx.globalAlpha = Clamp01(drawSettings.alpha);
        if(drawSettings.shadow?.color !== undefined)
            this.ctx.shadowColor = drawSettings.shadow.color;
        if(drawSettings.shadow?.offsetX !== undefined)
            this.ctx.shadowOffsetX = this.scale(drawSettings.shadow.offsetX);
        if(drawSettings.shadow?.offsetY !== undefined)
            this.ctx.shadowOffsetY = this.scale(drawSettings.shadow.offsetY);
        if(drawSettings.shadow?.blur !== undefined)
            this.ctx.shadowBlur = this.scale(drawSettings.shadow.blur);
    }

    /**
     * Draws a rect.
     * @param x The X-coordinate
     * @param y The Y-coordinate
     * @param width The width
     * @param height The height
     * @param drawSettings The draw settings
     */
    drawRectangle(x: number, y: number, width: number, height: number, drawSettings?: DrawSettings){
        drawSettings = this.combineDrawSettings(drawSettings);
        const dx = this.scale(x);
        const dy = this.scale(y);
        const dw = this.scale(width);
        const dh = this.scale(height);
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        if(drawSettings.angle !== undefined){
            if(drawSettings.rotationStyle === RotationStyle.allAround){
                this.ctx.rotate(this.radians(drawSettings.angle));
            }
        }
        this.ctx.translate(- dx - dw / 2, - dy - dh / 2);
        this.setContextSettings(drawSettings);
        //
        if(drawSettings.fill)
            this.ctx.fillRect(dx, dy, dw, dh);
        if(drawSettings.border)
            this.ctx.strokeRect(dx, dy, dw, dh);
        //
        this.ctx.restore();
    }

    /**
     * Draws a circle.
     * @param x The X-coordinate
     * @param y The Y-coordinate
     * @param diameter The diameter
     * @param drawSettings The draw settings
     */
    drawCircle(x: number, y: number, diameter: number, drawSettings?: DrawSettings){
        drawSettings = this.combineDrawSettings(drawSettings);
        const dx = this.scale(x);
        const dy = this.scale(y);
        const dr = this.scale(diameter / 2);
        this.setContextSettings(drawSettings);
        //
        this.ctx.beginPath();
        this.ctx.arc(dx + dr, dy + dr, dr, 0, 2 * Math.PI);
        this.ctx.closePath();
        if(drawSettings.fill)
            this.ctx.fill();
        if(drawSettings.border)
            this.ctx.stroke();
    }

    /**
     * Draws line from position to another position.
     * @param x1 From X-coordinate
     * @param y1 From Y-coordinate
     * @param x2 To X-coordinate
     * @param y2 To Y-coordinate
     * @param drawSettings The draw settings
     */
    drawLine(x1: number, y1: number, x2: number, y2: number, drawSettings?: DrawSettings){
        drawSettings = this.combineDrawSettings(drawSettings);
        this.setContextSettings(drawSettings);
        this.ctx.beginPath();
        this.ctx.moveTo(this.scale(x1), this.scale(y1));
        this.ctx.lineTo(this.scale(x2), this.scale(y2));
        this.ctx.closePath();
        this.ctx.stroke();
    }

    /**
     * Draws arrow from position to another position.
     * @param x1 From X-coordinate
     * @param y1 From Y-coordinate
     * @param x2 To X-coordinate
     * @param y2 To Y-coordinate
     * @param drawSettings The draw settings
     */
    drawArrow(x1: number, y1: number, x2: number, y2: number, drawSettings?: DrawSettings) {
        drawSettings = this.combineDrawSettings(drawSettings);
        // Scaling
        const size = this.gridSize / 16;
        this.ctx.lineWidth = this.gridSize / 64;
        this.setContextSettings(drawSettings);
        const p1 = new Vector2(x1 * this.gridSize, y1 * this.gridSize);
        const p2 = new Vector2(x2 * this.gridSize, y2 * this.gridSize);
        // Angle
        const angle = Math.atan2((p2.y - p1.y) , (p2.x - p1.x));
        const hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
        // Rotate
        this.ctx.save();
        this.ctx.translate(p1.x, p1.y);
        this.ctx.rotate(angle);
        // Line
        this.ctx.beginPath();	
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(hyp - size, 0);
        this.ctx.closePath();
        this.ctx.stroke();
        // Triangle
        this.ctx.beginPath();
        this.ctx.lineTo(hyp - size, size);
        this.ctx.lineTo(hyp, 0);
        this.ctx.lineTo(hyp - size, -size);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
      }

    /**
     * Clears the canvas.
     */
    clearFrame(){
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    /**
     * Fills the canvas with color property from settings.
     * @param drawSettings The settings
     */
    fillFrame(drawSettings: DrawSettings){
        drawSettings = this.combineDrawSettings(drawSettings);
        this.setContextSettings(drawSettings);
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    /**
     * Fills canvas with image.
     * @param image The image
     */
    fillImageFrame(image: HTMLCanvasElement){
        this.ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
    }

    /**
     * Draws image.
     * @param image The image 
     * @param x The X-coordinate
     * @param y The Y-coordinate
     * @param width The width
     * @param height The height
     * @param drawSettings The draw settings
     */
    drawImage(image: HTMLImageElement, x: number, y: number, width: number, height: number, drawSettings?: DrawSettings){
        drawSettings = this.combineDrawSettings(drawSettings);
        const dx = this.scale(x);
        const dy = this.scale(y);
        const dw = this.scale(width);
        const dh = this.scale(height);
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        if(drawSettings.angle !== undefined){
            if(drawSettings.rotationStyle === RotationStyle.allAround){
                this.ctx.rotate(this.radians(drawSettings.angle));
            }
        }
        this.ctx.translate(- dx - dw / 2, - dy - dh / 2);
        this.ctx.drawImage(image, dx, dy, dw, dh);
        this.ctx.restore();
    }

    /**
     * Draws sprite texture.
     * @param sprite The sprite
     * @returns is success?
     */
    drawSprite(sprite: Sprite): boolean{
        if(sprite.texture === undefined || sprite.texture === null){
            console.warn("The Sprite ", sprite, " has not assigned texture!");
            return false;
        }
        if(!(sprite.texture instanceof HTMLImageElement)){
            console.warn(`Texture ${sprite.name}[${sprite.id}] cannot be ${typeof sprite.texture}!`);
            return false;
        }
        this.drawImage(
            sprite.texture,
            sprite.transform.position.x,
            sprite.transform.position.y,
            sprite.transform.scale.x,
            sprite.transform.scale.y,
            { angle: sprite.transform.rotation, rotationStyle: sprite.rotationStyle }
        );
        return true;
    }

    /**
     * Draws hitbox with direction arrow.
     * @param clickableObject The clickable game object
     */
    drawHitbox(clickableObject: ClickableGameObject){
        if(!clickableObject.showHitbox)
            return;
        const pos = clickableObject.transform.position;
        const center = clickableObject.transform.positionCenter;
        const scale = clickableObject.transform.scale;
        this.drawRectangle(
            pos.x,
            pos.y,
            scale.x,
            scale.y,
            { borderColor: 'red', fill: false, border: true }
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
        const angle = clickableObject.transform.getRadians();
        this.drawArrow(
            center.x,
            center.y,
            center.x + ((scale.x / 2 ) * Math.cos(angle)),
            center.y + ((scale.y / 2 ) * Math.sin(angle)),
            { color: 'red', borderColor: 'red' }
        )
    }   

}