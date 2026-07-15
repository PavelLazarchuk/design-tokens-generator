import type { SpacingStep } from '../../types';

export function SpacingScalePreview({ scale, accent }: { scale: SpacingStep[]; accent: string }) {
    return (
        <div className="space-y-2 rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            {scale.map(step => (
                <div key={step.label} className="flex items-center gap-4">
                    <span className="w-6 shrink-0 text-right font-mono text-xs font-semibold text-zinc-800">
                        {step.label}
                    </span>
                    <span className="w-28 shrink-0 font-mono text-[10px] text-zinc-400">
                        {step.px}px · {step.rem}rem
                    </span>
                    <div className="min-w-0 flex-1">
                        <div
                            className="h-4 rounded-sm"
                            style={{
                                width: `min(100%, ${step.px}px)`,
                                minWidth: '2px',
                                backgroundColor: accent,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
