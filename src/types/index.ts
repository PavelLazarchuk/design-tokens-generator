export interface ColorShade {
    step: number;
    hex: string;
    rgb: string;
    hsl: string;
    isBase: boolean;
    contrastOnWhite: number;
    contrastOnBlack: number;
}

export interface ColorScale {
    base: string;
    baseStep: number;
    shades: ColorShade[];
}

export interface TypeStep {
    label: string;
    px: number;
    rem: number;
    lineHeight: number;
}

export interface SpacingStep {
    label: string;
    px: number;
    rem: number;
}

export type SpacingMode = 'linear' | 'geometric';

export interface ColorSetting {
    id: string;
    name: string;
    value: string;
    enabled: boolean;
}

export interface Settings {
    colors: ColorSetting[];
    typography: {
        baseSize: number;
        ratio: number;
        stepsUp: number;
        stepsDown: number;
    };
    spacing: {
        baseUnit: number;
        mode: SpacingMode;
    };
}

export type WcagRating = 'AAA' | 'AA' | 'Fail';
