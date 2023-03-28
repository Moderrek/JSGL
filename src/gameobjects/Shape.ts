import { defaultDrawSettings, DrawSettings } from "../drawing/DrawSettings";
import { ShapeType } from "../enums/ShapeType";
import { DrawEvent } from "../events/DrawEvent";
import { ClickableGameObject } from "./ClickableGameObject";

/** 
 * Represents drawable, clickable shape on canvas
 * @group Game Objects 
 */
export class Shape extends ClickableGameObject {
    
    type: ShapeType = ShapeType.Rect;
    properties: DrawSettings = Object.create(defaultDrawSettings);

    override OnDraw(event: DrawEvent){
        if(this.type === ShapeType.Rect){
            event.renderer.drawRectangle(
                this.transform.position.x,
                this.transform.position.y,
                this.transform.scale.x,
                this.transform.scale.y,
                this.properties
            );
        }else if(this.type === ShapeType.Circle){
            event.renderer.drawCircle(
                this.transform.position.x,
                this.transform.position.y,
                Math.max(this.transform.scale.x, this.transform.scale.y),
                this.properties
            );
        }
    }
}