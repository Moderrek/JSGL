import { Game } from '../Game';
import { Renderer } from '../drawing/Renderer';
import { GameEvent } from './GameEvent';

/** @group Game Events */
export interface DrawEvent extends GameEvent {
    /**
     * Game canvas renderer
     */
    renderer: Renderer;
}