import type { TypeStep } from '../../types';

const SAMPLE = 'The quick brown fox jumps over the lazy dog';

export function TypeScalePreview({ scale }: { scale: TypeStep[] }) {
    const reversed = [...scale].reverse();

    return (
        <div className="divide-y divide-zinc-100 rounded-xl bg-white shadow-sm ring-1 ring-black/5">
            {reversed.map(step => (
                <div key={step.label} className="flex items-center gap-6 px-5 py-3">
                    <div className="w-24 shrink-0 text-right">
                        <p className="font-mono text-xs font-semibold text-zinc-800">
                            {step.label}
                        </p>
                        <p className="font-mono text-[10px] text-zinc-400">
                            {step.px}px · {step.rem}rem
                        </p>
                        <p className="font-mono text-[10px] text-zinc-400">lh {step.lineHeight}</p>
                    </div>
                    <p
                        className="min-w-0 truncate text-zinc-800"
                        style={{ fontSize: `${step.px}px`, lineHeight: step.lineHeight }}
                    >
                        {SAMPLE}
                    </p>
                </div>
            ))}
        </div>
    );
}
