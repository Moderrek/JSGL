import { IsInRange, Lerp, floor } from '../utils/math/MathUtils';

/** @group Important Classes */
export class Vector2{

    /**
     * X component of vector.
     * @property
     */
    public x: number;
    /**
     * Y component of vector.
     * @property
     */
    public y: number;

    /**
     * Constructs a new Vector2 with the given components.
     * @param x - X component
     * @param y - Y component
     * @constructor
     */
    public constructor(x = 0, y = 0){
        if (typeof x !== 'number')
            throw new Error('X must be an number!');
        if (typeof y !== 'number')
            throw new Error('Y must be an number!');
        this.x = x;
        this.y = y;
    }

    // Static Methods

    /**
     * Performs Linear Interpolation on Vectors2 with given decimal midpoint
     * @method
     * @param a - The first Vector2
     * @param b - The second Vector2
     * @param c - The decimal midpoint
     * @returns Vector2 after Linear Interpolation.
     * @example
     * const a = new JSGL.Vector2(3, 9);
     * const b = new JSGL.Vector2(5, 2);
     * JSGL.Vector2.Lerp(a, b, 0); // (3, 9)
     * JSGL.Vector2.Lerp(a, b, 0.5); // (4, 5.5)
     * JSGL.Vector2.Lerp(a, b, 1); // (5, 2)
     */
    public static Lerp(a: Vector2, b: Vector2, c = 0): Vector2{
        return new Vector2(Lerp(a.x, b.x, c), Lerp(a.y, b.y, c));
    }
    /**
     * Returns the new Vector2 with maximum X and Y coordinates from first and second Vector2
     * @method
     * @param a - The first Vector2
     * @param b - The second Vector2
     * @returns The new Vector2 with maximum X and Y
     * @example
     * const a = new JSGL.Vector2(3, 9);
     * const b = new JSGL.Vector2(5, 2);
     * const max = JSGL.Vector2.Max(a, b); // (5, 9)
     */
    public static Max(a: Vector2, b: Vector2): Vector2{
        return new Vector2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }
    /**
     * Returns the new Vector2 with minimum X and Y coordinates from first and second Vector2
     * @method
     * @param a - The first Vector2
     * @param b - The second Vector2
     * @returns The new Vector2 with minimum X and Y
     * @example
     * const a = new JSGL.Vector2(3, 9);
     * const b = new JSGL.Vector2(5, 2);
     * const min = JSGL.Vector2.Min(a, b); // (3, 2)
     */
    public static Min(a: Vector2, b: Vector2): Vector2{
        return new Vector2(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }
    /**
     * Returns is `point` between given 2D range.
     * @method
     * @param min - The minimal range
     * @param max - The maximum range
     * @param point - The point
     * @returns is `point` between range.
     * @example
     * const min = new JSGL.Vector2(5, 5);
     * const max = new JSGL.Vector2(7, 7);
     * JSGL.Vector2.IsPointIn(min, max, new JSGL.Vector2(6, 5));
     */
    public static IsPointIn(min: Vector2, max: Vector2, point: Vector2): boolean{
        return IsInRange(point.x, min.x, max.x) && IsInRange(point.y, min.y, max.y);
    }

    /**
     * Returns true if two vectors are equal.
     * @method
     * @param v - The first Vector2
     * @param v2 - The second Vector2
     * @returns are vectors equal
     * @example
     * const vector1 = new JSGL.Vector2(2, 4);
     * const vector2 = new JSGL.Vector2(2, 4);
     * JSGL.Vector2.Equal(vector1, vector2);
     */
    public static Equal(v?: Vector2, v2?: Vector2): boolean{
        if (v === undefined || v2 === undefined)
            return false;
        if (!(v instanceof Vector2) || !(v2 instanceof Vector2))
            return false;
        return v.x === v2.x && v.y === v2.y;
    }

    // Accesors

    /**
     * @returns (0, 0)
     */
    public static get zero(){
        return new Vector2(0, 0);
    }
    /**
     * @returns (1, 1)
     */
    public static get one(){
        return new Vector2(1, 1);
    }
    /**
     * @returns (0, 1)
     */
    public static get up(){
        return new Vector2(0, 1);
    }
    /**
     * @returns (0, -1)
     */
    public static get down(){
        return new Vector2(0, -1);
    }
    /**
     * @returns (1, 0)
     */
    public static get right(){
        return new Vector2(1, 0);
    }
    /**
     * @returns (-1, 0)
     */
    public static get left(){
        return new Vector2(-1, 0);
    }

    public get magnitude(){
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    // Instance Methods
    /**
     * Sets components to given Vector2 or X, Y.
     * @method
     * @param x - The Vector2 or X-coordinate
     * @param y - The Y-coordinate (if `x` isn't Vector2)
     * @returns This reference
     * @example
     * vector2.set(exampleVector);
     * vector2.set(x, y);
     */
    public set(x: number | Vector2, y?: number): Vector2{
        if (x === undefined)
            return this;
        if (x instanceof Vector2){
            this.x = x.x;
            this.y = x.y;
        } else if (typeof x === 'number'){
            this.x = x;
            if (y !== undefined && typeof y === 'number'){
                this.y = y;
            } else {
                this.y = 0;
            }
        }
        return this;
    }

    /**
     * Adds given Vector2 or X, Y to this Vector2 components.
     * @method
     * @param x - The Vector2 or X-coordinate
     * @param y - The Y-coordinate (if `x` isn't Vector2)
     * @returns This reference
     * @example
     * vector2.add(exampleVector);
     * vector2.add(x, y);
     */
    public add(x: number | Vector2, y?: number): Vector2{
        if (x instanceof Vector2){
            this.x += x.x;
            this.y += x.y;
        } else if (typeof x === 'number' && y !== undefined && typeof y === 'number'){
            this.x += x;
            this.y += y;
        }
        return this;
    }

    /**
     * Substracts given Vector2 or X, Y to this Vector2 components.
     * @method
     * @param x - The Vector2 or X-coordinate
     * @param y - The Y-coordinate (if `x` isn't Vector2)
     * @returns This reference
     * @example
     * vector2.subtract(exampleVector);
     * vector2.subtract(x, y);
     */
    public subtract(x: number | Vector2, y?: number): Vector2{
        if (x instanceof Vector2){
            this.x -= x.x;
            this.y -= x.y;
        } else if (typeof x === 'number' && y !== undefined && typeof y === 'number'){
            this.x -= x;
            this.y -= y;
        }
        return this;
    }

    /**
     * Multiplies component by scalar or Vector2.
     * @method
     * @param x - The Vector2 or scalar
     * @returns This reference
     * @example
     * vector2.multiply(exampleVector);
     * vector2.multiply(scalar);
     */
    public multiply(x: number | Vector2): Vector2{
        if (x instanceof Vector2){
            this.x *= x.x;
            this.y *= x.y;
        } else if (typeof x === 'number'){
            this.x *= x;
            this.y *= x;
        }
        return this;
    }

    /**
     * Divides component by scalar or Vector2.
     * @method
     * @param x - The Vector2 or scalar
     * @returns This reference
     * @example
     * vector2.divide(exampleVector);
     * vector2.divide(scalar);
     */
    public divide(x: number | Vector2): Vector2{
        if (x instanceof Vector2){
            this.x /= x.x;
            this.y /= x.y;
        } else if (typeof x === 'number'){
            this.x /= x;
            this.y /= x;
        }
        return this;
    }

    /**
     * Returns distance between Vector2 or X, Y coordinate.
     * @method
     * @param x - The Vector2 or X-coordinate
     * @param y - The Y-coordinate (if `x` isn't Vector2)
     * @returns The distance between vectors
     * @example
     * vector2.distance(exampleVector);
     * vector2.distance(0, 0);
     */
    public distance(x: number | Vector2, y?: number): number{
        if (x instanceof Vector2){
            return Math.sqrt(Math.pow(Math.abs(this.x - x.x), 2) + Math.pow(Math.abs(this.y - x.y), 2));
        } else if (typeof x === 'number' && y !== undefined && typeof y === 'number'){
            return Math.sqrt(Math.pow(Math.abs(this.x - x), 2) + Math.pow(Math.abs(this.y - y), 2));
        }
        throw new Error('Invalid params!');
    }

    /**
     * Floors the X, Y components.
     * @method
     * @returns The reference
     * @example
     * vector2.floor();
     */
    public floor(): Vector2{
        this.x = floor(this.x);
        this.y = floor(this.y);
        return this;
    }

    /**
     * Returns true if two vectors are equal.
     * @method
     * @param v - The second Vector2
     * @returns are vectors equal
     * @example
     * const vector1 = new JSGL.Vector2(2, 4);
     * const vector2 = new JSGL.Vector2(2, 4);
     * vector1.equal(vector2);
     */
    public equal(v?: Vector2): boolean{
        if (v === undefined)
            return false;
        if (!(v instanceof Vector2))
            return false;
        return this.x === v.x && this.y === v.y;
    }

    /**
     * Clones the Vector2.
     * @method
     * @returns The clone
     */
    public clone(): Vector2{
        return new Vector2(this.x, this.y);
    }

}