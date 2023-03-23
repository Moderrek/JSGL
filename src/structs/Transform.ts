import { Vector2 } from "./Vector2";

export class Transform{
    position;
    scale;
    rotation;

    constructor(posX: number, posY: number, scaleX: number, scaleY: number, rotation: number = 0) {
        this.position = new Vector2(posX, posY);
        this.scale = new Vector2(scaleX, scaleY);
        this.rotation = rotation;
    }

    public getRotation(): number{
        return this.rotation;
    }

    public setRotation(value: number): void{
        this.rotation = value;
    }

    public rotate(value: number): void{
        this.rotation += value;
    }
    public normalizeRotation(): void{
        this.rotation = this.rotation % 360;
    }
    public getRadians(): number{
        this.normalizeRotation();
        return this.rotation * 0.01745;
    }

    getScale(){
        return this.scale;
    }
    getScaleX(){
        return this.scale.x;
    }
    setScaleX(x: number){
        this.scale.x = x;
        return this;
    }
    getScaleY(){
        return this.scale.y;
    }
    setScaleY(y: number){
        this.scale.y = y;
        return this;
    }

    getPosition(){
        return this.position;
    }
    getX(){
        return this.position.x;
    }
    setX(x: number){
        this.position.x = x;
        return this;
    }
    addX(x: number){
        this.position.x += x;
        return this;
    }
    getY() {
        return this.position.y;
    }
    setY(y: number){
        this.position.y = y;
        return this;
    }
    addY(y: number){
        this.position.y += y;
        return this;
    }

}