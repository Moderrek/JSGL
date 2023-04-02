import { Game } from "../Game";

/** 
 * @group Game Events 
 */
export interface GameEvent{
    /**
     * Event owner reference
     */
    game: Game;
}