# JSGL - Stable version update 1.0.7
From now the JSGL library will not undergo major changes. (i.e. renaming a function, etc.)
## New
* Added DOM detection and possibility to manually assign the document.
* Added `OnMouseHoverStart` `OnMouseHoverEnd` `OnMouseDown` `OnMouseUp` event function in ClickableGameObject.
* Reworked Vector2.
* Reworked Transform.
* Reworked Game start.
* New function `Renderer.fill(color | draw settings | image)`.
## Changes
* By default `Game.Update()` is invoked every frame. To change this set `drawAlways=true` in GameSettings 
* Removed JSGL.version constant.
* Corrected documentation. https://jsglreference.pl
* GameObject
* * `GameObject.OnStart(event)` -> `GameObject.Start(event)`
* * `GameObject.OnDestroy(event)` -> `GameObject.Destroy(event)`
## Fixes
* None.
# Presentation of news
### GameObject Update
From
```js
class Object extends JSGL.GameObject {
    OnStart(event){}
    OnDestroy(event){}
}
```
To
```js
class Object extends JSGL.GameObject {
    Start(event){}
    Destroy(event){}
}
```
### TickEvent Update
* New property `Game.timeScale`. Represents scale of time.
* Now `deltaTime` is scaled by `Game.timeScale`.
* New event value `unscaledDeltaTime` is deltaTime without `Game.timeScale` multiplication.
* New event value `unscaledTime`. This value represents time from game start in seconds.
### Vector2 ReWork
* New static method `Lerp(Vector2, Vector2, decimal midpoint)`
* New static method `Max(Vector2, Vector2)`
* New static method `Min(Vector2, Vector2)`
* New static property `Vector2.zero` = `(0, 0)`
* New static property `Vector2.one` = `(1, 1)`
* New static property `Vector2.up` = `(0, 1)`
* New static property `Vector2.down` = `(0, -1)`
* New static property `Vector2.right` = `(1, 0)`
* New static property `Vector2.left` = `(-1, 0)`
* New method `set(Vector2)` | `set(x, y)`
* New method `add(Vector2)` | `add(x, y)`
* New method `subtract(Vector2)` | `subtract(x, y)`
* New method `multiply(Vector2)` | `multiply(scalar)`
* New method `divide(Vector2)` | `divide(scalar)`
* New method `distance(Vector2)` | `distance(x, y)`
* New method `floor()`
### Transform ReWork
* New property `angles`. Gets/sets rotation in radians.
* New property `eulerAngles`. Gets/sets rotation in degrees.
* New property `positionCenter`.
* New property `forward`. Gets Vector2 value in direction.
* New property `backward`. Gets Vector2 value opposite to direction.
* New method `ifOnEdgeBounce(grid)`
* New method `set(Vector2)` | `set(x, y)`
* New method `setX(Vector2)` | `setX(x)`
* New method `setY(Vector2)` | `setY(y)`
* New method `translate(Vector2)` | `translate(x, y)`
* New method `translateX(Vector2)` | `translateX(x)`
* New method `translateY(Vector2)` | `translateY(x)`
### Better Game Starting
```js
game.LoadGameAndStart().then((gameStartEvent) => {
    console.log("Game sucessfully loaded!");
}).catch((error) => {
    console.error("Encountered error @ game loading/after loading!", error);
}).finally(() => {
    console.log("After success/error");
});
```
### ClickableGameObject Update
* New property `ignoreRaycast` set to `true` if you want to ignore mouse events.
```js
class MouseTest extends JSGL.ClickableGameObject {
    OnMouseClick = (e) => console.log('mouse click');
    OnMouseDown = (e) => console.log('mouse down');
    OnMouseUp = (e) => console.log('mouse up');
    OnMouseHoverStart = (e) => console.log('mouse hover start');
    OnMouseHoverEnd = (e) => console.log('mouse hover end');
}
```