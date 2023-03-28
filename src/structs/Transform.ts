import { Vector2 } from "./Vector2";
import { Clamp } from '../utils/math/MathUtils';

/** @group Structs */
export class Transform{
    /** Position */
    position;
    /** Width and height */
    scale;
    /** Rotation in degrees */
    rotation;

    /**
     * Constructs new Transform
     * @param posX The X-coordinate
     * @param posY The Y-coordinate
     * @param scaleX The width
     * @param scaleY The height
     * @param rotation The rotation in degrees
     */
    constructor(posX: number, posY: number, scaleX: number, scaleY: number, rotation: number = 0) {
        this.position = new Vector2(posX, posY);
        this.scale = new Vector2(scaleX, scaleY);
        this.rotation = rotation;
    }

    /**
     * Gets the Vector2 of center position.
     * @returns The center position
     */
    get positionCenter(){
        const x = this.position.x + ( this.scale.x / 2 );
        const y = this.position.y + ( this.scale.y / 2);
        return new Vector2(x, y);
    }

    /**
     * @beta
     */
    bounce(){
        this.rotation *= 2;
    }

    /**
     * @beta
     * @param grid Game canvas grid setting 
     */
    ifOnEdgeBounce(grid: Vector2){
        const isOnEdge = !(Vector2.IsPointIn(new Vector2(), grid.clone().subtract(new Vector2(this.scale.x, this.scale.y)), this.position));
        if(isOnEdge){
            this.position.x = Clamp(this.position.x, 0, grid.x - this.scale.x);
            this.position.y = Clamp(this.position.y, 0, grid.y - this.scale.y);
            this.bounce();
        }
    }

    /**
     * Gets the normalized rotation degrees
     * @returns 
     */
    getRotation(): number{
        this.normalizeRotation();
        return this.rotation;
    }
    /**
     * @param value The rotation degrees value.
     */
    setRotation(value: number){
        this.rotation = value;
        this.normalizeRotation();
    }
    
    /**
     * Rotates by given rotate.
     * @param value The rotate in degrees
     */
    rotate(value: number){
        this.rotation += value;
        this.normalizeRotation();
    }
    /**
     * Normalizes rotation
     */
    normalizeRotation(){
        if(this.rotation >= 360)
            this.rotation = this.rotation % 360;
    }
    /**
     * Gets the radians
     * @returns The radians of actual rotation
     */
    getRadians(): number{
        this.normalizeRotation();
        return this.rotation * Math.PI / 180;
    }

    /**
     * Gets width and height Vector2.
     * @returns The Vector2
     */
    getScale(): Vector2{
        return this.scale;
    }

    /**
     * Gets Transform width
     * @returns The width
     */
    getScaleX(): number{
        return this.scale.x;
    }
    /**
     * Sets new Transform width
     * @param x The new width
     * @returns This reference
     */
    setScaleX(x: number){
        this.scale.x = x;
        return this;
    }
    /**
     * Gets Transform height
     * @returns The height
     */
    getScaleY(){
        return this.scale.y;
    }
    /**
     * Sets new Transform height
     * @param y The new height
     * @returns This reference
     */
    setScaleY(y: number){
        this.scale.y = y;
        return this;
    }

    /**
     * Gets position
     * @returns The Vector2
     */
    getPosition(){
        return this.position;
    }
    /**
     * Gets X-coordinate
     * @returns The X-coordinate
     */
    getX(){
        return this.position.x;
    }
    /**
     * Sets new X-coordinate
     * @param x The new X-coordinate
     * @returns This reference
     */
    setX(x: number){
        this.position.x = x;
        return this;
    }
    /**
     * Adds Vector2 values to this position
     * @param v The Vector2
     * @returns This reference
     */
    add(v: Vector2){
        this.position.x += v.x;
        this.position.y += v.y;
        return this;
    }
    addX(x: number){
        this.position.x += x;
        return this;
    }
    getY() {
        return this.position.y;
    }
    setY(y: number){
        this.position.y = y;
        return this;
    }
    addY(y: number){
        this.position.y += y;
        return this;
    }

    /**
     * Sets new position by param.
     * @param v The new position.
     */
    setPostition(v: Vector2){
        this.position.x = v.x;
        this.position.y = v.y;
    }

    /**
     * Sets new position by param.
     * @param v The new position.
     */
    goTo(v: Vector2){
        this.setPostition(v);
    }

    

    /**
     * Moves Transform by Vector2 in actual direction
     * @param v The Vector2
     */
    move(v: Vector2){
        if(!(v instanceof Vector2))
            throw new Error("To move game object param must be Vector2!");
        this.position.x += v.x * Math.cos(this.getRadians());
        this.position.y += v.y * Math.sin(this.getRadians());
    }

    

    /**
     * Clones object
     * @returns The cloned object
     */
    clone(): Transform{
        return new Transform(this.position.x, this.position.y, this.scale.x, this.scale.y, this.rotation);
    }

}