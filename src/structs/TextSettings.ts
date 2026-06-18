/**
 * @group Structs
 * Represents settings for rendering text.
 * @example
 * const textSettings: TextSettings = {
 *     content: 'Hello, World!',
 *     font: '20px Arial',
 *     color: '#ff0000',
 * };
 */
export type TextSettings = {
    /** Text content to render */
    content?: string;
    /** CSS font property (e.g., '20px Arial') */
    font?: string;
    /** CSS color property (e.g., '#ff0000') */
    color?: string;
};

/**
 * Default text settings with empty content, default font, and black color.
 * This can be used as a base for creating custom text settings.
 * @example
 * const customTextSettings: TextSettings = {
 *     ...defaultTextSettings,
 *     content: 'Custom Text',
 *     font: '18px Verdana',
 *     color: '#00ff00',
 * };
 */
export const defaultTextSettings: TextSettings = {
    content: '',
    font: '16px sans-serif',
    color: '#000000',
};

export default TextSettings;
