import { useState } from 'react';

import { normalizeHex } from '../../lib/hex';

interface Props {
    label: string;
    value: string;
    onChange: (hex: string) => void;
    onRemove?: () => void;
}

export function HexColorInput({ label, value, onChange, onRemove }: Props) {
    const [draft, setDraft] = useState(value);
    const [lastValue, setLastValue] = useState(value);

    if (value !== lastValue) {
        setLastValue(value);

        if (normalizeHex(draft) !== value) setDraft(value);
    }

    const invalid = normalizeHex(draft) === null;

    const handleText = (text: string) => {
        setDraft(text);

        const hex = normalizeHex(text);

        if (hex) onChange(hex);
    };

    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                    {label}
                </label>
                {onRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-xs text-zinc-400 transition-colors hover:text-red-500"
                    >
                        Remove
                    </button>
                )}
            </div>
            <div className="flex items-center gap-2">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-black/10">
                    <input
                        type="color"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        className="absolute inset-0 h-full w-full"
                        aria-label={`${label} color picker`}
                    />
                </div>
                <input
                    type="text"
                    value={draft}
                    onChange={e => handleText(e.target.value)}
                    onBlur={() => setDraft(value)}
                    spellCheck={false}
                    className={`h-9 w-full rounded-lg border bg-white px-3 font-mono text-sm text-zinc-800 shadow-sm outline-none transition-colors focus:ring-2 ${
                        invalid
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200'
                    }`}
                    aria-label={`${label} hex value`}
                    aria-invalid={invalid}
                />
            </div>
            {invalid && <p className="mt-1 text-xs text-red-500">Enter a valid hex color</p>}
        </div>
    );
}
