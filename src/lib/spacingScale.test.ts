import { describe, expect, it } from 'vitest';

import { generateSpacingScale } from './spacingScale';

describe('generateSpacingScale', () => {
    it('scales linearly with the base unit', () => {
        const scale = generateSpacingScale(4, 'linear');
        expect(scale[0].px).toBe(2); // 0.5 × base
        expect(scale[1].px).toBe(4);
        expect(scale.at(-1)!.px).toBe(96); // 24 × base
    });

    it('grows geometrically in geometric mode', () => {
        const scale = generateSpacingScale(4, 'geometric');
        expect(scale[0].px).toBe(4);
        expect(scale[1].px).toBe(6);
        expect(scale[2].px).toBe(9);
    });

    it('outputs rem relative to a 16px root', () => {
        for (const step of generateSpacingScale(8, 'linear')) {
            expect(step.rem).toBeCloseTo(step.px / 16, 3);
        }
    });

    it('rejects a non-positive base unit', () => {
        expect(() => generateSpacingScale(0, 'linear')).toThrow();
    });
});
