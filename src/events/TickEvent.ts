import { Game } from "../Game";

export type TickEvent = {
    deltaTime: number;
    game: Game;
}