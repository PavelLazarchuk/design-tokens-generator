# Design Tokens Generator

A client-side tool that turns a base color and typography settings into a complete design
token system — color shade scales, a modular type scale, and spacing tokens — exportable
as CSS custom properties, a Tailwind config snippet, or plain JSON.

Everything is computed in the browser. No backend, no API calls, no accounts.

## Highlights

- **Perceptually uniform color scales.** Shades 50–950 are interpolated in OKLCH, not HSL,
  so lightness steps look even and midtones don't go muddy. Hue is held constant across the
  scale and chroma is gamut-mapped back into sRGB by reducing chroma only — no hue drift in
  the light tints.
- **Base color lands exactly on its step.** Your input color is snapped onto the step whose
  reference lightness is closest (step 500 for typical brand colors) and is emitted
  unchanged there.
- **WCAG contrast tagging.** Every shade is checked against white and black text and badged
  AA / AAA.
- **Modular type scale** with ratio presets (Minor Third, Major Third, Perfect Fourth,
  Golden Ratio) or a custom ratio, plus suggested line-heights per step.
- **Spacing scale** from a base unit, linear or geometric.
- **Live preview** — every control updates the swatches, type samples, and export code
  instantly, and your last-used settings persist in localStorage.

## Development

```sh
npm install
npm run dev          # start the dev server
npm test             # unit tests (vitest)
npm run lint         # eslint
npm run format:check # prettier
npm run typecheck    # tsc
npm run build        # production build
```
