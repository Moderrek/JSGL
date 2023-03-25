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

    get positionCenter(){
        const x = this.position.x + ( this.scale.x / 2 );
        const y = this.position.y + ( this.scale.y / 2);
        return new Vector2(x, y);
    }

    getRotation(): number{
        this.normalizeRotation();
        return this.rotation;
    }

    setRotation(value: number){
        this.rotation = value;
    }
    rotate(value: number){
        this.rotation += value;
        this.normalizeRotation();
    }
    normalizeRotation(){
        if(this.rotation >= 360)
            this.rotation = this.rotation % 360;
    }
    getRadians(): number{
        this.normalizeRotation();
        return this.rotation * Math.PI / 180;
    }

    getScale(): Vector2{
        return this.scale;
    }
    getScaleX(): number{
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
    add(v: Vector2){
        this.position.x += v.x;
        this.position.y += v.y;
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

    move(v: Vector2){
        this.position.x += v.x * Math.cos(this.getRadians());
        this.position.y += v.y * Math.sin(this.getRadians());
    }

    clone(): Transform{
        return new Transform(this.position.x, this.position.y, this.scale.x, this.scale.y, this.rotation);
    }

}