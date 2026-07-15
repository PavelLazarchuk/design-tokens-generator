export type HighlightLang = 'css' | 'js' | 'json';

interface Rule {
    re: string;
    cls: string;
}

const RULES: Record<HighlightLang, Rule[]> = {
    css: [
        { re: String.raw`\/\*[\s\S]*?\*\/`, cls: 'tok-comment' },
        { re: String.raw`--[\w-]+(?=\s*:)`, cls: 'tok-key' },
        { re: String.raw`#[0-9a-fA-F]{3,8}\b`, cls: 'tok-string' },
        { re: String.raw`\b\d+(?:\.\d+)?(?:rem|px|em|%)?`, cls: 'tok-number' },
        { re: String.raw`:root`, cls: 'tok-keyword' },
    ],
    js: [
        { re: String.raw`\/\*[\s\S]*?\*\/|\/\/[^\n]*`, cls: 'tok-comment' },
        { re: String.raw`(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")(?=\s*:)`, cls: 'tok-key' },
        { re: String.raw`'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"`, cls: 'tok-string' },
        { re: String.raw`\b(?:export|default|import|const|theme|extend)\b`, cls: 'tok-keyword' },
        { re: String.raw`\b[\w$]+(?=\s*:)`, cls: 'tok-key' },
        { re: String.raw`\b\d+(?:\.\d+)?\b`, cls: 'tok-number' },
    ],
    json: [
        { re: String.raw`"(?:[^"\\]|\\.)*"(?=\s*:)`, cls: 'tok-key' },
        { re: String.raw`"(?:[^"\\]|\\.)*"`, cls: 'tok-string' },
        { re: String.raw`-?\b\d+(?:\.\d+)?\b`, cls: 'tok-number' },
        { re: String.raw`\b(?:true|false|null)\b`, cls: 'tok-keyword' },
    ],
};

const escapeHtml = (s: string) =>
    s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function highlight(code: string, lang: HighlightLang): string {
    const rules = RULES[lang];
    const combined = new RegExp(rules.map(r => `(${r.re})`).join('|'), 'g');

    let html = '';
    let last = 0;

    for (const match of code.matchAll(combined)) {
        html += escapeHtml(code.slice(last, match.index));
        const groupIndex = match.slice(1).findIndex(g => g !== undefined);
        html += `<span class="${rules[groupIndex].cls}">${escapeHtml(match[0])}</span>`;
        last = match.index + match[0].length;
    }

    html += escapeHtml(code.slice(last));

    return html;
}
