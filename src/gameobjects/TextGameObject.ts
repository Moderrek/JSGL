import GameObject from '@/gameobjects/GameObject';

import type TextSettings from '@/structs/TextSettings';

export class TextGameObject extends GameObject {
    style: TextSettings | undefined = undefined;

    set text(content: string) {
        if (this.style !== undefined) 
            this.style.content = content;
    }
}

export default TextGameObject;
