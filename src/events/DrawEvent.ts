import { Renderer } from '../drawing/Renderer';
import { GameEvent } from './GameEvent';

/**
 * Invoked at frame drawing
 * @group Game Events
 */
export type DrawEvent = GameEvent & {
  /**
   * Game canvas renderer
   */
  renderer: Renderer;
};
