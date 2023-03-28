/** @group Structs */
export class Vector2{
    /**
     * X-coordinate
     */
    x: number;
    /**
     * Y-coordinate
     */
    y: number;

    /**
     * Constructs a new Vector2 with the given coordinates.
     * @param {number} x X-coordinate
     * @param {number} y Y-coordinate
     */
    constructor(x: number = 0, y: number = 0){
        if(typeof x !== 'number')
            throw new Error("X must be an number!");
        if(typeof y !== 'number')
            throw new Error("Y must be an number!");
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the x-coordinate.
     * @param {number} x new X-coordinate value
     * @returns {Vector2}
     */
    setX(x: number): Vector2{
        if(typeof x !== 'number')
            throw new Error("X must be an number!");
        this.x = x;
        return this;
    }

    /**
     * Sets the y-coordinate.
     * @param {number} y new Y-coordinate value
     * @returns {Vector2}
     */
    setY(y: number): Vector2{
        if(typeof y !== 'number')
            throw new Error("Y must be an number!");
        this.y = y;
        return this;
    }

    /**
     * Gets the x-coordinate.
     * @returns {number}
     */
    getX(): number{
        return this.x;
    }

    /**
     * Gets the y-coordinate.
     * @returns {number}
     */
    getY(): number{
        return this.y;
    }

    /**
     * Adds the X-coordinate by param.
     * @param {number} x param
     * @returns {Vector2}
     */
    addX(x: number): Vector2{
        if(typeof x !== 'number')
            throw new Error("X must be an number!");
        this.x += x;
        return this;
    }

    /**
     * Adds the Y-coordinate by param.
     * @param {number} y param
     * @returns {Vector2}
     */
    addY(y: number): Vector2{
        if(typeof y !== 'number')
            throw new Error("Y must be an number!");
        this.y += y;
        return this;
    }

    /**
     * Adds the vector by another.
     * @param {Vector2} v The another vector
     * @returns {Vector2}
     */
    add(v: Vector2): Vector2{
        if(!(v instanceof Vector2))
            throw new Error("V must be an Vector2!");
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    /**
     * Performs subtraction components from the other vector components.
     * @param {Vector2} v The other vector
     * @returns {Vector2}
     */
    subtract(v: Vector2): Vector2{
        if(!(v instanceof Vector2))
            throw new Error("V must be an Vector2!");
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    /**
     * Performs scalar multiplication, multiplying all components with scalar.
     * @param {number} m Scalar
     * @returns {Vector2}
     */
    multiply(m: number): Vector2{
        if(typeof m !== 'number')
            throw new Error("Scalar must be an number!");
        this.x *= m;
        this.y *= m;
        return this;
    }

    /**
     * Performs scalar divination, dividing all components with scalar.
     * @param {number} d Scalar
     * @returns {Vector2}
     */
    divide(d: number): Vector2{
        if(typeof d !== 'number')
            throw new Error("Scalar must be an number!");
        this.x /= d;
        this.y /= d;
        return this;
    }

    /**
     * Gets the distance between this vector and another.
     * @param {Vector2} v The other vector.
     * @returns {number} The distance
     */
    distance(v: Vector2): number{
        if(!(v instanceof Vector2))
            throw new Error("V must be an Vector2!");
        return Math.sqrt(Math.pow(Math.abs(this.x - v.x), 2) + Math.pow(Math.abs(this.y - v.y), 2));
    }

    /**
     * Floors the X, Y coordinates.
     * @returns The reference
     */
    floor(): Vector2{
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    /**
     * Clones the Vector2.
     * @returns The clone
     */
    clone(): Vector2{
        return new Vector2(this.x, this.y);
    }

}