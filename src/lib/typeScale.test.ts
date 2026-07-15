import { describe, expect, it } from 'vitest';

import { generateTypeScale, suggestedLineHeight } from './typeScale';

describe('generateTypeScale', () => {
    it('generates base plus the requested steps up and down', () => {
        const scale = generateTypeScale(16, 1.25, 5, 2);
        expect(scale.map(s => s.label)).toEqual([
            'xs',
            'sm',
            'base',
            'lg',
            'xl',
            '2xl',
            '3xl',
            '4xl',
        ]);
    });

    it('multiplies by the ratio per step', () => {
        const scale = generateTypeScale(16, 1.25, 2, 1);
        const byLabel = Object.fromEntries(scale.map(s => [s.label, s]));
        expect(byLabel.base.px).toBe(16);
        expect(byLabel.lg.px).toBe(20);
        expect(byLabel.xl.px).toBe(25);
        expect(byLabel.sm.px).toBeCloseTo(12.8, 2);
    });

    it('outputs rem relative to a 16px root', () => {
        const scale = generateTypeScale(16, 1.333, 3, 2);
        for (const step of scale) {
            expect(step.rem).toBeCloseTo(step.px / 16, 3);
        }
    });

    it('suggests tighter line-height for larger sizes', () => {
        const scale = generateTypeScale(16, 1.618, 4, 2);
        for (let i = 1; i < scale.length; i++) {
            expect(scale[i].lineHeight).toBeLessThanOrEqual(scale[i - 1].lineHeight);
        }
    });

    it('handles ratio 1 by producing a flat scale instead of crashing', () => {
        const scale = generateTypeScale(16, 1, 3, 2);
        expect(new Set(scale.map(s => s.px))).toEqual(new Set([16]));
    });

    it('rejects nonsense input', () => {
        expect(() => generateTypeScale(0, 1.25, 3)).toThrow();
        expect(() => generateTypeScale(16, -1, 3)).toThrow();
    });
});

describe('suggestedLineHeight', () => {
    it('stays within [1.1, 1.6]', () => {
        expect(suggestedLineHeight(8)).toBeLessThanOrEqual(1.6);
        expect(suggestedLineHeight(120)).toBeGreaterThanOrEqual(1.1);
        expect(suggestedLineHeight(16)).toBe(1.5);
    });
});
