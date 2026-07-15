import type { Settings } from '../../types';
import { RATIO_PRESETS } from '../../lib/typeScale';
import { HexColorInput } from './HexColorInput';

const PRESETS: { name: string; hex: string }[] = [
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Crimson', hex: '#dc2626' },
    { name: 'Emerald', hex: '#059669' },
    { name: 'Amber', hex: '#d97706' },
    { name: 'Sky', hex: '#0284c7' },
    { name: 'Violet', hex: '#7c3aed' },
];

const CUSTOM_RATIO = 'custom';

interface Props {
    settings: Settings;
    onChange: (settings: Settings) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900">{title}</h2>
            <div className="space-y-4">{children}</div>
        </section>
    );
}

function SliderRow({
    label,
    value,
    display,
    min,
    max,
    step = 1,
    onChange,
}: {
    label: string;
    value: number;
    display: string;
    min: number;
    max: number;
    step?: number;
    onChange: (value: number) => void;
}) {
    return (
        <div>
            <div className="mb-1.5 flex items-baseline justify-between">
                <label className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                    {label}
                </label>
                <span className="font-mono text-xs text-zinc-700">{display}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-900"
                aria-label={label}
            />
        </div>
    );
}

function SelectRow({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wide text-zinc-500 uppercase">
                {label}
            </label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="h-9 w-full appearance-none rounded-lg border border-zinc-200 bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_0.75rem_center] bg-no-repeat px-3 pr-8 text-sm text-zinc-800 shadow-sm outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
                aria-label={label}
            >
                {options.map(o => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function ControlsPanel({ settings, onChange }: Props) {
    const { colors, typography, spacing } = settings;

    const setColor = (id: string, patch: Partial<Settings['colors'][number]>) =>
        onChange({
            ...settings,
            colors: colors.map(c => (c.id === id ? { ...c, ...patch } : c)),
        });

    const setTypography = (patch: Partial<Settings['typography']>) =>
        onChange({ ...settings, typography: { ...typography, ...patch } });

    const setSpacing = (patch: Partial<Settings['spacing']>) =>
        onChange({ ...settings, spacing: { ...spacing, ...patch } });

    const primary = colors.find(c => c.id === 'primary');
    const disabled = colors.filter(c => !c.enabled);
    const matchedPreset = RATIO_PRESETS.find(p => p.value === typography.ratio);

    return (
        <div className="space-y-4">
            <Section title="Colors">
                <div>
                    <p className="mb-1.5 text-xs font-medium tracking-wide text-zinc-500 uppercase">
                        Try a preset
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {PRESETS.map(preset => (
                            <button
                                key={preset.hex}
                                type="button"
                                onClick={() =>
                                    primary && setColor('primary', { value: preset.hex })
                                }
                                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                                    primary?.value === preset.hex
                                        ? 'border-zinc-900 bg-zinc-900 text-white'
                                        : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'
                                }`}
                            >
                                <span
                                    className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                                    style={{ backgroundColor: preset.hex }}
                                />
                                {preset.name}
                            </button>
                        ))}
                    </div>
                </div>

                {colors
                    .filter(c => c.enabled)
                    .map(color => (
                        <HexColorInput
                            key={color.id}
                            label={color.name}
                            value={color.value}
                            onChange={hex => setColor(color.id, { value: hex })}
                            onRemove={
                                color.id === 'primary'
                                    ? undefined
                                    : () => setColor(color.id, { enabled: false })
                            }
                        />
                    ))}

                {disabled.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {disabled.map(color => (
                            <button
                                key={color.id}
                                type="button"
                                onClick={() => setColor(color.id, { enabled: true })}
                                className="rounded-lg border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-700"
                            >
                                + {color.name}
                            </button>
                        ))}
                    </div>
                )}
            </Section>

            <Section title="Typography">
                <SliderRow
                    label="Base size"
                    value={typography.baseSize}
                    display={`${typography.baseSize}px`}
                    min={12}
                    max={24}
                    onChange={baseSize => setTypography({ baseSize })}
                />
                <SelectRow
                    label="Scale ratio"
                    value={matchedPreset ? String(matchedPreset.value) : CUSTOM_RATIO}
                    options={[
                        ...RATIO_PRESETS.map(p => ({
                            value: String(p.value),
                            label: `${p.name} — ${p.value}`,
                        })),
                        { value: CUSTOM_RATIO, label: 'Custom…' },
                    ]}
                    onChange={v => {
                        if (v !== CUSTOM_RATIO) setTypography({ ratio: Number(v) });
                        else setTypography({ ratio: 1.3 });
                    }}
                />
                {!matchedPreset && (
                    <SliderRow
                        label="Custom ratio"
                        value={typography.ratio}
                        display={typography.ratio.toFixed(2)}
                        min={1.05}
                        max={2}
                        step={0.01}
                        onChange={ratio => setTypography({ ratio })}
                    />
                )}
                <SliderRow
                    label="Steps above base"
                    value={typography.stepsUp}
                    display={String(typography.stepsUp)}
                    min={2}
                    max={8}
                    onChange={stepsUp => setTypography({ stepsUp })}
                />
            </Section>

            <Section title="Spacing">
                <SliderRow
                    label="Base unit"
                    value={spacing.baseUnit}
                    display={`${spacing.baseUnit}px`}
                    min={2}
                    max={12}
                    onChange={baseUnit => setSpacing({ baseUnit })}
                />
                <SelectRow
                    label="Progression"
                    value={spacing.mode}
                    options={[
                        { value: 'linear', label: 'Linear' },
                        { value: 'geometric', label: 'Geometric (×1.5)' },
                    ]}
                    onChange={mode => setSpacing({ mode: mode as Settings['spacing']['mode'] })}
                />
            </Section>
        </div>
    );
}
