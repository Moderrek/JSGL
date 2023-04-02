import { Vector2 } from "./Vector2";
import { Clamp } from '../utils/math/MathUtils';
import { Rotation, RotationType } from './Rotation';

export class Transform{
    
    /** Position */
    public position: Vector2;
    /** Width and height */
    public scale: Vector2;
    /** Rotation */
    public rotation: Rotation;

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
        this.rotation = new Rotation({ type: RotationType.DEGREES, value: rotation });
    }

    // Rotation

    /**
     * Gets rotation in radians.
     */
    public get angles(): number{
        return this.rotation.angles;
    }
    /**
     * Sets rotation in radians.
     */
    public set angles(radians: number){
        this.rotation.angles = radians;
    }
    /**
     * Gets rotation in degrees.
     * @property
     */
    public get eulerAngles(): number {
        return this.rotation.eulerAngles;
    }
    /**
     * Sets rotation in degrees.
     */
    public set eulerAngles(degrees: number) {
        this.rotation.eulerAngles = degrees;
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
     * Gets forward Vector2
     * @property
     */
    public get forward(): Vector2{
        return new Vector2(Math.cos(this.rotation.angles), Math.sin(this.rotation.angles));
    }
    /**
     * Gets backward Vector2
     * @property
     */
    public get backward(): Vector2{
        return this.forward.multiply(-1);
    }

    /**
     * @beta
     * @method
     */
    bounce(){
        this.rotation.eulerAngles += 180;
    }

    /**
     * @beta
     * @method
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

    public set(x: number | Vector2, y?: number){
        if(x === undefined)
            return;
        if(x instanceof Vector2){
            // Vector2 set
            this.position.x = x.x;
            this.position.y = x.y;
        }else if(typeof x === 'number' && y !== undefined && typeof y === 'number'){
            // x, y set
            this.position.x = x;
            this.position.y = y;
        }
    }
    public setX(x: number | Vector2){
        if(x === undefined)
            return;
        if(x instanceof Vector2){
            this.position.x = x.x;
        }else if(typeof x === 'number'){
            this.position.x = x;
        }
    }
    public setY(y: number | Vector2){
        if(y === undefined)
            return;
        if(y instanceof Vector2){
            this.position.y = y.y;
        }else if(typeof y === 'number'){
            this.position.y = y;
        }
    }

    /**
     * Repositions X-coordinate and Y-coordinate.
     * @method
     * @param x - Vector2 or X-coordinate
     * @param y - Optional Y-coordinate
     * @example
     * const vector2 = new JSGL.Vector2(5, 2);
     * transform.translate(vector2);
     * 
     * transform.translate(5, 2);
     */
    public translate(x: number | Vector2, y?: number){
        if(x === undefined)
            return;
        if(x instanceof Vector2){
            // Vector2 translate
            this.position.x += x.x;
            this.position.y += x.y;
        }else if(typeof x === 'number' && y !== undefined && typeof y === 'number'){
            // x, y translate
            this.position.x += x;
            this.position.y += y;
        }
    }

    /**
     * Repositions X-coordinate.
     * @method
     * @param x - Vector2 or X-coordinate
     * @example
     * const vector2 = new JSGL.Vector2(5, 2);
     * transform.translateX(vector2);
     * 
     * transform.translateX(5);
     */
    public translateX(x: number | Vector2){
        if(x === undefined)
            return;
        if(x instanceof Vector2){
            this.position.x += x.x;
        }else if(typeof x === 'number'){
            this.position.x += x;
        }
    }

    /**
     * Repositions Y-coordinate.
     * @method
     * @param y - Vector2 or Y-coordinate
     * @example
     * const vector2 = new JSGL.Vector2(5, 2);
     * transform.translateY(vector2);
     * 
     * transform.translateY(2);
     */
    public translateY(y: number | Vector2){
        if(y === undefined)
            return;
        if(y instanceof Vector2){
            this.position.y += y.y;
        }else if(typeof y === 'number'){
            this.position.y += y;
        }
    }

    /**
     * Clones Transform and returns new object.
     * @method
     * @returns The cloned object
     */
    clone(): Transform{
        return new Transform(this.position.x, this.position.y, this.scale.x, this.scale.y, this.rotation.eulerAngles);
    }

}