export enum RotationType {
  DEGREES = 'DEGREES',
  RADIANS = 'RADIANS',
}

export type RotationValue = {
  type: RotationType;
  value: number;
};

export class Rotation {
  /**
   * Stored rotation in degrees
   */
  private _value: number;

  public constructor(
    rotation: RotationValue = { type: RotationType.DEGREES, value: 0 }
  ) {
    if (rotation.type === RotationType.DEGREES) {
      this._value = rotation.value;
    } else if (rotation.type === RotationType.RADIANS) {
      this._value = Rotation.ToDegrees(rotation.value);
    } else {
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
    this._value = Rotation.ToDegrees(radians);
  }
  public get angles(): number {
    return Rotation.ToRadians(this._value);
  }

  public set eulerAngles(degrees) {
    this._value = degrees;
  }
  public get eulerAngles(): number {
    return this._value;
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
