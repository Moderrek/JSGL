<div align="center">
    <h1>⚡ JSGL</h1>
    <p>
        <a href="https://github.com/Moderrek/JSGL/blob/release/LICENSE.md"><img src="https://img.shields.io/github/license/Moderrek/JSGL" alt="license"></a>
        <a href="https://www.codefactor.io/repository/github/moderrek/jsgl"><img src="https://www.codefactor.io/repository/github/moderrek/jsgl/badge" alt="codefactor"></a>
        <a href="https://www.npmjs.com/package/@moderrkowo/jsgl"><img src="https://img.shields.io/npm/dt/@moderrkowo/jsgl" alt="downloads"></a>
        <a href="https://www.npmjs.com/package/@moderrkowo/jsgl"><img src="https://img.shields.io/npm/v/@moderrkowo/jsgl" alt="version"></a>
    </p>
</div>

# About The Project
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
## Required
* DOM
# Getting Started
## Browser
To include JSGL in browser add script tag to body element. Like below or check [examples](https://github.com/Moderrek/JSGL/tree/release/examples/).
```html
...
<body>
  <script src="https://unpkg.com/@moderrkowo/jsgl/dist/JSGL.js"></script> <!-- CDN -->
  <script src="./js/game.js"></script> 
</body>
...
```
## Node
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
<!-- # Usage W.I.P -->
# Documentation
* [JSGL Reference](https://jsglreference.pl/)  
* [JSGL Wiki](https://github.com/Moderrek/JSGL)  
* [JSGL Examples](https://github.com/Moderrek/JSGL/tree/release/examples)  
* [JSGL Changelogs](https://github.com/Moderrek/JSGL/tree/release/doc/changelogs)
# Developers
## Must have
Installed [**git**](https://git-scm.com/downloads) and [**Node.js**](https://nodejs.org/en/download)
## Building JSGL
1. First clone repository
   ```bash
   git clone https://github.com/Moderrek/JSGL.git
   ```
2. Enter the JSGL directory and install development dependencies
   ```bash
   cd JSGL
   npm install
   ```
3. Run build script
   * `npm run build` - Builds deployment bundle, types declaration and docs -> `/dist` `/docs`
   * `npm run build:prod` - Builds deployment bundle -> `/dist`
   * `npm run build:dev` - Builds mapped bundle -> `/dist`
   * `npm run build:types` - Builds types declaration -> `/dist`
   * `npm run build:docs` - Builds web docs for JSGL -> `/docs`
# License
Distributed under the MIT License. See ``LICENSE.md`` for more information.
# Contact
Tymon Woźniak *(owner)* <[tymon.student@gmail.com](mailto:tymon.student@gmail.com)>  
Project: [https://github.com/Moderrek/JSGL](https://github.com/Moderrek/JSGL)
