import type { ColorScale, WcagRating } from '../../types';
import { getWcagRating } from '../../lib/contrast';

function ContrastBadge({ on, ratio }: { on: 'white' | 'black'; ratio: number }) {
    const rating: WcagRating = getWcagRating(ratio);
    const pass = rating !== 'Fail';
    return (
        <span
            title={`${on === 'white' ? 'White' : 'Black'} text on this shade: ${ratio.toFixed(2)}:1`}
            className={`inline-flex items-center gap-1 rounded px-1 py-px font-mono text-[9px] leading-none font-semibold ${
                pass ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-400'
            }`}
        >
            <span
                className={`inline-block h-1.5 w-1.5 rounded-full ring-1 ring-black/15 ${
                    on === 'white' ? 'bg-white' : 'bg-black'
                }`}
            />
            {pass ? rating : '—'}
        </span>
    );
}

export function ColorScalePreview({ name, scale }: { name: string; scale: ColorScale }) {
    return (
        <div>
            <div className="mb-2 flex items-baseline gap-2">
                <h3 className="text-sm font-semibold text-zinc-900">{name}</h3>
                <span className="font-mono text-xs text-zinc-400">
                    base {scale.base} → {scale.baseStep}
                </span>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
                {scale.shades.map(shade => (
                    <div key={shade.step} className="bg-white">
                        <div
                            className="relative h-16"
                            style={{ backgroundColor: shade.hex }}
                            title={`${shade.rgb}\n${shade.hsl}`}
                        >
                            {shade.isBase && (
                                <span
                                    className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full"
                                    style={{
                                        backgroundColor:
                                            shade.contrastOnWhite < 3 ? 'black' : 'white',
                                        boxShadow:
                                            shade.contrastOnWhite < 3
                                                ? '0 0 0 2px rgba(255,255,255,.35)'
                                                : '0 0 0 2px rgba(0,0,0,.25)',
                                    }}
                                    title="Your base color"
                                />
                            )}
                        </div>
                        <div className="space-y-1 border-t border-zinc-100 px-1.5 py-2 text-center">
                            <p className="text-[11px] font-semibold text-zinc-800">{shade.step}</p>
                            <p className="font-mono text-[10px] text-zinc-500 uppercase">
                                {shade.hex}
                            </p>
                            <div className="flex justify-center gap-1">
                                <ContrastBadge on="white" ratio={shade.contrastOnWhite} />
                                <ContrastBadge on="black" ratio={shade.contrastOnBlack} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
