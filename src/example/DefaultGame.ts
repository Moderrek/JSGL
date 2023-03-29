import { Game, GameSettings, defaultGameSettings } from "../Game";
import { ExampleHTML, ExampleHTMLProperties } from "./ExampleHTML";

/** 
 * Helps with creating game page.
 * @group Tools
 */
export class DefaultGame {

    static Create(gameProps?: GameSettings, pageProps?: ExampleHTMLProperties, canvasSize: number = 1): Game{
        ExampleHTML.Render(pageProps);
        const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
        if(canvas === undefined)
            throw new Error("Cannot get canvas!");
        const gameSettings = {...defaultGameSettings, ...gameProps};
        gameSettings.canvas = canvas;
        const game = new Game(gameSettings);
        game.RescaleCanvasToParentElement(canvasSize);
        return game;
    }
}