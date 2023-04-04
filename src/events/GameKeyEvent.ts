import { Input } from '../Input';
import { GameEvent } from './GameEvent';

/**
 * @group Game Events
 */
export type GameKeyEvent = GameEvent & {
  input: Input;
};
