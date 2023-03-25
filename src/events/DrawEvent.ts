import { Game } from '../Game';
import { Renderer } from '../drawing/Renderer';

export type DrawEvent = {
    renderer: Renderer;
    game: Game;
}