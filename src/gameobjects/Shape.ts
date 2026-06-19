import ClickableGameObject from '@/gameobjects/ClickableGameObject';

import { DrawSettings, defaultDrawSettings } from '@/structs/DrawSettings';
import ShapeType from '@/enums/ShapeType';

import type DrawEvent from '@/events/DrawEvent';

/**
 * Represents drawable, clickable shape on canvas
 * @group Game Objects
 */
export class Shape extends ClickableGameObject {
    public type: ShapeType = ShapeType.Rect;
    public properties: DrawSettings = Object.create(defaultDrawSettings);

    public override OnDraw(event: DrawEvent) {
        if (this.type === ShapeType.Rect) {
            event.renderer.drawRectangle(
                this.transform.position.x,
                this.transform.position.y,
                this.transform.scale.x,
                this.transform.scale.y,
                this.properties,
            );
        } else if (this.type === ShapeType.Circle) {
            event.renderer.drawCircle(
                this.transform.position.x,
                this.transform.position.y,
                Math.max(this.transform.scale.x, this.transform.scale.y),
                this.properties,
            );
        }
    }
}

export default Shape;
