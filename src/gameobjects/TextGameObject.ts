import { TextSettings } from '../structs/TextSettings';
import { GameObject } from './GameObject';

export class TextGameObject extends GameObject {
  style: TextSettings | undefined;

  set text(content: string) {
    if (this.style !== undefined) this.style.content = content;
  }
}
