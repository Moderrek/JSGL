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
    canvas: HTMLCanvasElement;
    grid: Vector2;
}

const defaultGameSettings: GameSettings = {
    canvas: undefined,
    grid: new Vector2(1, 1)
};

export class Game{
    // Properties
    public readonly canvas: HTMLCanvasElement;
    public renderer: Drawer = new Drawer();
    public readonly grid: Vector2;

    // Constructor
    constructor(gameSettings: GameSettings){
        this.canvas = gameSettings.canvas === undefined ? defaultGameSettings.canvas : gameSettings.canvas;
        this.grid = gameSettings.grid === undefined ? defaultGameSettings.grid : gameSettings.grid;
        this.renderer.handler = this;
        this.registerCanvasEvents();
    }

    // Canvas
    public RescaleCanvasToParentElement(percentage: number): Vector2{
        this.renderer.canvasParentSize = percentage;
        this.renderer.resizeCanvas();
        return this.renderer.canvasSize;
    }
    private registerCanvasEvents(): void{
        this.canvas.addEventListener('mousemove', (event) => {this.mouseMoveHandler(this, event)});
        document.addEventListener('mouseup', (event) => {this.mouseUpHandler(this, event)});
        document.addEventListener('mousedown', (event) => {this.mouseDownHandler(this, event)});
        this.canvas.addEventListener('click', (event) => {this.mouseClickHandler(this, event)});
    }

    // Game Loop Management
    private _isPlaying: boolean = false;
    private _currentMilis: number = 0;
    private _deltaTime: number = 0;
    public isNeedToUpdate: boolean = true;
    
    private readonly gameLoop = (time: number) => {
        // Calculation deltaTime
        this._deltaTime = time - this._currentMilis;
        this._currentMilis = time;
        // Update
        for (const gameObject of this.gameObjects) {
            if (!gameObject.enabled)
                return;
            try{
                gameObject.Update(this._deltaTime, this);
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
                gameObject.FixedUpdate(this._deltaTime, this);
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
                    gameObject.OnDraw(this.renderer, this);
                }catch (e){
                    console.warn(`Problem with executing draw @ ${gameObject.constructor.name} [${gameObject.id}]`);
                    console.warn(gameObject);
                    console.error(e.stack);
                }

            }
            this.isNeedToUpdate = false;
        }
        // Continue loop
        if (this._isPlaying)
            window.requestAnimationFrame(this.gameLoop);
    };

    public Update(): void{
        this.isNeedToUpdate = true;
    }

    public startGameLoop(): void{
        if(this._isPlaying) {
            console.warn("Cannot start new game loop when the game loop exists.")
            return;
        }
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(this.gameLoop.bind(this));
            this._isPlaying = true;
        });
    }
    public stopGameLoop(): void{
        console.warn("Stopped the game loop! Restarting the game loop will cause a time skip.");
        this._isPlaying = false;
    }

    public Start(): void{
        this.startGameLoop();
        this.emit('start', {});
    }

    public LoadGameAndStart(): Callback{
        let callback = new Callback();
        this.on('loadAllResources', () => {
            this.Start();
            callback.execThen();
        });
        this.LoadAllResources();
        return callback;
    }

    // Signals
    private readonly _signals: Signals = new Signals();
    public emit = (channel: string, event: GameEvent) => this._signals.emit(channel, event);
    public on = (channel: string, callback: Function) => this._signals.on(channel, callback);

    // Resources
    public resources: Map<string, Resource> = new Map();
    private _isLoadedAllResources: boolean = false;
    
    public LoadResource(type: string, uid: string, path: string): void{
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
    public CreateImage(path: string): HTMLImageElement{
        let img = new Image();
        img.src = path;
        return img;
    }
    public GetResource(uid: string): Resource{
        return this.resources.get(uid);
    }
    public GetImage(uid: string): object{
        const res = this.GetResource(uid);
        if(res.type !== 'image')
            return undefined;
        if(!res.loaded)
            return undefined;
        return res.object;
    }
    public LoadAllResources(): void{
        if(this.resources.size == 0)
            if(!this._isLoadedAllResources){
                this._signals.emit('loadAllResources', {});
                this._isLoadedAllResources = true;
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
                let image = new Image();
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
    public gameObjects: Array<GameObject> = [];
    private sortGameObjects(): void{
        this.gameObjects.sort((a, b) => (a.sortingOrder > b.sortingOrder) ? 1 : ((b.sortingOrder > a.sortingOrder) ? -1 : 0));
    }
    public AddGameObject(gameObject: GameObject): GameObject{
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
        gameObject.OnStart(this);
        return gameObject;
    }
    public DestroyGameObjectByRef(gameObject: GameObject): void{
        if(!(gameObject instanceof GameObject))
            throw new Error("Param gameObject must be an GameObject object!");
        let index = this.gameObjects.findIndex((element) => element.id === gameObject.id);
        this.gameObjects[index].OnDestroy(this);
        this.gameObjects.splice(index, 1);
        this.sortGameObjects();
    }
    public DestroyGameObjectById(id: string): void{
        if(typeof id !== "string")
            throw new Error("Param id must be string!");
        let gameObject = this.GetGameObjectById(id);
        let index = this.gameObjects.findIndex((element) => element.id === gameObject.id);
        this.gameObjects[index].OnDestroy(this);
        this.gameObjects.splice(index, 1);
        this.sortGameObjects();
    }
    public DestroyGameObjectByIndex(index: number): void{
        if(typeof index !== "number")
            throw new Error("Param index must be number!");
        if(index < 0)
            throw new Error("Index cannot be lower than 0!");
        if(index >= this.gameObjects.length)
            throw new Error("Index cannot be bigger than maximum index!");
        this.gameObjects[index].OnDestroy(this);
        this.gameObjects.splice(index, 1);
        this.sortGameObjects();
    }
    public GetGameObjectsByType(type: object): Array<GameObject>{
        if(typeof type != 'function' || !(type instanceof Object))
            throw new Error("Type must be an object!");
        let result = [];
        for (const gameObject of this.gameObjects) {
            if(gameObject instanceof type)
                result.push(gameObject);
        }
        return result;
    }
    public GetGameObjectsByName(name: string): Array<GameObject>{
        if(typeof name != 'string')
            throw new Error("Name of object must be string!");
        let result = [];
        for (const gameObject of this.gameObjects) {
            if(gameObject.name === name)
                result.push(gameObject);
        }
        return result;
    }
    public GetGameObjectsByTag(tag: string): Array<GameObject>{
        if(typeof tag != 'string')
            throw new Error("Name of object must be string!");
        let result = [];
        for (const gameObject of this.gameObjects) {
            if(gameObject.tag === tag)
                result.push(gameObject);
        }
        return result;
    }
    public GetGameObjectById(id: string): GameObject{
        if(typeof id !== "string")
            throw new Error("Param id must be a string!");
        for(const gameObject of this.gameObjects){
            if(gameObject.id === id)
                return gameObject;
        }
        return undefined;
    }

    // Sounds Management
    public PlaySound(path: string, loop: boolean = false, volume: number = 1): void{
        let audio = new Audio();
        let src = document.createElement("source");
        src.type = "audio/mpeg";
        src.src = path;
        audio.appendChild(src);
        audio.loop = loop;
        audio.volume = volume;
        audio.play().then();
    }

    // Mouse Management
    public mousePos: Vector2;
    public mouseClientPos: Vector2;
    public isMousePrimaryButtonDown: boolean;
    private mouseMoveHandler(game: Game, event: MouseEvent): void{
        game.mouseClientPos = new Vector2(event.offsetX, event.offsetY);
        let gridPos = game.mouseClientPos.clone();
        const gridSize = game.renderer.gridSize;
        gridPos.divide(gridSize);
        gridPos.floor();
        game.mousePos = gridPos;
        game.emit('mouseMove', {
            mousePos: game.mousePos,
            mouseClientPos: game.mouseClientPos,
            isMouseDown: game.isMousePrimaryButtonDown
        });
    }
    private mouseDownHandler(game: Game, event: MouseEvent): void{
        game.isMousePrimaryButtonDown = true;
        game.emit('mouseDown', {
            mousePos: game.mousePos,
            mouseClientPos: game.mouseClientPos,
            isMouseDown: game.isMousePrimaryButtonDown
        });
    }
    private mouseUpHandler(game: Game, event: MouseEvent): void{
        game.isMousePrimaryButtonDown = false;
        game.emit('mouseUp', {
            mousePos: game.mousePos,
            mouseClientPos: game.mouseClientPos,
            isMouseDown: game.isMousePrimaryButtonDown
        });
    }
    private mouseClickHandler(game: Game, event: MouseEvent): void{
        for(let i = this.gameObjects.length - 1; i >= 0; i -= 1){
            const gameObject = this.gameObjects[i];
            if(!gameObject.enabled)
                continue;
            if(gameObject instanceof Sprite && !gameObject.visible)
                continue;
            if(gameObject.transform.scale.x <= 0 || gameObject.transform.scale.y <= 0)
                continue;
            if(IsInRange(game.mousePos.x, gameObject.transform.position.x, gameObject.transform.position.x + gameObject.transform.scale.x - 1) &&
               IsInRange(game.mousePos.y, gameObject.transform.position.y, gameObject.transform.position.y + gameObject.transform.scale.y - 1)){
                if((gameObject as Sprite).OnMouseClick(game.mousePos, game)){
                    break;
                }
            }
        }
        game.emit('mouseClick', {
            mousePos: game.mousePos,
            mouseClientPos: game.mouseClientPos,
            isMouseDown: game.isMousePrimaryButtonDown
        });
    }
}