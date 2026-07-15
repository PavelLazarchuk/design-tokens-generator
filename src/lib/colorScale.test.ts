import { describe, expect, it } from 'vitest';
import { oklch } from 'culori';

import { DEFAULT_STEPS, generateColorScale } from './colorScale';
import { getContrastRatio, getWcagRating } from './contrast';

const SATURATED_RED = '#e11d2e';
const MUTED_BLUE = '#5c7899';
const NEAR_GRAY = '#7a7d80';
const INDIGO = '#6366f1';
const ALL = [SATURATED_RED, MUTED_BLUE, NEAR_GRAY, INDIGO];

describe('generateColorScale', () => {
    it('returns all default steps in ascending order', () => {
        const scale = generateColorScale(INDIGO);
        expect(scale.shades.map(s => s.step)).toEqual(DEFAULT_STEPS);
    });

    it('lands the base color exactly on its snapped step', () => {
        for (const color of ALL) {
            const scale = generateColorScale(color);
            const baseShade = scale.shades.find(s => s.isBase);
            expect(baseShade).toBeDefined();
            expect(baseShade!.step).toBe(scale.baseStep);
            expect(baseShade!.hex.toLowerCase()).toBe(color.toLowerCase());
        }
    });

    it('snaps a typical brand color onto step 500', () => {
        expect(generateColorScale(INDIGO).baseStep).toBe(500);
    });

    it('produces strictly decreasing OKLCH lightness from 50 to 950', () => {
        for (const color of ALL) {
            const lightness = generateColorScale(color).shades.map(s => oklch(s.hex)!.l);
            for (let i = 1; i < lightness.length; i++) {
                expect(lightness[i]).toBeLessThan(lightness[i - 1]);
            }
        }
    });

    it('keeps hue stable across the scale (no hue drift at the extremes)', () => {
        for (const color of [SATURATED_RED, MUTED_BLUE, INDIGO]) {
            const baseHue = oklch(color)!.h!;
            const shades = generateColorScale(color).shades;
            for (const shade of shades) {
                const c = oklch(shade.hex)!;

                if (c.c < 0.01 || c.h === undefined) continue;
                const diff = Math.abs(((c.h - baseHue + 540) % 360) - 180);
                expect(diff, `${color} step ${shade.step}`).toBeLessThanOrEqual(3);
            }
        }
    });

    it('keeps a near-grayscale base near-grayscale at every step', () => {
        const shades = generateColorScale(NEAR_GRAY).shades;
        for (const shade of shades) {
            expect(oklch(shade.hex)!.c).toBeLessThan(0.02);
        }
    });

    it('keeps the ends of the scale usable (not white or black)', () => {
        for (const color of ALL) {
            const shades = generateColorScale(color).shades;
            const lightest = oklch(shades[0].hex)!.l;
            const darkest = oklch(shades[shades.length - 1].hex)!.l;
            expect(lightest).toBeLessThan(1);
            expect(lightest).toBeGreaterThan(0.93);
            expect(darkest).toBeGreaterThan(0.1);
            expect(darkest).toBeLessThan(0.35);
        }
    });

    it('snaps extreme near-white and near-black bases to the end steps', () => {
        const light = generateColorScale('#fbf9f7');
        expect(light.baseStep).toBe(50);
        const dark = generateColorScale('#0a0a0c');
        expect(dark.baseStep).toBe(950);

        const darkest = oklch(light.shades[light.shades.length - 1].hex)!.l;
        expect(darkest).toBeLessThan(0.35);
        const lightest = oklch(dark.shades[0].hex)!.l;
        expect(lightest).toBeGreaterThan(0.9);
    });

    it('supports custom step arrays', () => {
        const scale = generateColorScale(INDIGO, [100, 500, 900]);
        expect(scale.shades.map(s => s.step)).toEqual([100, 500, 900]);
    });

    it('rejects invalid input', () => {
        expect(() => generateColorScale('not-a-color')).toThrow();
        expect(() => generateColorScale(INDIGO, [])).toThrow();
    });

    it('tags each shade with contrast ratios against white and black', () => {
        const shades = generateColorScale(INDIGO).shades;
        for (const shade of shades) {
            expect(shade.contrastOnWhite).toBeCloseTo(getContrastRatio(shade.hex, '#fff'), 1);
            expect(shade.contrastOnBlack).toBeCloseTo(getContrastRatio(shade.hex, '#000'), 1);
        }
    });
});

describe('getContrastRatio', () => {
    it('is 21 for black on white and 1 for identical colors', () => {
        expect(getContrastRatio('#000', '#fff')).toBeCloseTo(21, 5);
        expect(getContrastRatio('#fff', '#000')).toBeCloseTo(21, 5);
        expect(getContrastRatio('#808080', '#808080')).toBeCloseTo(1, 5);
    });

    it('matches a known reference value', () => {
        expect(getContrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
    });
});

describe('getWcagRating', () => {
    it('maps ratios to AAA / AA / Fail', () => {
        expect(getWcagRating(7.2)).toBe('AAA');
        expect(getWcagRating(5)).toBe('AA');
        expect(getWcagRating(4.49)).toBe('Fail');
    });
});
