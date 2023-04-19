import { Vector2 } from './structs/Vector2';
import { Signals } from './events/Signals';
import { GameEvent } from './events/GameEvent';
import { Resource, ResourceType } from './structs/Resource';
import { Renderer } from './drawing/Renderer';
import { GameObject } from './gameobjects/GameObject';
import { GameMouseEvent } from './events/GameMouseEvent';
import { GameObjectSpawnEvent } from './events/gameobject/GameObjectSpawnEvent';
import { GameObjectDestroyEvent } from './events/gameobject/GameObjectDestroyEvent';
import { DrawEvent } from './events/DrawEvent';
import { TickEvent } from './events/TickEvent';
import { ClickableGameObject } from './gameobjects/ClickableGameObject';
import { DrawableGameObject } from './gameobjects/DrawableGameObject';
import { IsInRange, RandomInRange, floor } from './utils/math/MathUtils';
import { GameStartEvent } from './events/GameStartEvent';
import { GameSettings, defaultGameSettings } from './structs/GameSettings';
import { Input } from './Input';

/**
 * @group Important Classes
 */
export class Game {
  // Properties
  public readonly canvas: HTMLCanvasElement;
  public readonly renderer: Renderer = new Renderer(this);
  public readonly grid: Vector2;
  public readonly gameSettings: GameSettings;
  public canvasViewOffset: Vector2;

  // Constructor
  /**
   * Constructs new Game instance with given settings.
   * @param gameSettings The settings
   */
  constructor(gameSettings: GameSettings) {
    this.gameSettings = { ...defaultGameSettings, ...gameSettings };
    if (this.gameSettings.canvas !== undefined) {
      this.canvas = this.gameSettings.canvas;
    } else {
      throw new Error('Cannot asign canvas.');
    }
    if (this.gameSettings.grid !== undefined) {
      this.grid = this.gameSettings.grid;
    } else {
      throw new Error('Cannot asign grid.');
    }
    this.input = new Input();
    this._registerCanvasEvents();
    if (this.gameSettings.autoResize) {
      window.addEventListener('resize', () => {
        this.renderer.resizeCanvas();
        this.Update();
      });
    }
    this.renderer.ctx.imageSmoothingEnabled = true;
    if (this.gameSettings.canvasImageQuality !== undefined)
      this.renderer.ctx.imageSmoothingQuality =
        this.gameSettings.canvasImageQuality;
    this.canvasViewOffset = new Vector2();
  }

  // Canvas
  /**
   * Scaling canvas size on page to percentage of parent element.
   * @param percentage The decimal midpoint
   * @returns The final canvas size
   */
  public RescaleCanvasToParentElement(percentage: number): Vector2 {
    this.renderer.canvasParentSize = percentage;
    this.renderer.resizeCanvas();
    return this.renderer.canvasSize;
  }
  private _registerCanvasEvents() {
    this.canvas.addEventListener('mousemove', event => {
      this.mouseMoveHandler(this, event);
    });
    document.addEventListener('mouseup', () => {
      this.mouseUpHandler(this);
    });
    document.addEventListener('mousedown', () => {
      this.mouseDownHandler(this);
    });
    this.canvas.addEventListener('click', () => {
      this.mouseClickHandler(this);
    });
    // Appends mouse wheel listener to canvas
    this.canvas.addEventListener(
      'wheel',
      event => {
        this.mouseWheelHandler(this, event);
      },
      { passive: false }
    );
    document.addEventListener('keydown', event => {
      if (event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      const code = event.code.toLowerCase().replace('key', '');
      this.input.keysDown.add(code);
    });
    document.addEventListener('keyup', event => {
      if (event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      const code = event.code.toLowerCase().replace('key', '');
      this.input.keysUp.add(code);
    });
  }

  // Game Loop Management
  private _isPlaying = false;
  private _unscaledTime = 0;
  private _deltaTime = 0;
  timeScale = 1;
  isNeedToUpdate = true;

  private _gameLoopUpdate(time: number) {
    // Calculation deltaTime
    this._deltaTime = time - this._unscaledTime;
    this._unscaledTime = time;
    // Update
    const tickEvent: TickEvent = {
      unscaledDeltaTime: this._deltaTime / 1000,
      unscaledTime: this._unscaledTime / 1000,
      deltaTime: (this._deltaTime / 1000) * this.timeScale,
      timeScale: this.timeScale,
      game: this,
    };
    // Events update
    const hoveredGameObject = this.mouseHoveredGameObject;
    const mouseEvent = this.constructMouseEvent();
    const lastHoveredGameObject = this.lastMouseHoveredGameObject;
    if (lastHoveredGameObject !== hoveredGameObject) {
      if (lastHoveredGameObject !== undefined)
        lastHoveredGameObject.OnMouseHoverEnd(mouseEvent);
      hoveredGameObject?.OnMouseHoverStart(mouseEvent);
      this.lastMouseHoveredGameObject = hoveredGameObject;
    }

    this.input.mouseScrollDelta = new Vector2(0, this._tempMouseWheelDeltaY);
    if (this._tempMouseWheelDeltaY !== 0) {
      this.emit('mouseScroll', mouseEvent);
    }
    this._tempMouseWheelDeltaY = 0;

    const keyEvent = {
      game: this,
      input: this.input,
    };
    if (this.input.keysDown.size > 0) this.emit('keyDown', keyEvent);
    if (this.input.keysUp.size > 0) this.emit('keyUp', keyEvent);

    // Update
    for (const gameObject of this.gameObjects) {
      if (!gameObject.enabled) continue;
      try {
        gameObject.Update(tickEvent);
      } catch (e) {
        console.warn(
          `Problem with executing Update @ ${gameObject.constructor.name} `,
          gameObject
        );
        if (e instanceof Error) console.error(e.message);
      }
    }
    // Fixed Update
    for (const gameObject of this.gameObjects) {
      if (!gameObject.enabled) continue;
      try {
        gameObject.FixedUpdate(tickEvent);
      } catch (e) {
        console.warn(
          `Problem with executing FixedUpdate @ ${gameObject.constructor.name} `,
          gameObject
        );
        if (e instanceof Error) console.error(e.message);
      }
    }
    //
    this.input.keysDown.clear();
    this.input.keysUp.clear();
  }

  private _gameLoopDraw() {
    if (this.isNeedToUpdate || this.gameSettings.drawAlways) {
      this.renderer.clearFrame();
      const drawEvent: DrawEvent = {
        renderer: this.renderer,
        game: this,
      };
      this.emit('draw', drawEvent);
      for (const gameObject of this.gameObjects) {
        if (!gameObject.enabled) continue;
        if (!(gameObject instanceof DrawableGameObject)) continue;
        try {
          gameObject.OnDraw(drawEvent);
          if (gameObject instanceof ClickableGameObject) {
            const clickable = gameObject as ClickableGameObject;
            this.renderer.drawHitbox(clickable);
          }
        } catch (e) {
          console.warn(
            `Problem with executing draw @ ${gameObject.constructor.name} `,
            gameObject
          );
          if (e instanceof Error) console.error(e.message);
        }
      }
      this.isNeedToUpdate = false;
    }
  }

  private readonly _gameLoop = (time: number) => {
    this._gameLoopUpdate(time);
    if (!document.hasFocus() && !this.gameSettings.refreshWhenUnfocused) {
      if (this._isPlaying) window.requestAnimationFrame(this._gameLoop);
      return;
    }
    this._gameLoopDraw();
    // Continue loop
    if (this._isPlaying) window.requestAnimationFrame(this._gameLoop);
  };

  /**
   * Tells the game it needs to be redrawn.
   * Call it when some visible objects has been changed.
   */
  Update() {
    this.isNeedToUpdate = true;
  }

  /**
   * Starts new game loop
   */
  StartGameLoop() {
    if (this._isPlaying) {
      console.warn('Cannot start new game loop when the game loop exists.');
      return;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(this._gameLoop.bind(this));
      this._isPlaying = true;
    });
  }
  /**
   * WARNING! Stops the game loop
   */
  StopGameLoop() {
    console.warn(
      'Stopped the game loop! Restarting the game loop will cause a time skip.'
    );
    this._isPlaying = false;
  }

  /**
   * Starts the game loop and emit `start` ({@link GameEvent}) event.
   */
  Start() {
    this.StartGameLoop();
    this.emit('start', { game: this });
  }

  /**
   * Starts loading game resources and returns promise.
   * @method
   * @returns The Promise
   * @example
   * game.LoadGameAndStart().then((e) => {
   *   console.log('Game sucessfully loaded!');
   * }).catch((error) => {
   *   console.error('Error');
   * }).finally(() => {
   *   console.log("Finally");
   * });
   */
  LoadGameAndStart(): Promise<GameStartEvent> {
    return new Promise((resolve, reject) => {
      if (this._isPlaying)
        reject(
          new Error(
            'Cannot load and start game because the game loop currently exists!'
          )
        );
      const whenLoaded = () => {
        this.Start();
        resolve({ game: this });
      };
      this.on('loadAllResources', whenLoaded);
      try {
        setTimeout(() => {
          this.LoadAllResources();
        }, 1);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Signals
  private readonly _signals: Signals = new Signals();
  emit = (channel: string, event: GameEvent) =>
    this._signals.emit(channel, event);
  /**
   * Appends listener to event channel.
   * @method
   * @param channel - The listener event channel.
   * @param callback - Executed function after receiving a signal on given channel.
   * @example
   * game.on('channel', () => { console.log('received!') });
   */
  on = (channel: string, callback: (event: GameEvent) => void) =>
    this._signals.on(channel, callback);

  // Resources
  resources: Map<string, Resource> = new Map();
  private _isLoadedAllResources = false;

  /**
   * Loads resource with resource manager.
   * @method
   * @param type - The resource type
   * @param uid - The resource unique key
   * @param path - The resource path
   * @example
   * game.LoadResource('image', 'player', './resources/img/player.png');
   */
  LoadResource(type: ResourceType, uid: string, path: string) {
    if (type === 'image') {
      this.resources.set(uid, {
        uid: uid,
        type: type,
        path: path,
        object: undefined,
        loaded: false,
      });
    } else {
      throw new Error('Unknown resource type.');
    }
    this.LoadAllResources();
  }
  /**
   * Creates {@link HTMLImageElement} from path.
   * @method
   * @param path - The image path
   * @returns The image element
   * @example
   * game.CreateImage('./resources/img/player.png');
   */
  CreateImage(path: string): HTMLImageElement {
    const img = new Image();
    img.src = path;
    return img;
  }
  /**
   * Gets the resource by unique resource key.
   * @method
   * @param uid - The unique resource key.
   * @returns The resource
   * @example
   * const resource = game.GetResource('player');
   */
  GetResource(uid: string): Resource {
    const res = this.resources.get(uid);
    if (res === undefined) throw new Error('Resource not loaded!');
    return res;
  }
  /**
   * Gets the image resource by unique resource key.
   * @method
   * @param uid - The unique resource key.
   * @returns The image
   * @example
   * const image = game.GetImage('player');
   */
  GetImage(uid: string): object | undefined {
    const res = this.GetResource(uid);
    if (res.type !== 'image') return undefined;
    if (!res.loaded) return undefined;
    return res.object;
  }
  /**
   * Starts loading all resources which is not loaded. Emits {@link GameEvent} at `loadAllResources` channel.
   */
  LoadAllResources() {
    if (this.resources.size === 0) {
      this._signals.emit('loadAllResources', { game: this });
      this._isLoadedAllResources = true;
      return;
    }
    let resourcesCount = 0;
    const resourceLoaded = () => {
      resourcesCount -= 1;
      if (resourcesCount === 0) {
        if (!this._isLoadedAllResources) {
          this._signals.emit('loadAllResources', { game: this });
          this._isLoadedAllResources = true;
        }
      }
    };
    this.resources.forEach(resource => {
      if (resource.loaded) return;
      if (resource.type === 'image') {
        // Loading image
        const image = new Image();
        image.src = resource.path;
        image.addEventListener('error', () => {
          resource.loaded = false;
          console.error(`Cannot load ${resource.uid} resource.`);
          resourceLoaded();
        });
        image.addEventListener('load', () => {
          resource.object = image;
          resource.loaded = true;
          resourceLoaded();
        });
      } else {
        // Unknown type
        console.warn(`Type "${resource.type}" is unknown resources type.`);
        return;
      }
      resourcesCount += 1;
    });
  }

  // GameObjects
  /**
   * Sorted game object array
   */
  readonly gameObjects: Array<GameObject> = [];
  /**
   * Sorts all game objects by sorting order property.
   */
  SortGameObjects() {
    this.gameObjects.sort((a, b) => a.sortingOrder - b.sortingOrder);
  }
  /**
   * Adds unique game object to game.
   * @method
   * @param gameObject - The unique game object
   * @returns The added game object
   * @example
   * game.AddGameObject(new JSGL.GameObject());
   */
  AddGameObject(gameObject: GameObject): GameObject {
    if (!(gameObject instanceof GameObject))
      throw new Error('Cannot add not GameObject!');
    for (const otherGameObjects of this.gameObjects) {
      if (gameObject.id === otherGameObjects.id)
        throw new Error('Cannot add this same GameObject!');
    }
    if (gameObject.name === undefined)
      gameObject.name = gameObject.constructor.name;
    this.gameObjects.push(gameObject);
    this.SortGameObjects();
    const gameObjectSpawnEvent: GameObjectSpawnEvent = {
      game: this,
      gameObjectId: gameObject.id,
    };
    gameObject.Start(gameObjectSpawnEvent);
    this.emit('spawnedGameObject', gameObjectSpawnEvent);
    return gameObject;
  }
  /**
   * Destroys existed game object by reference
   * @method
   * @param gameObject - The game object reference
   * @example
   * const gameObject = ...
   * game.DestroyGameObjectByRef(gameObject);
   */
  DestroyGameObjectByRef(gameObject: GameObject) {
    if (!(gameObject instanceof GameObject))
      throw new Error('Param gameObject must be an GameObject object!');
    const index = this.gameObjects.indexOf(gameObject);
    if (index === -1) return;
    const onDestroyEvent: GameObjectDestroyEvent = {
      game: this,
    };
    gameObject.Destroy(onDestroyEvent);
    this.gameObjects.splice(index, 1);
    this.SortGameObjects();
  }
  /**
   * Destroys existed game object by unique id
   * @method
   * @param id - The unique id
   * @example
   * game.DestroyGameObjectById('51870300-4187221613-3012590175-3461657014');
   */
  DestroyGameObjectById(id: string) {
    if (typeof id !== 'string') throw new Error('Param id must be string!');
    const gameObject = this.GetGameObjectById(id);
    if (gameObject === undefined) return;
    const index = this.gameObjects.findIndex(
      element => element.id === gameObject.id
    );
    if (index === -1) return;
    const onDestroyEvent: GameObjectDestroyEvent = {
      game: this,
    };
    this.gameObjects[index].Destroy(onDestroyEvent);
    this.gameObjects.splice(index, 1);
    this.SortGameObjects();
  }
  /**
   * Destroys existed game object by index in game objects array
   * @method
   * @param index - The index
   * @example
   * game.DestroyGameObjectByIndex(0);
   */
  DestroyGameObjectByIndex(index: number) {
    if (typeof index !== 'number')
      throw new Error('Param index must be number!');
    if (index < 0) throw new Error('Index cannot be lower than 0!');
    if (index >= this.gameObjects.length)
      throw new Error('Index cannot be bigger than maximum index!');
    const onDestroyEvent: GameObjectDestroyEvent = {
      game: this,
    };
    this.gameObjects[index].Destroy(onDestroyEvent);
    this.gameObjects.splice(index, 1);
    this.SortGameObjects();
  }
  /**
   * Gets all existed game objects with type equal to param.
   * @param type - The type
   * @returns Array of selected game objects
   * @example
   * game.GetGameObjectsByType(JSGL.Shape);
   */
  GetGameObjectsByType(type: object): Array<GameObject> {
    if (typeof type != 'function' || !(type instanceof Object))
      throw new Error('Type must be an object!');
    const result = [];
    for (const gameObject of this.gameObjects) {
      if (gameObject instanceof type) result.push(gameObject);
    }
    return result;
  }
  /**
   * Gets all existed game objects by given name.
   * @method
   * @param name - The name.
   * @returns Array of game objects with given name.
   * @example
   * game.GetGameObjectsByName('exampleName');
   */
  GetGameObjectsByName(name: string): Array<GameObject> {
    if (typeof name != 'string')
      throw new Error('Name of object must be string!');
    const result = [];
    for (const gameObject of this.gameObjects) {
      if (gameObject.name === name) result.push(gameObject);
    }
    return result;
  }
  /**
   * Gets all existed game objects by given tag.
   * @method
   * @param tag The - tag.
   * @returns The array of game objects with given tag.
   * @example
   * game.GetGameObjectsByTag('exampleTag');
   */
  GetGameObjectsByTag(tag: string): Array<GameObject> {
    if (typeof tag != 'string')
      throw new Error('Name of object must be string!');
    const result = [];
    for (const gameObject of this.gameObjects) {
      if (gameObject.tag === tag) result.push(gameObject);
    }
    return result;
  }
  /**
   * Gets game object by unique id.
   * @method
   * @param id - The unique id
   * @returns The game object
   * @example
   * game.GetGameObjectById('51870300-4187221613-3012590175-3461657014');
   */
  GetGameObjectById(id: string): GameObject | undefined {
    if (typeof id !== 'string') throw new Error('Param id must be a string!');
    for (const gameObject of this.gameObjects) {
      if (gameObject.id === id) return gameObject;
    }
    return undefined;
  }

  // Sounds Management
  /**
   * Plays sound at the page.
   * @method
   * @param path - The path to sound file
   * @param loop - is looped?
   * @param volume - The volume decimal midpoint
   * @example
   * game.PlaySound('./resources/sounds/death.mp3', false, 0.8);
   */
  PlaySound(path: string, loop = false, volume = 1) {
    const audio = new Audio();
    const src = document.createElement('source');
    src.type = 'audio/mpeg';
    src.src = path;
    audio.appendChild(src);
    audio.loop = loop;
    audio.volume = volume;
    audio.play().then();
  }

  // Input Management

  public input: Input;

  /**
   * Use `input.mouseWorldPosition` instead.
   * @deprecated since version 1.0.8
   */
  public get mousePos() {
    return this.input.mouseWorldPosition;
  }
  /**
   * Use `input.mouseClientPosition` instead.
   * @deprecated since version 1.0.8
   */
  public get mouseClientPos() {
    return this.input.mouseClientPosition;
  }
  /**
   * Use `input.mousePreciseWorldPosition` instead.
   * @deprecated since version 1.0.8
   */
  public get mousePrecisePos() {
    return this.input.mousePreciseWorldPosition;
  }
  /**
   * Use `input.isMousePrimaryButtonDown` instead.
   * @deprecated since version 1.0.8
   */
  public get isMousePrimaryButtonDown() {
    return this.input.isMousePrimaryButtonDown;
  }

  private lastMouseHoveredGameObject: ClickableGameObject | undefined;

  public get mouseHoveredGameObject(): ClickableGameObject | undefined {
    for (let i = this.gameObjects.length - 1; i >= 0; i -= 1) {
      const gameObject = this.gameObjects[i];
      if (!gameObject.enabled) continue;
      if (!(gameObject instanceof ClickableGameObject)) continue;
      const clickableObj = gameObject as ClickableGameObject;
      if (clickableObj.ignoreRaycast) continue;
      if (
        clickableObj.transform.scale.x <= 0 ||
        clickableObj.transform.scale.y <= 0
      )
        continue;
      const minX = clickableObj.transform.position.x;
      const maxX =
        clickableObj.transform.position.x + clickableObj.transform.scale.x;
      const minY = clickableObj.transform.position.y;
      const maxY =
        clickableObj.transform.position.y + clickableObj.transform.scale.y;
      const isInRange =
        IsInRange(this.input.mousePreciseWorldPosition.x, minX, maxX) &&
        IsInRange(this.input.mousePreciseWorldPosition.y, minY, maxY);
      if (isInRange) {
        return clickableObj;
      }
    }
    return undefined;
  }
  private constructMouseEvent(): GameMouseEvent {
    const gameMouseEvent: GameMouseEvent = {
      game: this,
      mousePos: this.input.mouseWorldPosition,
      mousePrecisePos: this.input.mousePreciseWorldPosition,
      mouseClientPos: this.input.mouseClientPosition,
      isMouseDown: this.input.isMousePrimaryButtonDown,
      mouseWorldPosition: this.input.mouseWorldPosition,
      mousePreciseWorldPositon: this.input.mousePreciseWorldPosition,
      mouseLocalPosition: this.input.mouseLocalPosition,
      mousePreciseLocalPosition: this.input.mousePreciseLocalPosition,
      mouseScrollDelta: this.input.mouseScrollDelta,
    };
    return gameMouseEvent;
  }
  private mouseMoveHandler(game: Game, event: MouseEvent) {
    game.input.mouseClientPosition = new Vector2(event.offsetX, event.offsetY);
    const worldPosition = game.input.mouseClientPosition.clone();
    const gridSize = game.renderer.gridSize;
    worldPosition.divide(gridSize);
    const localPosition = worldPosition.clone();
    game.input.mousePreciseLocalPosition = localPosition.clone().floor();
    game.input.mouseLocalPosition = localPosition.clone().floor();
    worldPosition.add(this.canvasViewOffset);
    game.input.mousePreciseWorldPosition = worldPosition.clone();
    worldPosition.floor();
    game.input.mouseWorldPosition = worldPosition;
    const mouseEvent = game.constructMouseEvent();
    game.emit('mouseMove', mouseEvent);
  }
  private mouseDownHandler(game: Game) {
    const gameMouseEvent: GameMouseEvent = game.constructMouseEvent();
    game.input.isMousePrimaryButtonDown = true;
    const hoveredGameObject = this.mouseHoveredGameObject;
    if (hoveredGameObject !== undefined)
      hoveredGameObject.OnMouseDown(gameMouseEvent);
    game.emit('mouseDown', gameMouseEvent);
  }
  private mouseUpHandler(game: Game) {
    const gameMouseEvent: GameMouseEvent = game.constructMouseEvent();
    game.input.isMousePrimaryButtonDown = false;
    const hoveredGameObject = this.mouseHoveredGameObject;
    if (hoveredGameObject !== undefined)
      hoveredGameObject.OnMouseUp(gameMouseEvent);
    game.emit('mouseUp', gameMouseEvent);
  }
  private mouseClickHandler(game: Game) {
    const gameMouseEvent: GameMouseEvent = game.constructMouseEvent();
    const hoveredGameObject = this.mouseHoveredGameObject;
    if (hoveredGameObject !== undefined)
      hoveredGameObject.OnMouseClick(gameMouseEvent);
    game.emit('mouseClick', gameMouseEvent);
  }
  private _tempMouseWheelDeltaY = 0;
  private mouseWheelHandler(game: Game, event: WheelEvent) {
    event.preventDefault();
    this._tempMouseWheelDeltaY = -event.deltaY;
  }

  public GetRandomPosition(): Vector2 {
    return new Vector2(
      floor(Math.random() * this.grid.x + this.canvasViewOffset.x),
      floor(Math.random() * this.grid.y + this.canvasViewOffset.y)
    );
  }
  public GetRandomPositionIn(min: Vector2, max: Vector2) {
    return new Vector2(
      RandomInRange(min.x, max.x),
      RandomInRange(min.y, max.x)
    );
  }
}
