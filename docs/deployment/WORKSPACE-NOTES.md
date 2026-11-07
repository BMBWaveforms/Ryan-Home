# Ryan — Work / About

[Open Ryan’s website](https://bmbwaveforms.github.io/Ryan-Home/) · [About](https://bmbwaveforms.github.io/Ryan-Home/about/)

Personal website with Work and About pages, based on the requested SHIFTBRAIN reference.

```sh
npm run dev      # http://127.0.0.1:5173/
npm run check
npm run build
npm run preview  # http://127.0.0.1:4173/
```

- `/`: approved Work layout preserved, including Text / Visual transitions, responsive grid, filters and hover transitions. Galaxy Roaming replaces Project 03, with actual gameplay media and a shared detail destination for Visual and Text views. Three placeholders remain; composition is still three across and one full-width below. Filters: Personal Agent, Work, Game, Video, Skill; Galaxy Roaming belongs to Game and Video.
- `/about/`: personal AI-product perspective, four real article links, v1.2 resume-based strengths and experience, a supplied black-and-white portrait, and the Galaxy Roaming hackathon card, WeChat QR, Xiaohongshu and GitHub. No spotlight effect.
- `/?intro=1`: replay the AI PRODUCT. opening. Normal navigation plays it once per browser-tab session. Both pages use the same R SVG.

## Editable content

- `src/data/ryan-content.json`: About copy, articles, resume-based experience and the Galaxy Roaming hackathon entry.
- `src/data/work-placeholders.json`: Work project information, media, memberships and links. `url: null` makes a placeholder non-navigating; set a real URL when adding a project.
- `src/work.js` + `src/components/sites/shiftbrain/work.css`: original Work rendering and styles. The latter is byte-identical to the pre-About backup.
- `src/app.js` + `src/components/sites/ryan/personal.css`: About and shared personal navigation/loader.

Article titles and URLs were supplied by the user; no article-body summaries were invented. Chinese prose and section copy are drafts.

## Backups and verification

Original personal-site backup:
`../方案备份/Vscode-WEB-before-shiftbrain-20261019-233003/`

Completed Work-clone backup, before adding About:
`../方案备份/Vscode-WEB-work-before-about-20261020-001258/`

Reference research is under `docs/research/shiftbrain/`; current About/page measurements are under `docs/research/shiftbrain/about/`. Browser screenshots are in the working conversation, not exported PNG files. `个人主页.html` redirects to the current homepage. `export.mjs` belongs to the previous design; do not run that exporter against this version.

GitHub Pages serves the `main` branch root. `.nojekyll` keeps the ES modules, fonts and assets intact. Publishing status is verified separately during deployment.

## 2026-11-02 local preview

Galaxy Roaming project page: `/projects/galaxy-roaming/`. Work owns the project entry (Visual card and Text row); the About hackathon card is another entrance to the same page. The detail page returns to Work. Shared document/route fades and desktop smooth scrolling, five bounded chapter anchors outside transformed content, opaque fixed header surfaces, actual gameplay hero, responsive image tracks, animated product-decision disclosures and image lightbox. Mobile uses native vertical scrolling. The current layout displays 12 images from the supplied BP, project screenshots and event photographs, including separate work-night/discussion and award albums. Header explanation precedes the large cover; typography and media scale follow the Workflow reference. Content distinguishes personal contribution, team architecture and prototype limits. Interview preparation lives in `docs/galaxy-roaming-interview.md` and is excluded from dist.

## 2026-11-03 Git handoff

The requested version includes resume-based About experience, the linked Galaxy Roaming entry in Work/About, the reusable project-detail template, project imagery and product-focused narrative. Before committing, syntax checks, all 11 tests and the production build passed. Browser layout and interaction checks are recorded in `docs/research/shiftbrain/project-workflow.md`. GitHub Pages follows the main branch root; publication status must be checked separately from a successful Git push.
