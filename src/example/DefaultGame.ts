import { Game } from '../Game';
import { ExampleHTMLProperties, exampleHTMLDefaultProperties } from '../structs/ExampleHTMLProperties';
import { GameSettings, defaultGameSettings } from '../structs/GameSettings';
import { ExampleHTML } from './ExampleHTML';

/**
 * Helps with creating game page.
 * @group Tools
 */
export class DefaultGame {

    static Create(gameProps?: GameSettings, pageProps?: ExampleHTMLProperties, canvasSize = 1): Game{
        pageProps = { ...exampleHTMLDefaultProperties, ...pageProps };
        ExampleHTML.Render(pageProps);
        if (!(pageProps.document instanceof Document)){
            if (document instanceof Document){
                pageProps.document = document;
            } else {
                throw new Error("Default DOM cannot be assigned! Please assign document to 'document' property");
            }
        }
        const canvas = pageProps.document.getElementById('gameCanvas') as HTMLCanvasElement;
        if (canvas === undefined)
            throw new Error('Cannot get canvas!');
        const gameSettings = { ...defaultGameSettings, ...gameProps };
        gameSettings.canvas = canvas;
        const game = new Game(gameSettings);
        game.RescaleCanvasToParentElement(canvasSize);
        return game;
    }
}