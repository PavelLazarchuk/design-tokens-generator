import type { TypeStep } from '../types';

export interface RatioPreset {
    name: string;
    value: number;
}

export const RATIO_PRESETS: RatioPreset[] = [
    { name: 'Minor Third', value: 1.2 },
    { name: 'Major Third', value: 1.25 },
    { name: 'Perfect Fourth', value: 1.333 },
    { name: 'Golden Ratio', value: 1.618 },
];

const LABELS_DOWN = ['sm', 'xs', '2xs', '3xs'];
const LABELS_UP = ['lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl'];

export const MAX_STEPS_DOWN = LABELS_DOWN.length;
export const MAX_STEPS_UP = LABELS_UP.length;

export function suggestedLineHeight(px: number): number {
    const lh = 1.5 - (px - 16) * 0.011;
    return Math.round(Math.min(1.6, Math.max(1.1, lh)) * 100) / 100;
}

export function generateTypeScale(
    baseSize: number,
    ratio: number,
    stepsUp: number,
    stepsDown = 2
): TypeStep[] {
    if (baseSize <= 0) throw new Error('baseSize must be positive');
    if (ratio <= 0) throw new Error('ratio must be positive');

    const up = Math.min(Math.max(0, Math.floor(stepsUp)), MAX_STEPS_UP);
    const down = Math.min(Math.max(0, Math.floor(stepsDown)), MAX_STEPS_DOWN);

    const makeStep = (label: string, exponent: number): TypeStep => {
        const px = Math.round(baseSize * ratio ** exponent * 100) / 100;

        return {
            label,
            px,
            rem: Math.round((px / 16) * 1000) / 1000,
            lineHeight: suggestedLineHeight(px),
        };
    };

    const below = Array.from({ length: down }, (_, i) =>
        makeStep(LABELS_DOWN[i], -(i + 1))
    ).reverse();
    const above = Array.from({ length: up }, (_, i) => makeStep(LABELS_UP[i], i + 1));

    return [...below, makeStep('base', 0), ...above];
}
