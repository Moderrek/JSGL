import { DrawSettings, defaultDrawSettings } from '../drawing/DrawSettings';
import { ShapeType } from "../enums/ShapeType";
import { Shape } from "./Shape";

export class SimpleShape extends Shape{

    constructor(shapeType: ShapeType, drawSettings?: DrawSettings){
        super();
        this.type = shapeType;
        if(drawSettings !== undefined)
            this.properties = {...defaultDrawSettings, ...drawSettings};
    }

}