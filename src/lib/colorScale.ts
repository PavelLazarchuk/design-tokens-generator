import { oklch, formatHex, formatRgb, formatHsl, clampChroma, type Oklch } from 'culori';

import { getContrastRatio } from './contrast';
import type { ColorScale, ColorShade } from '../types';

export const DEFAULT_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const LIGHTNESS_ANCHORS: ReadonlyArray<readonly [step: number, l: number]> = [
    [0, 1],
    [50, 0.98],
    [100, 0.955],
    [200, 0.915],
    [300, 0.855],
    [400, 0.74],
    [500, 0.62],
    [600, 0.54],
    [700, 0.47],
    [800, 0.4],
    [900, 0.33],
    [950, 0.26],
    [1000, 0.16],
];

const LIGHT_END = 0.985;
const DARK_END = 0.22;

const clampToRgbGamut = (color: Oklch) => clampChroma(color, 'oklch');

export function referenceLightness(step: number): number {
    const first = LIGHTNESS_ANCHORS[0];
    const last = LIGHTNESS_ANCHORS[LIGHTNESS_ANCHORS.length - 1];
    if (step <= first[0]) return first[1];
    if (step >= last[0]) return last[1];
    for (let i = 1; i < LIGHTNESS_ANCHORS.length; i++) {
        const [s1, l1] = LIGHTNESS_ANCHORS[i];
        if (step <= s1) {
            const [s0, l0] = LIGHTNESS_ANCHORS[i - 1];
            const t = (step - s0) / (s1 - s0);
            return l0 + t * (l1 - l0);
        }
    }
    return last[1];
}

function chromaMultiplier(l: number, baseL: number): number {
    if (l > baseL) {
        const span = LIGHT_END + 0.01 - baseL;
        if (span <= 0) return 1;
        const t = Math.min(1, (l - baseL) / span);
        return 1 - 0.68 * t ** 1.3;
    }
    if (l < baseL) {
        const span = baseL;
        if (span <= 0) return 1;
        const t = Math.min(1, (baseL - l) / span);
        return 1 - 0.25 * t ** 1.3;
    }
    return 1;
}

export function generateColorScale(baseColor: string, steps: number[] = DEFAULT_STEPS): ColorScale {
    const base = oklch(baseColor);
    if (!base) throw new Error(`Invalid base color: ${baseColor}`);
    if (steps.length === 0) throw new Error('steps must not be empty');

    const sorted = [...steps].sort((a, b) => a - b);
    const baseL = base.l;
    const baseC = base.c;

    let baseStep = sorted[0];
    let bestDelta = Infinity;
    for (const step of sorted) {
        const delta = Math.abs(referenceLightness(step) - baseL);
        if (delta < bestDelta) {
            bestDelta = delta;
            baseStep = step;
        }
    }
    const baseRefL = referenceLightness(baseStep);

    const lightRefEnd = referenceLightness(sorted[0]);
    const darkRefEnd = referenceLightness(sorted[sorted.length - 1]);
    const lightTarget = Math.max(baseL, LIGHT_END);
    const darkTarget = Math.min(baseL, DARK_END);

    const targetLightness = (step: number): number => {
        if (step === baseStep) return baseL;

        const refL = referenceLightness(step);

        if (refL > baseRefL) {
            const span = lightRefEnd - baseRefL;

            if (span <= 0) return baseL;

            const t = (refL - baseRefL) / span;

            return baseL + t * (lightTarget - baseL);
        }

        const span = baseRefL - darkRefEnd;

        if (span <= 0) return baseL;

        const t = (baseRefL - refL) / span;

        return baseL - t * (baseL - darkTarget);
    };

    const shades: ColorShade[] = sorted.map(step => {
        const isBase = step === baseStep;
        const l = targetLightness(step);
        const color: Oklch = isBase
            ? base
            : { mode: 'oklch', l, c: baseC * chromaMultiplier(l, baseL), h: base.h };
        const inGamut = clampToRgbGamut(color);
        const hex = formatHex(inGamut);

        return {
            step,
            hex,
            rgb: formatRgb(inGamut),
            hsl: formatHsl(inGamut),
            isBase,
            contrastOnWhite: round2(getContrastRatio(hex, '#ffffff')),
            contrastOnBlack: round2(getContrastRatio(hex, '#000000')),
        };
    });

    return { base: formatHex(base), baseStep, shades };
}

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}
