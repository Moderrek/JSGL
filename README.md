<div align="center">
    <h1>⚡ JSGL</h1>
    <p>
        <a href="https://github.com/Moderrek/JSGL/blob/release/LICENSE.md"><img src="https://img.shields.io/github/license/Moderrek/JSGL" alt="license"></a>
        <a href="https://www.codefactor.io/repository/github/moderrek/jsgl"><img src="https://www.codefactor.io/repository/github/moderrek/jsgl/badge" alt="codefactor"></a>
        <a href="https://www.npmjs.com/package/@moderrkowo/jsgl"><img src="https://img.shields.io/npm/dm/@moderrkowo/jsgl" alt="downloads"></a>
        <a href="https://www.npmjs.com/package/@moderrkowo/jsgl"><img src="https://img.shields.io/npm/v/@moderrkowo/jsgl" alt="version"></a>
    </p>
</div>

## About
Client-side JavaScript library for creating web 2D games. Focusing at objective game.
Use the JSGL to create 2D games.
## Features
* Creating 2D Games in HTML Canvas
* Game Settings (autoCanvasResize...)
* Creating OOP game objects
* Easy events system
* Resources loading system
* Easy management objects with Transform and Vector2
* No need to write HTML. The JSGL.ExampleHTML can render default game page.
* Drawing text and UI (W.I.P)
## Documentation
Read @ [Documentation](https://jsglreference.pl/).
## Installing
### CDN
```html
<script src="https://unpkg.com/@moderrkowo/jsgl@1.0.3/dist/JSGL.js"></script>
```
### npm
```
npm i @moderrkowo/jsgl
```
## Including JSGL
### Browser
To include JSGL in browser add script tag to body element. Like below.
```html
...
<body>
  <script src="https://unpkg.com/@moderrkowo/jsgl@1.0.3/dist/JSGL.js"></script>
  <script src="./js/game.js"></script> 
</body>
...
```
### Node
To include JSGL in Node, first install with npm.
```
npm i @moderrkowo/jsgl
```
Example node code
```js
const { Vector2 } = require('@moderrkowo/jsgl');
const exampleVector2 = new Vector2(5, 10);
console.log(exampleVector2);
// Vector2 { x: 5, y: 10 }
```
## Example init
``index.html``
```html
...
<body>
    <script src="JSGL.js"></script>
    <script>
        // This function creates game path with canvas (id = gameCanvas)
        JSGL.ExampleHTML.Render({
            backgroundColor: '#0F0F0F'
        }); // render html page with overrided backgroundColor setting
        // Creating game instance
        let game = new JSGL.Game({
            /* required */canvas: document.getElementById("gameCanvas"),
            /* required */grid: new JSGL.Vector2(8, 6), /* Vector2(x, y) */
            autoResize: true,
            refreshWhenUnfocused: true
        })
        // Optional
        game.LoadResource('image', 'example-img', './resources/images/point.png');

        game.RescaleCanvasToParentElement(0.95); // Decimal mid point

        // Creating own JSGL GameObject
        class ExampleGameObject extends JSGL.GameObject {
            // Properties
            /*
            readonly id: string;
            enabled: boolean;
            name: string;
            tag: string;
            sortingOrder: number;
            transform: Transform;
            */
            // Executed at spawn
            OnStart(event){
                // event.game - game reference
            }
            // Executed at destroy
            OnDestroy(event){
                // event.game - game reference
            }
            // Executed at every frame (max frame is limited to monitor hz)
            Update(event){
                // event.deltaTime - frame time
                // event.game - game reference
            }
            // Executed at rendering (rendering is executed when need to update)
            // To tell the game that it need to be redrawed call game.Update();
            OnDraw(event){
                // event.renderer - renderer reference
                // event.game - game reference
            }
            // FixedUpdate is last update at every frame refresh
            FixedUpdate(event){
                // event.deltaTime - frame time
                // event.game - game reference
            }
        }

        // Creating own JSGL Sprite game object
        class ExampleSprite extends JSGL.Sprite {
            // + properties from JSGL.GameObject
            /* Properties from JSGL.Sprite
            visible: boolean = true;
            texture: HTMLImageElement = undefined;
            showHitbox: boolean = false;
            */
           
            // Dont override this functions
            // * OnDraw

            // Adds function
            OnStart(event){
                // event.game - game reference
                console.log("I have spawned!");
                this.texture = event.game.GetImage('example-img');
                // this.showHitbox = true;
                event.game.Update(); // to tell the game needs to redraw
            }
            OnMouseClick(event){
                // event.isMouseDown - false (click is registered after mouse button up)
                // event.mousePos - Vector2 of mouse position on game grid (Integer)
                // event.mousePrecisePos - Vector2 of mouse position on canvas (Scaled)
                // event.mouseClientPos - Vector2 of mouse position on canvas (Client Position)
                console.log("Clicked!");
                return true; // is handled? (boolean)
                // if returned true click go to game object under this
            }
        }

        function gameInit(){
            game.on('draw', (event) => {
                // event.renderer - the renderer reference
                // event.game - the game reference
                event.renderer.fillFrame({
                    color: '#F0F0F0'
                });
            })
            game.AddGameObject(new ExampleGameObject());
            game.AddGameObject(new ExampleSprite());
            console.log(game.gameObjects);
        }

        // Starting the game

        // Method 1
        // game.on('loadAllResources', () => {
        //     game.Start();
        //     gameInit();
        // });
        // game.LoadAllResources();

        // Method 2
        game.LoadGameAndStart().then(() => {
            console.log("Game loaded!");
            gameInit();
        });
    </script>
</body>
...
```