import { useMemo } from 'react';

import type { ColorScale, Settings } from './types';
import { generateColorScale } from './lib/colorScale';
import { generateTypeScale } from './lib/typeScale';
import { generateSpacingScale } from './lib/spacingScale';
import type { TokenSet } from './lib/exporters';
import { useLocalStorage } from './hooks/useLocalStorage';
import { normalizeHex } from './lib/hex';
import { ControlsPanel } from './components/controls/ControlsPanel';
import { ColorScalePreview } from './components/preview/ColorScalePreview';
import { TypeScalePreview } from './components/preview/TypeScalePreview';
import { SpacingScalePreview } from './components/preview/SpacingScalePreview';
import { ExportPanel } from './components/ExportPanel';

const STORAGE_KEY = 'design-tokens-generator:settings';

const DEFAULT_SETTINGS: Settings = {
    colors: [
        { id: 'primary', name: 'Primary', value: '#6366f1', enabled: true },
        { id: 'secondary', name: 'Secondary', value: '#059669', enabled: false },
        { id: 'neutral', name: 'Neutral', value: '#6b7280', enabled: true },
    ],
    typography: { baseSize: 16, ratio: 1.25, stepsUp: 5, stepsDown: 2 },
    spacing: { baseUnit: 4, mode: 'linear' },
};

/** Validate a stored settings payload; null falls back to defaults. */
function validateSettings(raw: unknown): Settings | null {
    if (typeof raw !== 'object' || raw === null) return null;

    const s = raw as Settings;

    if (!Array.isArray(s.colors) || s.colors.length === 0) return null;
    if (!s.colors.every(c => c && typeof c.value === 'string' && normalizeHex(c.value)))
        return null;

    const t = s.typography;

    if (!t || typeof t.baseSize !== 'number' || typeof t.ratio !== 'number') return null;
    if (t.baseSize <= 0 || t.ratio <= 0) return null;

    const sp = s.spacing;

    if (!sp || typeof sp.baseUnit !== 'number' || sp.baseUnit <= 0) return null;
    if (sp.mode !== 'linear' && sp.mode !== 'geometric') return null;

    return s;
}

function SectionHeading({ title, hint }: { title: string; hint: string }) {
    return (
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
            <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
            <p className="text-xs text-zinc-400">{hint}</p>
        </div>
    );
}

export default function App() {
    const [settings, setSettings] = useLocalStorage(
        STORAGE_KEY,
        DEFAULT_SETTINGS,
        validateSettings
    );

    const colorScales = useMemo(() => {
        const scales: { id: string; name: string; scale: ColorScale }[] = [];

        for (const color of settings.colors) {
            if (!color.enabled) continue;

            try {
                scales.push({
                    id: color.id,
                    name: color.name,
                    scale: generateColorScale(color.value),
                });
            } catch {
                // empty
            }
        }

        return scales;
    }, [settings.colors]);

    const typeScale = useMemo(
        () =>
            generateTypeScale(
                settings.typography.baseSize,
                settings.typography.ratio,
                settings.typography.stepsUp,
                settings.typography.stepsDown
            ),
        [settings.typography]
    );

    const spacingScale = useMemo(
        () => generateSpacingScale(settings.spacing.baseUnit, settings.spacing.mode),
        [settings.spacing]
    );

    const tokens: TokenSet = useMemo(
        () => ({
            colors: Object.fromEntries(colorScales.map(({ name, scale }) => [name, scale])),
            typography: typeScale,
            spacing: spacingScale,
        }),
        [colorScales, typeScale, spacingScale]
    );

    const accent = colorScales[0]?.scale.shades.find(s => s.step === 500)?.hex ?? '#18181b';

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900">
                    Design Tokens Generator
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-zinc-500">
                    Pick a base color and type settings — get a perceptually uniform OKLCH shade
                    scale, a modular type scale, and spacing tokens, ready for CSS, Tailwind, or
                    JSON.
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                <aside className="lg:sticky lg:top-8 lg:self-start">
                    <ControlsPanel settings={settings} onChange={setSettings} />
                </aside>

                <main className="min-w-0 space-y-10">
                    <section>
                        <SectionHeading
                            title="Color scales"
                            hint="OKLCH lightness interpolation · badges = WCAG contrast for white/black text"
                        />
                        <div className="space-y-6">
                            {colorScales.map(({ id, name, scale }) => (
                                <ColorScalePreview key={id} name={name} scale={scale} />
                            ))}
                        </div>
                    </section>

                    <section>
                        <SectionHeading
                            title="Type scale"
                            hint={`base ${settings.typography.baseSize}px · ratio ${settings.typography.ratio}`}
                        />
                        <TypeScalePreview scale={typeScale} />
                    </section>

                    <section>
                        <SectionHeading
                            title="Spacing"
                            hint={`base unit ${settings.spacing.baseUnit}px · ${settings.spacing.mode}`}
                        />
                        <SpacingScalePreview scale={spacingScale} accent={accent} />
                    </section>

                    <section>
                        <SectionHeading
                            title="Export"
                            hint="copy tokens straight into your project"
                        />
                        <ExportPanel tokens={tokens} />
                    </section>
                </main>
            </div>
        </div>
    );
}
