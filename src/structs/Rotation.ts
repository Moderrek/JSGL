/**
 * @group Structs
 * Represents a rotation in 2D space, stored internally as degrees.
 * Provides methods to set and get rotation in both degrees and radians.
 * Also includes static properties for common directions (right, down, left, up).
 * @example
 * const rotation = new Rotation({ type: RotationType.DEGREES, value: 90 });
 * console.log(rotation.angles); // Outputs: 1.5707963267948966 (radians)
 * rotation.angles = Math.PI; // Set rotation to 180 degrees using radians
 * console.log(rotation.eulerAngles); // Outputs: 180
 */
export enum RotationType {
    DEGREES = 'DEGREES',
    RADIANS = 'RADIANS',
}

/**
 * Represents a rotation value with a specified type (degrees or radians).
 * This type is used to initialize the Rotation class with the appropriate unit.
 * @group Structs
 * @example
 * const rotationValue: RotationValue = { type: RotationType.RADIANS, value: Math.PI / 2 };
 * const rotation = new Rotation(rotationValue);
 */
export type RotationValue = {
    type: RotationType;
    value: number;
};

export class Rotation {
    /**
     * Stored rotation in degrees
     */
    private _degrees: number;

    public constructor(
        rotation: RotationValue = { type: RotationType.DEGREES, value: 0 },
    ) {
        switch (rotation.type) {
            case RotationType.DEGREES:
                this._degrees = rotation.value;
                break;
            case RotationType.RADIANS:
                this._degrees = Rotation.ToDegrees(rotation.value);
                break;
            default:
                throw new Error('Cannot recognize rotation type!');
        }
    }

    public static get right() {
        return new Rotation({ type: RotationType.DEGREES, value: 0 });
    }
    public static get down() {
        return new Rotation({ type: RotationType.DEGREES, value: 90 });
    }
    public static get left() {
        return new Rotation({ type: RotationType.DEGREES, value: -180 });
    }
    public static get up() {
        return new Rotation({ type: RotationType.DEGREES, value: -90 });
    }

    public set angles(radians) {
        this._degrees = Rotation.ToDegrees(radians);
    }
    public get angles(): number {
        return Rotation.ToRadians(this._degrees);
    }

    public set eulerAngles(degrees) {
        this._degrees = degrees;
    }
    public get eulerAngles(): number {
        return this._degrees;
    }

    /**
     * Converts degrees to radians.
     * @param degrees The degrees
     * @returns The radians
     */
    public static ToRadians(degrees: number): number {
        return ((degrees % 360) * Math.PI) / 180;
    }

    /**
     * Converts radians to degrees.
     * @param radians The radians
     * @returns The degrees
     */
    public static ToDegrees(radians: number): number {
        return (radians / Math.PI) * 180;
    }
}

export default Rotation;
