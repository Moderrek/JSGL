import { DrawSettings, defaultDrawSettings } from '../structs/DrawSettings';
import { ShapeType } from '../enums/ShapeType';
import { Shape } from './Shape';

/**
 * @group Game Objects
 */
export class SimpleShape extends Shape {
  public constructor(shapeType: ShapeType, drawSettings?: DrawSettings) {
    super();
    this.type = shapeType;
    if (drawSettings !== undefined)
      this.properties = { ...defaultDrawSettings, ...drawSettings };
  }
}
