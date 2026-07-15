import { parseHex, formatHex } from 'culori';

export function normalizeHex(input: string): string | null {
    const candidate = input.trim().startsWith('#') ? input.trim() : `#${input.trim()}`;
    const parsed = parseHex(candidate);

    return parsed ? formatHex(parsed) : null;
}
