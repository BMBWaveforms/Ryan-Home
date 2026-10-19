# Personal adaptation — 2026-10-20

Source `/about/` → local `/about/`, owned by `about/index.html`, `src/app.js`, `src/components/sites/ryan/personal.css`, `src/data/ryan-content.json`.

Existing source `/` → local `/` and `?view=text`, owned by `index.html`, restored `src/work.js`, original unchanged `src/components/sites/shiftbrain/work.css`, editable `src/data/work-placeholders.json`.

The Work clone was backed up before editing (see previous-version.txt). Following the user's correction, the added homepage poster, resized headline, and extra intro line were removed; the original grid, dimensions, filters, Text layout and motions were restored. Original media remain as placeholders, with generic project information and no project destination until a real URL is supplied. Only confirmed shared identity/navigation/slogan/loading copy and personal footer copy differ from the Work backup.

## Personal About content

1. Human needs. / AI possibilities. — editable title, three paragraphs on AI product work.
2. Writing — four exact user-supplied titles and URLs, classified by topic from their titles.
3. Experience — fictional sample career and personal-learning entries, visibly labeled.
4. Hackathons — illustrative 48-hour project, visibly labeled.
5. Find me — official supplied WeChat QR, user-supplied Xiaohongshu link, GitHub.

No source studio team, awards, offices, company record, showreel or careers content is presented as Ryan's. No pointer spotlight or original WebGL title layer is implemented. Static faint ambient gradients remain. Latin TT Norms fonts are the same local assets as Work; Chinese text uses system fallback.

## Observed comparison

Safari source: 1440px desktop, first screen, Showreel, OurTeam, Company Profile; 720px narrow first screen. Safari local: both routes, desktop and narrow, section scrolling, WeChat expand/collapse, Work filter Independent, Text/Visual switching, mobile menu route navigation. Captures are in the conversation.

The source's typography layer is a bitmap texture; the local personal heading is editable HTML with original TT Norms font instead. Lower sections are deliberately new personal compositions, following the reference's spacing and scroll feel, not copies of its content. Locomotive lerp .1 desktop; native narrow scrolling; one-time fade/up reveals, with reduced-motion fallback. No scroll-lock sequence or copied company material.

## Verification

- `npm run check`, `npm run build` passed.
- Original Work stylesheet SHA256 compared equal to the pre-About backup.
- `render-checks.json`: actual Safari iframe rendering at About 320/390/1440/1920 and Work 320/390/1440, including Text state. No document overflow or recorded runtime errors. Work desktop headline returned to50px and mobile30px; all99 original placeholder slots present.
- Native Safari production preview: Work menu to About works, anchor to Writing works, desktop filter returns two Independent slots, original Text columns render correctly.
- Opening wordmark AI PRODUCT. observed; R appears consistently in both routes and loading symbol.
- Article destinations matched to the four user-provided URLs; article bodies/outbound article pages were not opened during this task.

Not deployed to GitHub Pages. No physical phone testing. The `?intro=1` option replays the opening for review; ordinary same-session navigation skips the repeated four-second loader.
