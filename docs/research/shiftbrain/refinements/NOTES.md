# Four projects, navigation alignment and portrait placeholder

2026-10-20, user-requested refinements:

- Active Work catalog reduced to four entries. Three standard tiles, then one full-width tile in All. Original header type, grid gaps/heights and Text/Visual transition remain.
- All reference media replaced by four neutral, local SVG placeholders. No original hover clips are loaded for these slots.
- Filters: All / Personal Agent / Work / Game / Video / Skill. Project01 provisionally belongs to Personal Agent and Skill;02 Work;03 Game;04 Video. Original includes-membership logic, filter transitions, query state and mode persistence retained. Filtered results retain original normal-width card behavior.
- Removed the footer's bottom-right WeChat link on Work. About's social section remains.
- Shared Work/About navigation is centered to the viewport, independently of the corner logo and right-side name.
- About left hero has a local3:4 portrait placeholder. Desktop absolute position stays left of the title/prose; mobile is stacked after the title. Replace the image URL in `about/index.html` with the user's photo.

Validation: build and syntax checks passed; native Safari observed three-across/full-width, category switching in Visual/Text, and About portrait. Read-only Safari rendered measurements are in render-checks.json, covering desktop/mobile, both routes, and filter query states. Source original Work CSS remains unchanged; requested span/alignment rules are in the personal stylesheet.
