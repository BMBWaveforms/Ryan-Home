# Ryan — Work / About

[Open Ryan’s website](https://bmbwaveforms.github.io/Ryan-Home/) · [About](https://bmbwaveforms.github.io/Ryan-Home/about/)

Personal website with Work and About pages, based on the requested SHIFTBRAIN reference.

```sh
npm run dev      # http://127.0.0.1:5173/
npm run check
npm run build
npm run preview  # http://127.0.0.1:4173/
```

- `/`: approved Work layout preserved, including Text / Visual transitions, responsive grid, filters and hover transitions. Four project placeholders: three across and one full-width below. All images are neutral local placeholders. Filters: Personal Agent, Work, Game, Video, Skill.
- `/about/`: personal AI-product perspective, four real article links, illustrative experience/hackathon content, WeChat QR, Xiaohongshu and GitHub. No spotlight effect.
- `/?intro=1`: replay the AI PRODUCT. opening. Normal navigation plays it once per browser-tab session. Both pages use the same R SVG.

## Editable content

- `src/data/ryan-content.json`: About copy, articles, example experience and hackathon details. Experience and hackathon entries are fictional examples, visibly labeled for replacement.
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
