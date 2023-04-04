# JSGL - User Input, "Camera", isTouching update 1.0.8
## New
* Added changelogs
* Game Events
* * `mouseScroll` - emits GameMouseEvent
* * `keyDown` - emits GameKeyEvent
* * `keyUp` - emits GameKeyEvent
* "Camera" is more like to view offset. You can find it in `game.canvasViewOffset`. This property is a Vector2.
* Added `DrawableGameObject.IsTouching(drawGameObj, drawGameObj2)` static method and `drawableGameObject.isTouching(drawGameObj)`
* Added `JSGL.log(content)`, `JSGL.warn(content)`, `JSGL.error(content)`. Prints message to dev console with format `[DATE] [LEVEL] content`
## Changes
* Deprecated
* * `game.mousePos` - Instead use `game.input.mouseWorldPosition`
* * `game.mouseClientPos` - Instead use `game.input.mouseClientPosition`
* * `game.mousePrecisePos` - Instead use `game.input.mousePreciseWorldPosition`
* * `game.isMousePrimaryButtonDown()` - Instead use `game.input.isMousePrimaryButtonDown`
* Now GameMouseEvent has properties from `game.input`. (Only about mouse)
## Fixes
* None.
# Presentation of news
### Mouse wheel handling
In GameObject
```js
...
Update(event){
    event.game.input.mouseScrollDelta.y; // x is ignored
}
...
```
Without GameObject
```js
game.on('mouseScroll', (event) => {
    event.mouseScrollDelta.y; // x is ignored
});
```
### How to work with input
In GameObject
```js
...
Update(event){
    event.game.input.isKeyDown('w'); // <-- returns is 'w' pressed down
    event.game.input.isKeyUp('s'); // <-- returns is 's' clicked
}
...
```
Without GameObject
```js
...
game.on('keyUp' (event) => {
    event.input.isKeyUp('s'); // <-- returns is 's' clicked
});
game.on('keyDown' (event) => {
    event.input.isKeyDown('w'); // <-- returns is 'w' pressed down
});
...
```