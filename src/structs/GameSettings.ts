import { ImageQuality } from '../enums/ImageQuality';
import { Vector2 } from './Vector2';

/**
 * The {@link Game} settings.
 * @group Settings
 */
export type GameSettings = {
    canvas?: HTMLCanvasElement;
    grid?: Vector2;
    /**
     * Is canvas auto resized to parent element size?
     */
    autoResize?: boolean;
    refreshWhenUnfocused?: boolean;
    canvasImageQuality?: ImageQuality;
    drawAlways?: boolean;
}

/**
 * The {@link Game} default settings.
 */
export const defaultGameSettings: GameSettings = {
    canvas: undefined,
    grid: new Vector2(4, 3),
    autoResize: true,
    refreshWhenUnfocused: true,
    canvasImageQuality: ImageQuality.High,
    drawAlways: true
};