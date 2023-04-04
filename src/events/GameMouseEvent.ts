import { Vector2 } from '../structs/Vector2';
import { GameEvent } from './GameEvent';

/**
 * Invoked at client mouse event
 * @group Game Events
 */
export type GameMouseEvent = GameEvent & {
  // DEPRECATED

  /**
   * Integer Vector2 mouse position on grid.
   * Use `mouseWorldPosition` instead.
   * @property
   * @deprecated since version 1.0.8
   */
  mousePos: Vector2;
  /**
   * Decimal Vector2 mouse position on grid (not snapped to integer).
   * Use `mousePreciseWorldPositon` instead.
   * @deprecated since version 1.0.8
   */
  mousePrecisePos: Vector2;

  /**
   * Integer Vector2 mouse position on canvas pixel.
   * @property
   */
  mouseClientPos: Vector2;
  /**
   * Defines is primary mouse button down.
   * @property
   */
  isMouseDown: boolean;

  /**
   * Integer Vector2 on world grid.
   * @property
   */
  mouseWorldPosition: Vector2;
  /**
   * Integer Vector2 on local visible grid.
   * @property
   */
  mouseLocalPosition: Vector2;
  /**
   * Decimal Vector2 on world grid (not snapped to integer).
   * @property
   */
  mousePreciseWorldPositon: Vector2;
  /**
   * Decimal Vector2 on local visible grid (not snapped to integer).
   * @property
   */
  mousePreciseLocalPosition: Vector2;
  /**
   * The current mouse scroll wheel delta. Positive number is up, negative is down and zero is for none.
   * @property
   */
  mouseScrollDelta: Vector2;
};
