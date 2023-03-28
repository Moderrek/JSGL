import { RotationStyle } from '../enums/RotationStyle';
import { Shadow } from './Shadow';

/**
 * Represents renderer properties
 */
export interface DrawSettings {
    /**
     * Should the shape have a fill?
     */
    fill?: boolean;
    /**
     * Shape fill color
     */
    color?: string|CanvasGradient|CanvasPattern;

    /**
     * Should the shape have a border?
     */
    border?: boolean;
    /**
     * Shape border color
     */
    borderColor?: string|CanvasGradient|CanvasPattern;
    /**
     * Shape border size
     */
    borderSize?: number;
    /**
     * Rotation of shape in degrees
     */
    angle?: number;
    /**
     * Shadow settings for shape
     */
    shadow?: Shadow;
    /**
     * Alpha decimal midpoint
     */
    alpha?: number;
    /**
     * Rotation style
     */
    rotationStyle?: RotationStyle
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
        color: '',
        offsetX: 0,
        offsetY: 0,
        blur: 0
    },
    rotationStyle: RotationStyle.allAround
}