import { Shadow } from './Shadow';

export interface DrawSettings {
    fill?: boolean;
    color?: string|CanvasGradient|CanvasPattern;

    border?: boolean;
    borderColor?: string|CanvasGradient|CanvasPattern;
    borderSize?: number;

    angle?: number;
    shadow?: Shadow;
    alpha?: number;
}

export const defaultDrawSettings: DrawSettings = {
    color: '#000000',
    borderColor: '#000000',
    angle: 0,
    fill: true,
    border: false,
    alpha: 1,
    borderSize: 1,
    shadow: {
        color: undefined,
        offsetX: 0,
        offsetY: 0,
        blur: 0
    }
}