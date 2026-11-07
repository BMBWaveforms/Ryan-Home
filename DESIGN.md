# Ryan — Work / About design

## Boundaries

Preserve the approved Work design. Only confirmed navigation, slogan, personal identifiers, opening wordmark and placeholder content change. The original `work.css` is unchanged. About adds a scoped personal stylesheet and separate route/entry script.

## Shared

TT Norms local original fonts, consistent double-line R in the upper-left corner and opening, two-link Work / About navigation. First-session opening says `AI PRODUCT.`. Reduced-motion preferences skip it. Desktop uses Locomotive Scroll 4.1.4 with lerp .1; narrow layouts use native scrolling.

## Work

Original three-column desktop / two-column mobile visual composition, original image dimensions, pickup spans, filter memberships, hover previews and Text / Visual wipe. No new homepage poster or resized headline. Slogan:

> Exploring What AI Can Do.
> Building What People Can Use.

Four entries retain the three-across and one-full-width composition. Galaxy Roaming replaces the third placeholder and appears in Game and Video filters. Its cover uses a black canvas matching the product, one complete screenshot of the actual dark node editor and Agent panel, and restrained off-white Chinese / gray English typography below. At card widths of 240px and below the English line is omitted; the Chinese title stays at least 20px. The screen keeps its original 2880:1800 ratio at all widths, with a subtle dark border and no colored mat or decorative shadow. Desktop hover retains the site's original caption overlay and fades the cover heading to avoid duplicate titles. Optional `cover.style: product` selects this treatment; ordinary covers retain the original rendering. Its Visual card and Text row open the same project page as the About hackathon card. Three neutral placeholders remain without destinations. No reference studio work is claimed as Ryan's.

## About

Dark #121212, oversized light typography, lower-right prose (36.84% wide desktop), generous spacing. The reference's pointer spotlight/WebGL title is intentionally omitted; a subtle static ambient background remains. Large title is real editable text rather than the original SIGHT RENEWAL texture.

The About headline is “Product thinking. / Hands-on building.” Introductory prose translates the v1.2 resume into three strengths: field research and prioritization, Agent/data/evaluation delivery, and design plus frontend prototyping. The supplied black-and-white portrait keeps its complete square frame, with no crop, and follows the existing left-column desktop / stacked mobile placement. Mobile headline size scales from 34px to preserve the two-line composition.

Sequence: personal strengths → Experience → Writing → Hackathons → Find me. Article list uses a numbered editorial rhythm. Experience is a quiet timeline, hackathon a large typographic panel, social entrances are two columns. Experience follows the personal resume; the hackathon card features Galaxy Roaming and links to its project page.

Content rises 35px and fades over 1–1.2 seconds when entering the viewport, once; reverse scrolling keeps it readable. No scroll locking or horizontal scroll scene. Source OurTeam/Awards/Company/Careers content is not cloned.

Mobile: 15px gutter, stacked sections, 80%-width prose aligned right, compact article titles, two-link full-screen navigation. Main content remains available when reduced motion is enabled.

## Project detail

This is the shared template for every project, with Galaxy Roaming as the first case. The shared shell lives in `templates/project-page.html`; individual copy/media/chapters live in `content/projects/<slug>/`. Chapter count and narrative are free-form. Layout and motion changes apply to every case through the common CSS/runtime; the router recognizes each project slug automatically. See `docs/project-page-template.md` for authoring.

`/projects/galaxy-roaming/` follows the supplied Workflow screenshots and measured live reference. The desktop title is 50px, chapter titles 32px with light CJK weight, and body / secondary labels 14px at 1.8 line height. Those roles cap at 62.5 / 40 / 17.5px on wide displays. At 1440px, the story begins at x396, copy and keywords use 504px, and media uses 600px with 100px gallery gaps. Mobile retains 32px chapter titles and 14px / 24.5px copy, with 90%-width media. Tokens in the shared `project.css` control this hierarchy for every case.

The header reads as title, explanation aligned to the lower right, then the large actual gameplay image; facts sit below the image. Every main chapter pairs concise narration and gray keywords with relevant media. Single images, image comparisons and galleries share the same width. Personal contribution includes product definition, context and Harness design, frontend interaction, visual design and HUD; full responsibilities and team collaboration remain expandable after the desktop/phone comparison. Product decisions retain five expandable discussions, including future story-edit controls. Current behavior and proposed work are distinct.

The closing pairs the overnight hotel / on-site discussion story with three photos, then the unexpected first-prize announcement with two award photos. The page has twelve images, including the large gameplay cover. Sources are the user's project materials and photos. R identity, Work/About navigation, dark background and personal footer stay consistent with the site. The shared route fade, reveal timings and Locomotive controller remain in use; new media and facts participate in the existing reveals. The fixed index sits outside transformed content, with opaque header and mobile chapter surfaces preventing bleed. Mobile uses native scrolling and a horizontal chapter bar.
