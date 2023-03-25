import { Game } from '../Game';

export type GameObjectSpawnEvent = {
    game: Game;
    gameObjectId: string;
}