import { Game } from '../Game';
import { Sprite } from '../gameobjects/Sprite';
import { Vector2 } from '../structs/Vector2';
import { DrawSettings, defaultDrawSettings } from './DrawSettings';
import { ClickableGameObject } from '../gameobjects/ClickableGameObject';
import { Clamp01 } from '../utils/math/MathUtils';
import { RotationStyle } from '../enums/RotationStyle';
import { Rotation } from '../structs/Rotation';

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
     * Resizes canvas to parent element size by canvasParentSize (decimal midpoint).
     * @method
     * @example
     * renderer.resizeCanvas();
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
     * @method
     * @param x - The client coordinate
     * @returns The scaled number
     * @example
     * const scaledToGrid = renderer.scale(5);
     */
    scale(x: number): number{
        return x * this.gridSize;
    }

    /**
     * Combines given draw settings with default draw settings.
     * @method
     * @param drawSettings - The given draw settings 
     * @returns The combined draw settings
     * @example
     * const drawSettings = renderer.combineDrawSettings({ color: 'red' });
     */
    private combineDrawSettings(drawSettings: DrawSettings | undefined): DrawSettings{
        return { ...defaultDrawSettings, ...drawSettings };
    }

    /**
     * Sets canvas context properties to given settings.
     * @param drawSettings - The draw settings
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
     * @method
     * @param worldX - The X-coordinate
     * @param worldY - The Y-coordinate
     * @param worldWidth - The width
     * @param worldHeight - The height
     * @param drawSettings - The draw settings
     * @example
     * renderer.drawRectangle(5, 2, 1, 1, { color: 'green', border: true });
     */
    drawRectangle(worldX: number, worldY: number, worldWidth: number, worldHeight: number, drawSettings?: DrawSettings){
        drawSettings = this.combineDrawSettings(drawSettings);
        const dx = this.scale(worldX);
        const dy = this.scale(worldY);
        const dw = this.scale(worldWidth);
        const dh = this.scale(worldHeight);
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        if(drawSettings.angle !== undefined){
            if(drawSettings.rotationStyle === RotationStyle.allAround){
                this.ctx.rotate(Rotation.ToRadians(drawSettings.angle));
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
     * @method
     * @param worldX - The X-coordinate
     * @param worldY - The Y-coordinate
     * @param diameter - The diameter
     * @param drawSettings - The draw settings
     * @example
     * renderer.drawCircle(0, 0, 1, { color: 'yellow' });
     */
    drawCircle(worldX: number, worldY: number, diameter: number, drawSettings?: DrawSettings){
        drawSettings = this.combineDrawSettings(drawSettings);
        const dx = this.scale(worldX);
        const dy = this.scale(worldY);
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
     * @method
     * @param fromWorldX - From X-coordinate
     * @param fromWorldY - From Y-coordinate
     * @param toWorldX - To X-coordinate
     * @param toWorldY - To Y-coordinate
     * @param drawSettings - The draw settings
     * @example
     * renderer.drawLine(2, 3, 3, 4);
     */
    drawLine(fromWorldX: number, fromWorldY: number, toWorldX: number, toWorldY: number, drawSettings?: DrawSettings){
        drawSettings = this.combineDrawSettings(drawSettings);
        this.setContextSettings(drawSettings);
        this.ctx.beginPath();
        this.ctx.moveTo(this.scale(fromWorldX), this.scale(fromWorldY));
        this.ctx.lineTo(this.scale(toWorldX), this.scale(toWorldY));
        this.ctx.closePath();
        this.ctx.stroke();
    }

    /**
     * Draws arrow from position to another position.
     * @method
     * @param fromWorldX - From X-coordinate
     * @param fromWorldY - From Y-coordinate
     * @param toWorldX - To X-coordinate
     * @param toWorldY - To Y-coordinate
     * @param drawSettings - The draw settings
     * @example
     * renderer.drawArrow(2, 3, 3, 4);
     */
    drawArrow(fromWorldX: number, fromWorldY: number, toWorldX: number, toWorldY: number, drawSettings?: DrawSettings) {
        drawSettings = this.combineDrawSettings(drawSettings);
        // Scaling
        const size = this.gridSize / 16;
        this.ctx.lineWidth = this.gridSize / 64;
        this.setContextSettings(drawSettings);
        const p1 = new Vector2(fromWorldX * this.gridSize, fromWorldY * this.gridSize);
        const p2 = new Vector2(toWorldX * this.gridSize, toWorldY * this.gridSize);
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
     * @method
     * @example
     * renderer.clearFrame();
     */
    clearFrame(){
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    /**
     * Fills the canvas with color property from settings.
     * @param drawSettings - The settings
     * @deprecated
     */
    fillFrame(drawSettings: DrawSettings){
        drawSettings = this.combineDrawSettings(drawSettings);
        this.setContextSettings(drawSettings);
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    /**
     * Fills canvas with image.
     * @param image - The image
     * @deprecated
     */
    fillImageFrame(image: HTMLCanvasElement){
        this.ctx.drawImage(image, 0, 0, this.canvasWidth, this.canvasHeight);
    }

    /**
     * Fills canvas with content.
     * @method
     * @param content - The color, image or {@link DrawSettings}
     * @example
     * renderer.fill('white');
     * renderer.fill({ color: 'white' })
     * renderer.fill(game.GetImage('background'));
     */
    fill(content: string | DrawSettings | HTMLCanvasElement){
        if(content instanceof HTMLCanvasElement){
            this.setContextSettings(defaultDrawSettings);
            this.ctx.drawImage(content, 0, 0, this.canvasWidth, this.canvasHeight);
            return;
        }else if(typeof content === 'string'){
            this.setContextSettings(this.combineDrawSettings({ color: content}));
        }else{
            this.setContextSettings(this.combineDrawSettings(content));
        }
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    /**
     * Draws image.
     * @method
     * @param image - The image 
     * @param worldX - The X-coordinate
     * @param worldY - The Y-coordinate
     * @param worldWidth - The width
     * @param worldHeight - The height
     * @param drawSettings - The draw settings
     * @example
     * renderer.drawImage(game.GetImage('player'), 0, 0, 1, 1, { angle: 45 });
     */
    drawImage(image: HTMLImageElement, worldX: number, worldY: number, worldWidth: number, worldHeight: number, drawSettings?: DrawSettings){
        drawSettings = this.combineDrawSettings(drawSettings);
        const dx = this.scale(worldX);
        const dy = this.scale(worldY);
        const dw = this.scale(worldWidth);
        const dh = this.scale(worldHeight);
        this.ctx.save();
        this.ctx.translate(dx + dw / 2, dy + dh / 2);
        if(drawSettings.angle !== undefined){
            if(drawSettings.rotationStyle === RotationStyle.allAround){
                this.ctx.rotate(Rotation.ToRadians(drawSettings.angle));
            }
        }
        this.ctx.translate(- dx - dw / 2, - dy - dh / 2);
        this.ctx.drawImage(image, dx, dy, dw, dh);
        this.ctx.restore();
    }

    /**
     * Draws sprite texture.
     * @method
     * @param sprite - The sprite
     * @returns is success?
     * @example
     * const exampleSprite = ...;
     * renderer.drawSprite(exampleSprite);
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
            { angle: sprite.transform.eulerAngles, rotationStyle: sprite.rotationStyle }
        );
        return true;
    }

    /**
     * Draws hitbox with direction arrow.
     * @method
     * @param clickableObject - The clickable game object
     * @example
     * const exampleClickableObject = ...;
     * renderer.drawHitbox(exampleClickableObject);
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
        const angle = clickableObject.transform.angles;
        this.drawArrow(
            center.x,
            center.y,
            center.x + ((scale.x / 2 ) * Math.cos(angle)),
            center.y + ((scale.y / 2 ) * Math.sin(angle)),
            { color: 'red', borderColor: 'red' }
        )
    }   

}