import { Vector2 } from "./structs/Vector2";
import { Signals } from "./signals/Signals";
import { GameEvent } from "./events/GameEvent";
import { Resource } from "./structs/Resource";
import { Callback } from "./signals/Callback";
import { Renderer } from './drawing/Renderer';
import { GameObject } from "./gameobjects/GameObject";
import { GameMouseEvent } from './events/GameMouseEvent';
import { GameObjectSpawnEvent } from "./events/gameobject/GameObjectSpawnEvent";
import { GameObjectDestroyEvent } from "./events/gameobject/GameObjectDestroyEvent";
import { DrawEvent } from "./events/DrawEvent";
import { TickEvent } from "./events/TickEvent";
import { ClickableGameObject } from "./gameobjects/ClickableGameObject";
import { DrawableGameObject } from "./gameobjects/DrawableGameObject";
import { ImageQuality } from "./enums/ImageQuality";
import { IsInRange, floor } from "./utils/math/MathUtils";

/**
 * The {@link Game} settings.
 */
export interface GameSettings {
    canvas?: HTMLCanvasElement;
    grid?: Vector2;
    /**
     * Is canvas auto resized to parent element size?
     */
    autoResize?: boolean;
    refreshWhenUnfocused?: boolean;
    canvasImageQuality?: ImageQuality;
}

/**
 * The {@link Game} default settings.
 */
export const defaultGameSettings: GameSettings = {
    canvas: undefined,
    grid: new Vector2(4, 3),
    autoResize: true,
    refreshWhenUnfocused: true,
    canvasImageQuality: ImageQuality.High
};

export class Game{
    // Properties
    readonly canvas: HTMLCanvasElement;
    readonly renderer: Renderer = new Renderer(this);
    readonly grid: Vector2;
    readonly gameSettings: GameSettings;

    // Constructor
    /**
     * Constructs new Game instance with given settings.
     * @param gameSettings The settings
     */
    constructor(gameSettings: GameSettings){
        this.gameSettings = { ...defaultGameSettings, ...gameSettings };
        if(this.gameSettings.canvas !== undefined){
            this.canvas = this.gameSettings.canvas;
        }else{
            throw new Error("Cannot asign canvas.");
        }
        if(this.gameSettings.grid !== undefined){
            this.grid = this.gameSettings.grid;
        }else{
            throw new Error("Cannot asign grid.");
        }
        this._registerCanvasEvents();
        if(this.gameSettings.autoResize){
            window.addEventListener('resize', () => {
                this.renderer.resizeCanvas();
                this.Update();
            });
        }
        this.renderer.ctx.imageSmoothingEnabled = true;
        if(this.gameSettings.canvasImageQuality !== undefined)
            this.renderer.ctx.imageSmoothingQuality = this.gameSettings.canvasImageQuality;
    }

    // Canvas
    /**
     * Scaling canvas size on page to percentage of parent element.
     * @param percentage The decimal midpoint
     * @returns The final canvas size
     */
    RescaleCanvasToParentElement(percentage: number): Vector2{
        this.renderer.canvasParentSize = percentage;
        this.renderer.resizeCanvas();
        return this.renderer.canvasSize;
    }
    private _registerCanvasEvents(){
        this.canvas.addEventListener('mousemove', (event) => {this.mouseMoveHandler(this, event)});
        document.addEventListener('mouseup', (event) => {this.mouseUpHandler(this, event)});
        document.addEventListener('mousedown', (event) => {this.mouseDownHandler(this, event)});
        this.canvas.addEventListener('click', (event) => {this.mouseClickHandler(this, event)});
    }

    // Game Loop Management
    private _isPlaying: boolean = false;
    private _currentMillis: number = 0;
    private _deltaTime: number = 0;
    isNeedToUpdate: boolean = true;
    
    private _gameLoopUpdate(time: number){
        // Calculation deltaTime
        this._deltaTime = time - this._currentMillis;
        this._currentMillis = time;
        // Update
        const tickEvent: TickEvent = {
            deltaTime: (this._deltaTime/1000),
            game: this
        }
        for (const gameObject of this.gameObjects) {
            if (!gameObject.enabled)
                continue;
            try{
                gameObject.Update(tickEvent);
            }catch (e: any){
                console.warn(`Problem with executing Update @ ${gameObject.constructor.name} [${gameObject.id}]`);
                console.log(gameObject);
                console.error(e.stack);
            }
        }
        // Fixed Update
        for (const gameObject of this.gameObjects) {
            if (!gameObject.enabled)
                continue;
            try{
                gameObject.FixedUpdate(tickEvent);
            }catch (e: any){
                console.warn(`Problem with executing FixedUpdate @ ${gameObject.constructor.name} [${gameObject.id}]`);
                console.warn(gameObject);
                console.error(e.stack);
            }
        }
    }

    private _gameLoopDraw(){
        if (this.isNeedToUpdate){
            this.renderer.clearFrame();
            const drawEvent: DrawEvent = {
                renderer: this.renderer,
                game: this
            }
            this.emit('draw', drawEvent);
            for (const gameObject of this.gameObjects) {
                if (!gameObject.enabled)
                    continue;
                if(!(gameObject instanceof DrawableGameObject))
                    continue;
                try{
                    gameObject.OnDraw(drawEvent);
                    if(gameObject instanceof ClickableGameObject){
                        const clickable = gameObject as ClickableGameObject
                        this.renderer.drawHitbox(clickable);
                    }
                }catch (e: any){
                    console.warn(`Problem with executing draw @ ${gameObject.constructor.name} `, gameObject);
                    console.error(e.stack);
                }
            }
            this.isNeedToUpdate = false;
        }
    }

    private readonly _gameLoop = (time: number) => { 
        this._gameLoopUpdate(time);
        if(!document.hasFocus() && !this.gameSettings.refreshWhenUnfocused){
            if (this._isPlaying)
                window.requestAnimationFrame(this._gameLoop);
            return;
        }
        this._gameLoopDraw();
        // Continue loop
        if (this._isPlaying)
                window.requestAnimationFrame(this._gameLoop);
    };

    /**
     * Tells the game it needs to be redrawn.
     * Call it when some visible objects has been changed.
     */
    Update(){
        this.isNeedToUpdate = true;
    }

    /**
     * Starts new game loop
     */
    StartGameLoop(){
        if(this._isPlaying) {
            console.warn("Cannot start new game loop when the game loop exists.")
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
    StopGameLoop(){
        console.warn("Stopped the game loop! Restarting the game loop will cause a time skip.");
        this._isPlaying = false;
    }

    /**
     * Starts the game loop and emit `start` ({@link GameEvent}) event.
     */
    Start(){
        this.StartGameLoop();
        this.emit('start', { game: this });
    }

    /**
     * Starts loading game resources and returns response as event.
     * @returns The callback
     */
    LoadGameAndStart(): Callback{
        const callback = new Callback();
        const whenLoaded = () => {
            this.Start();
            callback.execThen();
        }
        setTimeout(() => {
            this.on('loadAllResources', whenLoaded);
            this.LoadAllResources();
        }, 1);
        return callback;
    }

    // Signals
    private readonly _signals: Signals = new Signals();
    emit = (channel: string, event: GameEvent) => this._signals.emit(channel, event);
    /**
     * Appends listener to event channel.
     * @param channel The listener event channel.
     * @param callback Executed function after receiving a signal on given channel.
     */
    on = (channel: string, callback: (event: GameEvent) => void) => this._signals.on(channel, callback);

    // Resources
    resources: Map<string, Resource> = new Map();
    private _isLoadedAllResources: boolean = false;
    
    /**
     * Loads resource with resource manager.
     * @param type The resource type
     * @param uid The resource unique key
     * @param path The resource path
     */
    LoadResource(type: 'image', uid: string, path: string){
        if(type === 'image'){
            this.resources.set(uid, {
                uid: uid,
                type: type,
                path: path,
                object: undefined,
                loaded: false
            });
        }else{
            throw new Error("Unknown resource type.");
        }
        this.LoadAllResources();
    }
    /**
     * Creates {@link HTMLImageElement} from path.
     * @param path The image path
     * @returns The image element
     */
    CreateImage(path: string): HTMLImageElement{
        const img = new Image();
        img.src = path;
        return img;
    }
    /**
     * Gets the resource by unique resource key.
     * @param uid The unique resource key.
     * @returns The resource
     */
    GetResource(uid: string): Resource{
        const res = this.resources.get(uid);
        if(res === undefined)
            throw new Error("Resource not loaded!");
        return res;
    }
    /**
     * Gets the image resource by unique resource key.
     * @param uid The unique resource key.
     * @returns The image
     */
    GetImage(uid: string): object | undefined{
        const res = this.GetResource(uid);
        if(res.type !== 'image')
            return undefined;
        if(!res.loaded)
            return undefined;
        return res.object;
    }
    /**
     * Starts loading all resources which is not loaded. Emits {@link GameEvent} at `loadAllResources` channel.
     */
    LoadAllResources(){
        if(this.resources.size === 0){
            this._signals.emit('loadAllResources', { game: this });
            this._isLoadedAllResources = true;
            return;
        }
        let resourcesCount = 0;
        const resourceLoaded = () => {
            resourcesCount -= 1;
            if(resourcesCount === 0){
                if(!this._isLoadedAllResources){
                    this._signals.emit('loadAllResources', { game: this });
                    this._isLoadedAllResources = true;
                }
            }
        };
        this.resources.forEach(resource => {
            if(resource.loaded)
                return;
            if(resource.type === 'image'){
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
            }else{
                // Unknown type
                console.warn(`Type "${resource.type}" is unknown resources type.`);
                return;
            }
            resourcesCount += 1;
        })
    }

    // GameObjects
    /**
     * Sorted game object array
     */
    readonly gameObjects: Array<GameObject> = [];
    /**
     * Sorts all game objects by sorting order property.
     */
    SortGameObjects(){
        this.gameObjects.sort((a, b) => (a.sortingOrder > b.sortingOrder) ? 1 : ((b.sortingOrder > a.sortingOrder) ? -1 : 0));
    }
    /**
     * Adds unique game object to game.
     * @param gameObject The unique game object
     * @returns The added game object
     */
    AddGameObject(gameObject: GameObject): GameObject{
        if(!(gameObject instanceof GameObject))
            throw new Error("Cannot add not GameObject!");
        for(const otherGameObjects of this.gameObjects){
            if(gameObject.id === otherGameObjects.id)
                throw new Error("Cannot add this same GameObject!");
        }
        if(gameObject.name === undefined)
            gameObject.name = gameObject.constructor.name;
        this.gameObjects.push(gameObject);
        this.SortGameObjects();
        const gameObjectSpawnEvent: GameObjectSpawnEvent = {
            game: this,
            gameObjectId: gameObject.id
        }
        gameObject.OnStart(gameObjectSpawnEvent);
        this.emit('spawnedGameObject', gameObjectSpawnEvent);
        return gameObject;
    }
    /**
     * Destroys existed game object by reference
     * @param gameObject The game object reference
     */
    DestroyGameObjectByRef(gameObject: GameObject){
        if(!(gameObject instanceof GameObject))
            throw new Error("Param gameObject must be an GameObject object!");
        const index = this.gameObjects.findIndex((element) => element.id === gameObject.id);
        const onDestroyEvent: GameObjectDestroyEvent = {
            game: this
        }
        this.gameObjects[index].OnDestroy(onDestroyEvent);
        this.gameObjects.splice(index, 1);
        this.SortGameObjects();
    }
    /**
     * Destroys existed game object by unique id
     * @param id The unique id
     */
    DestroyGameObjectById(id: string){
        if(typeof id !== "string")
            throw new Error("Param id must be string!");
        const gameObject = this.GetGameObjectById(id);
        if(gameObject === undefined)
            return;
        const index = this.gameObjects.findIndex((element) => element.id === gameObject.id);
        const onDestroyEvent: GameObjectDestroyEvent = {
            game: this
        }
        this.gameObjects[index].OnDestroy(onDestroyEvent);
        this.gameObjects.splice(index, 1);
        this.SortGameObjects();
    }
    /**
     * Destroys existed game object by index in game objects array
     * @param index The index
     */
    DestroyGameObjectByIndex(index: number){
        if(typeof index !== "number")
            throw new Error("Param index must be number!");
        if(index < 0)
            throw new Error("Index cannot be lower than 0!");
        if(index >= this.gameObjects.length)
            throw new Error("Index cannot be bigger than maximum index!");
        const onDestroyEvent: GameObjectDestroyEvent = {
            game: this
        }
        this.gameObjects[index].OnDestroy(onDestroyEvent);
        this.gameObjects.splice(index, 1);
        this.SortGameObjects();
    }
    /**
     * Gets all existed game objects with type equal to param.
     * @param type The type
     * @returns Array of selected game objects
     */
    GetGameObjectsByType(type: object): Array<GameObject>{
        if(typeof type != 'function' || !(type instanceof Object))
            throw new Error("Type must be an object!");
        const result = [];
        for (const gameObject of this.gameObjects) {
            if(gameObject instanceof type)
                result.push(gameObject);
        }
        return result;
    }
    /**
     * Gets all existed game objects by given name.
     * @param name The name.
     * @returns Array of game objects with given name.
     */
    GetGameObjectsByName(name: string): Array<GameObject>{
        if(typeof name != 'string')
            throw new Error("Name of object must be string!");
        const result = [];
        for (const gameObject of this.gameObjects) {
            if(gameObject.name === name)
                result.push(gameObject);
        }
        return result;
    }
    /**
     * Gets all existed game objects by given tag.
     * @param tag The tag.
     * @returns The array of game objects with given tag.
     */
    GetGameObjectsByTag(tag: string): Array<GameObject>{
        if(typeof tag != 'string')
            throw new Error("Name of object must be string!");
        const result = [];
        for (const gameObject of this.gameObjects) {
            if(gameObject.tag === tag)
                result.push(gameObject);
        }
        return result;
    }
    /**
     * Gets game object by unique id.
     * @param id The unique id
     * @returns The game object
     */
    GetGameObjectById(id: string): GameObject | undefined{
        if(typeof id !== "string")
            throw new Error("Param id must be a string!");
        for(const gameObject of this.gameObjects){
            if(gameObject.id === id)
                return gameObject;
        }
        return undefined;
    }

    // Sounds Management
    /**
     * Plays sound at the page
     * @param path The path to sound file
     * @param loop is looped?
     * @param volume The volume decimal midpoint
     */
    PlaySound(path: string, loop: boolean = false, volume: number = 1){
        const audio = new Audio();
        const src = document.createElement("source");
        src.type = "audio/mpeg";
        src.src = path;
        audio.appendChild(src);
        audio.loop = loop;
        audio.volume = volume;
        audio.play().then();
    }

    // Mouse Management
    mousePos: Vector2 = new Vector2();
    mousePrecisePos: Vector2 = new Vector2();
    mouseClientPos: Vector2 = new Vector2();
    isMousePrimaryButtonDown: boolean = false;
    private constructMouseEvent(): GameMouseEvent{
        const gameMouseEvent: GameMouseEvent = {
            game: this,
            mousePos: this.mousePos,
            mousePrecisePos: this.mousePrecisePos,
            mouseClientPos: this.mouseClientPos,
            isMouseDown: this.isMousePrimaryButtonDown
        }
        return gameMouseEvent; 
    }
    private mouseMoveHandler(game: Game, event: MouseEvent){
        game.mouseClientPos = new Vector2(event.offsetX, event.offsetY);
        const gridPos = game.mouseClientPos.clone();
        const gridSize = game.renderer.gridSize;
        gridPos.divide(gridSize);
        game.mousePrecisePos = gridPos.clone();
        gridPos.floor();
        game.mousePos = gridPos;
        
        game.emit('mouseMove', game.constructMouseEvent());
    }
    private mouseDownHandler(game: Game, event: MouseEvent){
        game.isMousePrimaryButtonDown = true;
        game.emit('mouseDown', game.constructMouseEvent());
    }
    private mouseUpHandler(game: Game, event: MouseEvent){
        game.isMousePrimaryButtonDown = false;
        game.emit('mouseUp', game.constructMouseEvent());
    }
    private mouseClickHandler(game: Game, event: MouseEvent){
        const gameMouseEvent: GameMouseEvent = game.constructMouseEvent()
        for(let i = this.gameObjects.length - 1; i >= 0; i -= 1){
            const gameObject = this.gameObjects[i];
            if(!gameObject.enabled)
                continue;
            if(!(gameObject instanceof ClickableGameObject))
                continue;
            const clickableObj = (gameObject as ClickableGameObject);
            if(clickableObj.transform.scale.x <= 0 || clickableObj.transform.scale.y <= 0)
                continue;
            const minX = clickableObj.transform.position.x;
            const maxX = clickableObj.transform.position.x + clickableObj.transform.scale.x;
            const minY = clickableObj.transform.position.y;
            const maxY = clickableObj.transform.position.y + clickableObj.transform.scale.y;
            const isInRange = IsInRange(game.mousePrecisePos.x, minX, maxX) && IsInRange(game.mousePrecisePos.y, minY, maxY);
            if(isInRange){
                if(clickableObj.OnMouseClick(gameMouseEvent))
                    break;
            }
        }
        game.emit('mouseClick', gameMouseEvent);
    }

    GetRandomPosition(): Vector2{
        return new Vector2(floor(Math.random() * this.grid.x), floor(Math.random() * this.grid.y));
    }
}