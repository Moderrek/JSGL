import { describe, expect, it } from 'vitest';

import Vector2 from '@/structs/Vector2';
import Transform from '@/structs/Transform';

const grid = new Vector2(100, 100);

describe('Transform.ifOnEdgeBounce', () => {
    it('reflects angle on the left edge', () => {
        const transform = new Transform(-1, 10, 10, 10, 30);

        transform.ifOnEdgeBounce(grid);

        expect(transform.position.x).toBe(0);
        expect(transform.position.y).toBe(10);
        expect(transform.eulerAngles).toBe(150);
    });

    it('reflects angle on the top edge', () => {
        const transform = new Transform(10, -1, 10, 10, 30);

        transform.ifOnEdgeBounce(grid);

        expect(transform.position.x).toBe(10);
        expect(transform.position.y).toBe(0);
        expect(transform.eulerAngles).toBe(-30);
    });

    it('reflects angle on a corner hit', () => {
        const transform = new Transform(-1, -1, 10, 10, 30);

        transform.ifOnEdgeBounce(grid);

        expect(transform.position.x).toBe(0);
        expect(transform.position.y).toBe(0);
        expect(transform.eulerAngles).toBe(-150);
    });

    it('does nothing when inside the grid', () => {
        const transform = new Transform(10, 10, 10, 10, 30);

        transform.ifOnEdgeBounce(grid);

        expect(transform.position.x).toBe(10);
        expect(transform.position.y).toBe(10);
        expect(transform.eulerAngles).toBe(30);
    });
});
