/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { DrawEvent } from '../events/DrawEvent';
import { IsInRange } from '../utils/math/MathUtils';
import { GameObject } from './GameObject';

/**
 * Represents drawable game object
 * @group Game Objects
 */
export class DrawableGameObject extends GameObject {
  public static IsTouching(
    gameObject: DrawableGameObject,
    anotherGameObject: DrawableGameObject
  ): boolean {
    return (
      gameObject.visible &&
      anotherGameObject.visible &&
      IsInRange(
        gameObject.transform.position.x,
        anotherGameObject.transform.position.x,
        anotherGameObject.transform.position.x +
          anotherGameObject.transform.scale.x
      ) &&
      IsInRange(
        gameObject.transform.position.y,
        anotherGameObject.transform.position.y,
        anotherGameObject.transform.position.y +
          anotherGameObject.transform.scale.y
      )
    );
  }

  /**
   * Defines is this game object visible in game.
   * @property
   */
  public visible = true;

  /**
   * Invoked at frame when drawing
   * @method
   * @param event - {@link DrawEvent}
   * @virtual
   * @example
   * OnDraw(event){
   *  event.renderer.drawRectangle(0, 0, 1, 1);
   * }
   */
  public OnDraw(event: DrawEvent) {}

  public isTouching(anotherGameObject: DrawableGameObject): boolean {
    return DrawableGameObject.IsTouching(this, anotherGameObject);
  }
}
