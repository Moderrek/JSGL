import { Vector2 } from "./structs/Vector2";
import { Signals } from "./signals/Signals";
import { GameEvent } from "./events/GameEvent";
import { Resource } from "./structs/Resource";
import { Callback } from "./signals/Callback";
import { Drawer } from './drawing/Drawer';
import { GameObject } from './gameobjects/GameObject';
import { Sprite } from "./gameobjects/Sprite";
import { IsInRange } from "./Utils";

export interface GameSettings {
    canvas?: HTMLCanvasElement;
    grid?: Vector2;
    autoResize?: boolean;
    refreshWhenUnfocused?: boolean;
}

const defaultGameSettings: GameSettings = {
    canvas: undefined,
    grid: new Vector2(4, 3),
    autoResize: true,
    refreshWhenUnfocused: true
};

export class Game{
    // Properties
    readonly canvas: HTMLCanvasElement;
    renderer: Drawer = new Drawer();
    readonly grid: Vector2;
    gameSettings: GameSettings = undefined;

    // Constructor
    constructor(gameSettings: GameSettings){
        this.gameSettings = { ...defaultGameSettings, ...gameSettings };
        this.canvas = gameSettings.canvas;
        this.grid = gameSettings.grid;
        this.renderer.handler = this;
        this.registerCanvasEvents();
        if(this.gameSettings.autoResize){
            window.addEventListener('resize', () => {
                this.renderer.resizeCanvas();
            });
        }
    }

    // Canvas
    RescaleCanvasToParentElement(percentage: number): Vector2{
        this.renderer.canvasParentSize = percentage;
        this.renderer.resizeCanvas();
        return this.renderer.canvasSize;
    }
    registerCanvasEvents(){
        this.canvas.addEventListener('mousemove', (event) => {this.mouseMoveHandler(this, event)});
        document.addEventListener('mouseup', (event) => {this.mouseUpHandler(this, event)});
        document.addEventListener('mousedown', (event) => {this.mouseDownHandler(this, event)});
        this.canvas.addEventListener('click', (event) => {this.mouseClickHandler(this, event)});
    }

    // Game Loop Management
    _isPlaying: boolean = false;
    _currentMilis: number = 0;
    _deltaTime: number = 0;
    isNeedToUpdate: boolean = true;
    
    gameLoopUpdate(time: number){
        // Calculation deltaTime
        this._deltaTime = time - this._currentMilis;
        this._currentMilis = time;
        // Update
        for (const gameObject of this.gameObjects) {
            if (!gameObject.enabled)
                return;
            try{
                gameObject.Update({ deltaTime: this._deltaTime, game: this });
            }catch (e){
                console.warn(`Problem with executing Update @ ${gameObject.constructor.name} [${gameObject.id}]`);
                console.log(gameObject);
                console.error(e.stack);
            }
        }
        // Fixed Update
        for (const gameObject of this.gameObjects) {
            if (!gameObject.enabled)
                return;
            try{
                gameObject.FixedUpdate({ deltaTime: this._deltaTime, game: this });
            }catch (e){
                console.warn(`Problem with executing FixedUpdate @ ${gameObject.constructor.name} [${gameObject.id}]`);
                console.warn(gameObject);
                console.error(e.stack);
            }
        }
        // Draw
        if (this.isNeedToUpdate) {
            this.renderer.clearFrame();
            this.emit('draw', {});
            for (const gameObject of this.gameObjects) {
                if (!gameObject.enabled)
                    return;
                try{
                    gameObject.OnDraw({ renderer: this.renderer, game: this});
                }catch (e){
                    console.warn(`Problem with executing draw @ ${gameObject.constructor.name} [${gameObject.id}]`);
                    console.warn(gameObject);
                    console.error(e.stack);
                }

            }
            this.isNeedToUpdate = false;
        }
    }

    readonly gameLoop = (time: number) => { 
        if(!document.hasFocus() && !this.gameSettings.refreshWhenUnfocused){
            if (this._isPlaying)
                window.requestAnimationFrame(this.gameLoop);
            return;
        }
        this.gameLoopUpdate(time);
        // Continue loop
        if (this._isPlaying)
                window.requestAnimationFrame(this.gameLoop);
    };

    Update(){
        this.isNeedToUpdate = true;
    }

    startGameLoop(){
        if(this._isPlaying) {
            console.warn("Cannot start new game loop when the game loop exists.")
            return;
        }
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(this.gameLoop.bind(this));
            this._isPlaying = true;
        });
    }
    stopGameLoop(){
        console.warn("Stopped the game loop! Restarting the game loop will cause a time skip.");
        this._isPlaying = false;
    }

    Start(){
        this.startGameLoop();
        this.emit('start', {});
    }

    LoadGameAndStart(): Callback{
        let callback = new Callback();
        const game = this;
        const whenLoaded = () => {
            game.Start();
            callback.execThen();
        }
        game.on('loadAllResources', whenLoaded);
        game.LoadAllResources();
        return callback;
    }

    // Signals
    readonly _signals: Signals = new Signals();
    emit = (channel: string, event: GameEvent) => this._signals.emit(channel, event);
    on = (channel: string, callback: (event: GameEvent) => void) => this._signals.on(channel, callback);

    // Resources
    resources: Map<string, Resource> = new Map();
    _isLoadedAllResources: boolean = false;
    
    LoadResource(type: string, uid: string, path: string){
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
    CreateImage(path: string): HTMLImageElement{
        const img = new Image();
        img.src = path;
        return img;
    }
    GetResource(uid: string): Resource{
        return this.resources.get(uid);
    }
    GetImage(uid: string): object{
        const res = this.GetResource(uid);
        if(res.type !== 'image')
            return undefined;
        if(!res.loaded)
            return undefined;
        return res.object;
    }
    LoadAllResources(){
        console.log(this.resources.size);
        if(this.resources.size === 0){
            console.log("Loaded")
            this._signals.emit('loadAllResources', {});
            console.log("emitted");
            this._isLoadedAllResources = true;
            return;
        }
        let resourcesCount = 0;
        const resourceLoaded = () => {
            resourcesCount -= 1;
            if(resourcesCount === 0){
                if(!this._isLoadedAllResources){
                    this._signals.emit('loadAllResources', {});
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
    gameObjects: Array<GameObject> = [];
    sortGameObjects(){
        this.gameObjects.sort((a, b) => (a.sortingOrder > b.sortingOrder) ? 1 : ((b.sortingOrder > a.sortingOrder) ? -1 : 0));
    }
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
        this.sortGameObjects();
        gameObject.OnStart({ game: this });
        return gameObject;
    }
    DestroyGameObjectByRef(gameObject: GameObject){
        if(!(gameObject instanceof GameObject))
            throw new Error("Param gameObject must be an GameObject object!");
        const index = this.gameObjects.findIndex((element) => element.id === gameObject.id);
        this.gameObjects[index].OnDestroy({ game: this });
        this.gameObjects.splice(index, 1);
        this.sortGameObjects();
    }
    DestroyGameObjectById(id: string){
        if(typeof id !== "string")
            throw new Error("Param id must be string!");
        const gameObject = this.GetGameObjectById(id);
        const index = this.gameObjects.findIndex((element) => element.id === gameObject.id);
        this.gameObjects[index].OnDestroy({ game: this });
        this.gameObjects.splice(index, 1);
        this.sortGameObjects();
    }
    DestroyGameObjectByIndex(index: number){
        if(typeof index !== "number")
            throw new Error("Param index must be number!");
        if(index < 0)
            throw new Error("Index cannot be lower than 0!");
        if(index >= this.gameObjects.length)
            throw new Error("Index cannot be bigger than maximum index!");
        this.gameObjects[index].OnDestroy({ game: this });
        this.gameObjects.splice(index, 1);
        this.sortGameObjects();
    }
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
    GetGameObjectById(id: string): GameObject{
        if(typeof id !== "string")
            throw new Error("Param id must be a string!");
        for(const gameObject of this.gameObjects){
            if(gameObject.id === id)
                return gameObject;
        }
        return undefined;
    }

    // Sounds Management
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
    mousePos: Vector2;
    mousePrecisePos: Vector2;
    mouseClientPos: Vector2;
    isMousePrimaryButtonDown: boolean;
    mouseMoveHandler(game: Game, event: MouseEvent){
        game.mouseClientPos = new Vector2(event.offsetX, event.offsetY);
        const gridPos = game.mouseClientPos.clone();
        const gridSize = game.renderer.gridSize;
        gridPos.divide(gridSize);
        game.mousePrecisePos = gridPos.clone();
        gridPos.floor();
        game.mousePos = gridPos;
        game.emit('mouseMove', {
            mousePos: game.mousePos,
            mousePrecisePos: game.mousePrecisePos,
            mouseClientPos: game.mouseClientPos,
            isMouseDown: game.isMousePrimaryButtonDown
        });
    }
    mouseDownHandler(game: Game, event: MouseEvent){
        game.isMousePrimaryButtonDown = true;
        game.emit('mouseDown', {
            mousePos: game.mousePos,
            mousePrecisePos: game.mousePrecisePos,
            mouseClientPos: game.mouseClientPos,
            isMouseDown: game.isMousePrimaryButtonDown
        });
    }
    mouseUpHandler(game: Game, event: MouseEvent){
        game.isMousePrimaryButtonDown = false;
        game.emit('mouseUp', {
            mousePos: game.mousePos,
            mousePrecisePos: game.mousePrecisePos,
            mouseClientPos: game.mouseClientPos,
            isMouseDown: game.isMousePrimaryButtonDown
        });
    }
    mouseClickHandler(game: Game, event: MouseEvent){
        const gameMouseEvent = {
            mousePos: game.mousePos,
            mousePrecisePos: game.mousePrecisePos,
            mouseClientPos: game.mouseClientPos,
            isMouseDown: game.isMousePrimaryButtonDown
        };
        for(let i = this.gameObjects.length - 1; i >= 0; i -= 1){
            const gameObject = this.gameObjects[i];
            if(!gameObject.enabled)
                continue;
            if(gameObject instanceof Sprite && !gameObject.visible)
                continue;
            if(gameObject.transform.scale.x <= 0 || gameObject.transform.scale.y <= 0)
                continue;
            const minX = gameObject.transform.position.x;
            const maxX = gameObject.transform.position.x + gameObject.transform.scale.x;
            const minY = gameObject.transform.position.y;
            const maxY = gameObject.transform.position.y + gameObject.transform.scale.y;
            const isInRange = IsInRange(game.mousePrecisePos.x, minX, maxX) && IsInRange(game.mousePrecisePos.y, minY, maxY);
            if(isInRange){
                if((gameObject as Sprite).OnMouseClick(gameMouseEvent)){
                    break;
                }
            }
        }
        game.emit('mouseClick', gameMouseEvent);
    }
}