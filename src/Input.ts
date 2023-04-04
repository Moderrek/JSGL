import { Vector2 } from './structs/Vector2';

export class Input {
  // Mouse
  public isMousePrimaryButtonDown = false;
  /**
   * The current mouse scroll wheel delta. Positive number is up, negative is down and zero is for none.
   * @property
   */
  public mouseScrollDelta: Vector2 = new Vector2();
  /**
   * The current integer mouse position on canvas pixel coordinate.
   * @property
   */
  public mouseClientPosition: Vector2 = new Vector2();
  /**
   * The current integer mouse position on world grid coordinate.
   * @property
   */
  public mouseWorldPosition: Vector2 = new Vector2();
  /**
   * The current decimal mouse position on world grid coordinate.
   * @property
   */
  public mousePreciseWorldPosition: Vector2 = new Vector2();
  /**
   * The current integer mouse position on canvas grid coordinate.
   */
  public mouseLocalPosition: Vector2 = new Vector2();
  /**
   * The current decimal mouse position on canvas grid coordinate.
   */
  public mousePreciseLocalPosition: Vector2 = new Vector2();

  // Keyboard
  public keysUp: Set<string> = new Set();
  public keysDown: Set<string> = new Set();

  public isKeyDown(keyCode: string): boolean {
    return this.keysDown.has(keyCode.toLowerCase().replace('key', ''));
  }
  public isKeyUp(keyCode: string): boolean {
    return this.keysUp.has(keyCode.toLowerCase().replace('key', ''));
  }
}
