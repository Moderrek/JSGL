import { TextSettings } from '../structs/TextSettings';
import { GameObject } from './GameObject';
export class TextGameObject extends GameObject{
    style: TextSettings;

    set text(content: string){
        this.style.content = content;
    }

}