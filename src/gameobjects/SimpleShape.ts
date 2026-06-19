import Shape from '@/gameobjects//Shape';
import { DrawSettings, defaultDrawSettings } from '@/structs/DrawSettings';

import type ShapeType from '@/enums/ShapeType';

/**
 * Simple shape with predefined type and draw settings. Useful for quick prototyping.
 * 
 * @class
 * @group Game Objects
 * @author Tymon Woźniak
 * 
 * @example
 * const myShape = new SimpleShape(ShapeType.Circle, { fillColor: 'red' });
 */
export class SimpleShape extends Shape {

    public constructor(shapeType: ShapeType, drawSettings?: DrawSettings) {
        super();

        this.type = shapeType;

        if (drawSettings !== undefined)
            this.properties = { ...defaultDrawSettings, ...drawSettings };
    }

}

export default SimpleShape;
