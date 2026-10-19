# SHIFTBRAIN Work reconstruction

Source: https://shiftbrain.com/ . Observation date: 2026-10-19, Asia/Shanghai.

## Scope and routes

| Source | Local | Owned implementation |
| --- | --- | --- |
| `/` (Visual) | `/` | `index.html`, `src/app.js`, `src/components/sites/shiftbrain/work.css` |
| `/?view=text` | `/?view=text` | Same route and editable catalog |
| `?work_category=brand/global/independent/promotion/recruit/media` | Same query | Local filtering of original first-party memberships |
| `?lang=en` | Same query | English project overviews and language control |
| `/work/<slug>/` | Original external destination | Detail pages are outside the requested Work scope |
| About / Workflow / Contact / Case Study / social / maps | Original external destinations | Existing destination links preserved |

The Human tab and its dedicated experience are omitted as requested. All99 source Work entries remain available in both included modes. New authored double-line R monogram replaces the original symbol in the corner, favicon and loading symbol. Original project content and images remain source reference content.

## Layout evidence

Desktop source observed in Safari at1440px and narrow layout at720px. Work entry originally begins215px from page top at1440. Gutters2.5vw desktop,15px below1024. H1 is50px at1440 with explicit linebreak and TTNormsExtraLight; mobile30px TTNormsLight. At1920 the H1 caps at62.5px.

Visual has3columns above768px and2below; original pickup projects span two columns in All only, and full width on mobile. Desktop image height36.8vw, mobile53.86vw, cover crop. Original52 clips load on interaction, restart at0 and fade over their associated still. Titles overlay images on hover at desktop, but stay below on mobile.

Text has5columns at>=1024 with source proportions21.05/13.15/15.78/15.78/34.21 percent. Project titles20px; source LatinLight face. On mobile, order becomes project, overview, date, outputs, role. Touch metadata uses separators. Hover devices reduce rows to.5opacity, hovered/focused row1.

Footer includes both offices, original links and socials. Mode bar retreats when the footer enters the viewport.

## Motion evidence and implementation

Source controller evidence is in `assets/MOTION.md`. The source production bundles and CSS are kept under `source/` or `assets/` for inspection only; the local app does not load them.

- Locomotive Scroll v4.1.4 is an ordinary packaged dependency; same v4-style API as observed, desktop smooth withlerp.1, native mobile/tablet below1024. The precise source patch version is unavailable.
- Text/Visual:700ms cubic-bezier(.55,.05,.22,.99), horizontal background sweep and reverse inner translation preserve content's apparent position. Switching returns to top over800ms with matching curve.
- White fixed pill uses two differently timed indicators (.5s/.9s), a600ms stretch and source geometry adapted from3tabs to2.
- Entry loader recreates the4s wordmark/symbol sequence. R replaces the small symbol. Reduced motion skips the loader and the large transitions.
- Filters retain native query state and animate out/replace/in. Accordion animates its measured height on narrow screens. Keyboard arrows select modes andEscape closes menu/filter controls.

## Assets and limits

`src/data/shiftbrain-projects.json` is editable local data. Original files and source mappings are in `assets/manifest.json`.99images,52hover clips and4fonts are local. Video preload is disabled and interaction triggers loading. Original wordmark and symbol are archived locally; new R SVG remains editable.

Japanese source body font is additionally served by Realtype. That remote font was not repackaged; Japanese text uses the site's fallback system font stack. Latin families and punctuation font are original local files. Native screenshots in the working conversation capture source/local desktop, narrow layouts and active transitions; browser measurement reports are in `verification/render-checks.json`. No physical device testing.

During source inspection, direct reload of its filtered Independent URL returned a server-side PHP error. The clone intentionally supports direct query loading from the local catalog.
