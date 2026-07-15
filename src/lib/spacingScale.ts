import type { SpacingMode, SpacingStep } from '../types';

const LINEAR_MULTIPLIERS = [0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24];

const GEOMETRIC_RATIO = 1.5;
const GEOMETRIC_COUNT = 11;

export function generateSpacingScale(baseUnit: number, mode: SpacingMode): SpacingStep[] {
    if (baseUnit <= 0) throw new Error('baseUnit must be positive');

    const pxValues =
        mode === 'linear'
            ? LINEAR_MULTIPLIERS.map(m => baseUnit * m)
            : Array.from({ length: GEOMETRIC_COUNT }, (_, i) => baseUnit * GEOMETRIC_RATIO ** i);

    return pxValues.map((raw, i) => {
        const px = Math.round(raw * 100) / 100;

        return {
            label: String(i + 1),
            px,
            rem: Math.round((px / 16) * 1000) / 1000,
        };
    });
}
