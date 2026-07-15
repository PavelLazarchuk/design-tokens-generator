import { rgb } from 'culori';

import type { WcagRating } from '../types';

/**
 * WCAG 2.x relative luminance of an sRGB color.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function relativeLuminance(color: string): number {
    const c = rgb(color);
    if (!c) throw new Error(`Invalid color: ${color}`);

    const linearize = (channel: number) =>
        channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;

    return 0.2126 * linearize(c.r) + 0.7152 * linearize(c.g) + 0.0722 * linearize(c.b);
}

/**
 * WCAG contrast ratio between two colors, in the range [1, 21].
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function getContrastRatio(fg: string, bg: string): number {
    const l1 = relativeLuminance(fg);
    const l2 = relativeLuminance(bg);
    const [lighter, darker] = l1 >= l2 ? [l1, l2] : [l2, l1];

    return (lighter + 0.05) / (darker + 0.05);
}

/** Rating for normal-size text: AAA >= 7, AA >= 4.5. */
export function getWcagRating(ratio: number): WcagRating {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';

    return 'Fail';
}
