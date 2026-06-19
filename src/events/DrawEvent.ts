import GameEvent from '@/events/GameEvent';

import type Renderer from '@/drawing/Renderer';

/**
 * Event emitted during the draw phase of the game loop.
 * Contains a reference to the game instance and the renderer.
 * 
 * @group Game Events
 * 
 */
export type DrawEvent = GameEvent & {
    /**
     * Renderer reference for drawing operations
     */
    renderer: Renderer;
};

export default DrawEvent;
