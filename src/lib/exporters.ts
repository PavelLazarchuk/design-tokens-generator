import type { ColorScale, SpacingStep, TypeStep } from '../types';

export interface TokenSet {
    colors: Record<string, ColorScale>;
    typography: TypeStep[];
    spacing: SpacingStep[];
}

export type ExportFormat = 'css' | 'tailwind' | 'json';

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export function toCssVariables({ colors, typography, spacing }: TokenSet): string {
    const lines: string[] = [':root {'];

    for (const [name, scale] of Object.entries(colors)) {
        lines.push(`  /* ${name} */`);
        for (const shade of scale.shades) {
            lines.push(`  --color-${slug(name)}-${shade.step}: ${shade.hex};`);
        }
        lines.push('');
    }

    lines.push('  /* typography */');

    for (const step of typography) {
        lines.push(`  --text-${step.label}: ${step.rem}rem;`);
        lines.push(`  --text-${step.label}--line-height: ${step.lineHeight};`);
    }

    lines.push('');
    lines.push('  /* spacing */');

    for (const step of spacing) {
        lines.push(`  --spacing-${step.label}: ${step.rem}rem;`);
    }

    lines.push('}');

    return lines.join('\n') + '\n';
}

export function toTailwindConfig({ colors, typography, spacing }: TokenSet): string {
    const indent = (n: number) => '  '.repeat(n);
    const lines: string[] = ['/** @type {import("tailwindcss").Config} */', 'export default {'];

    lines.push(`${indent(1)}theme: {`);
    lines.push(`${indent(2)}extend: {`);
    lines.push(`${indent(3)}colors: {`);

    for (const [name, scale] of Object.entries(colors)) {
        lines.push(`${indent(4)}${JSON.stringify(slug(name))}: {`);

        for (const shade of scale.shades) {
            lines.push(`${indent(5)}${shade.step}: '${shade.hex}',`);
        }

        lines.push(`${indent(4)}},`);
    }

    lines.push(`${indent(3)}},`);
    lines.push(`${indent(3)}fontSize: {`);

    for (const step of typography) {
        lines.push(
            `${indent(4)}${JSON.stringify(step.label)}: ['${step.rem}rem', { lineHeight: '${step.lineHeight}' }],`
        );
    }

    lines.push(`${indent(3)}},`);
    lines.push(`${indent(3)}spacing: {`);

    for (const step of spacing) {
        lines.push(`${indent(4)}${JSON.stringify(step.label)}: '${step.rem}rem',`);
    }

    lines.push(`${indent(3)}},`);
    lines.push(`${indent(2)}},`);
    lines.push(`${indent(1)}},`);
    lines.push('}');

    return lines.join('\n') + '\n';
}

export function toJsonTokens({ colors, typography, spacing }: TokenSet): string {
    const out = {
        colors: Object.fromEntries(
            Object.entries(colors).map(([name, scale]) => [
                slug(name),
                Object.fromEntries(
                    scale.shades.map(s => [s.step, { hex: s.hex, rgb: s.rgb, hsl: s.hsl }])
                ),
            ])
        ),
        typography: Object.fromEntries(
            typography.map(s => [s.label, { px: s.px, rem: s.rem, lineHeight: s.lineHeight }])
        ),
        spacing: Object.fromEntries(spacing.map(s => [s.label, { px: s.px, rem: s.rem }])),
    };
    return JSON.stringify(out, null, 2) + '\n';
}

export function exportTokens(format: ExportFormat, tokens: TokenSet): string {
    switch (format) {
        case 'css':
            return toCssVariables(tokens);
        case 'tailwind':
            return toTailwindConfig(tokens);
        case 'json':
            return toJsonTokens(tokens);
    }
}
