import { useMemo, useState } from 'react';

import { exportTokens, type ExportFormat, type TokenSet } from '../lib/exporters';
import { highlight, type HighlightLang } from '../lib/highlight';

const TABS: { format: ExportFormat; label: string; lang: HighlightLang; file: string }[] = [
    { format: 'css', label: 'CSS Variables', lang: 'css', file: 'tokens.css' },
    { format: 'tailwind', label: 'Tailwind', lang: 'js', file: 'tailwind.config.js' },
    { format: 'json', label: 'JSON', lang: 'json', file: 'tokens.json' },
];

export function ExportPanel({ tokens }: { tokens: TokenSet }) {
    const [active, setActive] = useState<ExportFormat>('css');
    const [copied, setCopied] = useState(false);

    const tab = TABS.find(t => t.format === active)!;
    const code = useMemo(() => exportTokens(active, tokens), [active, tokens]);
    const html = useMemo(() => highlight(code, tab.lang), [code, tab.lang]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // empty
        }
    };

    return (
        <div className="overflow-hidden rounded-xl bg-zinc-900 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
                <div className="flex gap-1" role="tablist" aria-label="Export format">
                    {TABS.map(t => (
                        <button
                            key={t.format}
                            type="button"
                            role="tab"
                            aria-selected={t.format === active}
                            onClick={() => setActive(t.format)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                t.format === active
                                    ? 'bg-white/10 text-white'
                                    : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <span className="hidden font-mono text-[11px] text-zinc-500 sm:block">
                        {tab.file}
                    </span>
                    <button
                        type="button"
                        onClick={copy}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            copied
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : 'bg-white/10 text-zinc-200 hover:bg-white/20'
                        }`}
                    >
                        {copied ? '✓ Copied' : 'Copy'}
                    </button>
                </div>
            </div>
            <pre className="max-h-96 overflow-auto p-4 font-mono text-xs leading-relaxed text-zinc-300">
                <code dangerouslySetInnerHTML={{ __html: html }} />
            </pre>
        </div>
    );
}
