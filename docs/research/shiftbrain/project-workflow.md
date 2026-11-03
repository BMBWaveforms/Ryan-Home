# Project page / Workflow reference

Source: https://shiftbrain.com/workflow/
Local: /projects/galaxy-roaming/

Reference is used for visual layout only. Local content, R symbol, personal name and Work/About navigation belong to Ryan.

## 2026-11-03 typography and image rhythm alignment

Re-measured the live source at 1440 / 1920 / 390px against the user's two screenshots. At 1440px, the source headline is 50px, chapter titles 32px / 38.4px, description and secondary labels 14px / 25.2px. The title's secondary label has a 25px gap. Description and keywords occupy 504px beginning at x396; a gallery item is 600px wide with a 100px horizontal gap. Header description is 504px wide at x792. At 1920px the source caps the corresponding roles at 62.5px / 40px / 17.5px, with 750px media. Mobile uses 34px headline, 32px chapter title and 14px / 24.5px copy; its 324px image sits in a 360px content area.

The shared project stylesheet now uses these scales and column positions. CJK headings use weight 300 while description and secondary labels stay 400. Header explanation precedes the large cover, with facts below it. Every main chapter now ends its main narration with relevant media; the personal contribution uses a desktop/phone comparison. Detailed responsibilities and product decisions remain expandable. The closing has separate work-night/discussion and award galleries, so each story leads directly into its own photographs. Current page has 12 images in total, including the original large cover; images use actual project assets and preserve their full contents. No reference text, imagery or studio marks were imported.

Alignment verification: `npm run check`, all 11 tests, local build and `git diff --check` passed. Desktop header, chapter and mobile renders were visually inspected. Final browser checks at 320 / 390 / 768 / 900 / 1024 / 1440 / 1920px found no page overflow. Phone image enlargement and Escape close, mobile chapter navigation, independently controlled work-night (3 images) and award (2 images) albums, and Harness disclosure open/close passed. Desktop fragment reload restores the 160px chapter offset with smooth scrolling enabled and no recorded runtime errors. This is a local preview; no deployment.

Observed desktop rules: 2.5% side gutter; body starts at 26.31% of inner width; description occupies 50% of the body column; index has a small current-item dot; landscape gallery cards reveal the next image and use generous horizontal gaps. Header description is right aligned at 36.84% width. Existing local TT Norms fonts are reused.

Owned files: projects/galaxy-roaming/index.html; src/project.js; src/components/sites/ryan/project.css; public/ryan/galaxy-roaming/. Build includes projects/. About card data resides in src/data/ryan-content.json.

Local adaptation: a large project gameplay cover; five content-driven chapters; the shared Locomotive scroll controller and content-only route transitions. Desktop scroll uses the same .1 lerp as Work/About; mobile retains native scrolling. Chapter navigation is mounted outside transformed content and positioned against the story bounds. An opaque header band and opaque mobile chapter bar prevent content bleed. Five technical decisions are initially collapsed and expand over 500ms. Media remains touch/keyboard/button controlled. No source workflow stages, studio branding, client names or source media are included.

Media sources: hero.png is the original platform/screenshots/zero-line-hud-20261025/desktop.png; evidence.png is zero-line-followups-20261025/key-desktop-final.png. editor.jpg and team-award.jpg are from the supplied BP. The two repository screenshots are copied without visual alteration. Existing unused gameplay.jpg remains in assets but is not shown twice.

Content evidence: current implementation at team branch HEAD 34f5aa1; PRODUCT.md, README.md, docs/HUD-NODE-REUSE.md, Player.tsx, shared/hud-kits.mjs, shared/scene-tools.mjs, shared/operations.mjs, server/index.mjs, engine/scripting.ts and CinematicSoundtrack.ts. Interview expansion is in docs/galaxy-roaming-interview.md and excluded from the site build. No claim that all current code was completed during the 72-hour event.

Verification: built locally; desktop, wide and mobile browser render checks; chapter positioning and refresh; gallery and lightbox; About round trip. No deployment.

## 2026-11-03 reference and motion correction

Revisited the live Workflow page at 1440 and 390px. Source desktop content begins at x396 with a 504px description column; the mobile description is 360px, 14px / 24.5px. Source desktop index uses a scroll-pinned element with a bounded target; it is hidden on mobile. The requested local adaptation keeps a horizontal mobile chapter bar.

The local project now uses the same shared document/router, smooth scroll settings, content fade (400ms out, 500ms swap, 800ms in with 300ms delay) and reveal (1s opacity / 1.2s translation) as Work/About. Fixed chapter UI is portaled outside the scroll container; it is cleaned up on route disposal. Direct fragment navigation resets any competing native scroll before restoring the smooth-scroll position.

Spacing changes: desktop body paragraph gaps 32px, subheading gaps 68px, chapter gaps 145–210px; mobile gaps 28px / 55px / 115px. Primary narration is more concise; complete technical explanations remain behind the expandable summaries and in the interview notes. Desktop body keeps the reference half-column proportion. The header and mobile index use solid #121212, with no transparent gap above the chapter bar.

Correction verification: all 8 navigation regressions pass, including repeated Work → project → About → project → Work and direct/reduced-motion/history entry. Browser checks covered desktop smooth scrolling and native mobile scrolling, direct fragment refresh, reverse scrolling with the opaque header, the 500ms disclosure animation, gallery buttons/keyboard, lightbox scroll lock and Escape/focus return. Widths 1920 / 900 / 390 have no page overflow; switching to native scrolling clears Locomotive's leftover section transforms and visibility. No deployment.

## 2026-11-03 product narrative revision

The implementation chapter is now titled 产品判断与取舍 and explains prompts, scene-scoped context, the scene Agent and Harness from the creator's perspective. Future story dependency checks and author control over cross-node changes are explicitly proposed work. Current behavior was checked against the source at HEAD 34f5aa1; it includes automatic draft commit after validation, not per-change author approval.

The closing is based on the user's account of overnight hotel work, energetic on-site discussions and the surprise first-prize announcement. Four event photos replace the single award photo in a second independently controlled gallery. Product screenshots remain a separate two-image gallery. The optional project-gallery--photos modifier preserves a 3:2 photo frame. Source and asset records are in docs/galaxy-roaming-content-sources.md; the earlier four-image count describes the previous version.
