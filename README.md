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
* Auto canvas scaling to size
* Game Settings (autoCanvasResize...)
* Creating OOP game objects
* Easy events system
* Resources loading system
* Easy management objects with Transform and Vector2
* No need to write HTML. The JSGL.ExampleHTML/JSGL.DefaultGame can render default game page.
## Documentation
Read @ [Documentation](https://jsglreference.pl/).
## Installing
### CDN
```html
<script src="https://unpkg.com/@moderrkowo/jsgl/dist/JSGL.js"></script>
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
  <script src="https://unpkg.com/@moderrkowo/jsgl/dist/JSGL.js"></script>
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
## Checks examples
[Examples](https://github.com/Moderrek/JSGL/tree/release/examples/);