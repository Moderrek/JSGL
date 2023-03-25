import { Game } from '../Game';
import { Drawer } from '../drawing/Drawer';

export type DrawEvent = {
    renderer: Drawer;
    game: Game;
}