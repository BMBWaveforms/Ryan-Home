# Work / About navigation — source comparison and repair

Reference: https://shiftbrain.com/ and https://shiftbrain.com/about/.
Inspected live with native Safari at the same 1440px desktop window, including Work → About and its intermediate/settled frames. Header and logo remain visible when the main content fades. Existing personal content, Work geometry, and the four placeholders are preserved.

First-party implementation evidence (downloaded for inspection only, not imported into the app):
- https://shiftbrain.com/wp-content/themes/my-theme/assets/main.86c1cf14.js: Barba default transition removes the main/footer `in` classes, waits 500ms, swaps the container and adds `in`; scroll controller/lazy-media lifecycle is rebuilt without replacing the document. Uses the Barba prefetch plugin.
- https://shiftbrain.com/wp-content/themes/my-theme/assets/main.de22bbdb.css: main exit opacity 400ms; entrance opacity 800ms with 300ms delay; easing cubic-bezier(.18,.06,.23,1). Footer exit 400ms, entrance 600ms. Wrapper background/color transitions 800ms.

Previous local implementation had two defects: full-document location.assign navigation, and a #main fade selector that missed Work's actual main#work. A static screenshot of the destination did not verify the continuous transition.

## Ownership and route mapping

| Source route | Local route | Content and controller |
| --- | --- | --- |
| / | / (deployed /Ryan-Home/) | index.html, src/work.js |
| /about/ | /about/ (deployed /Ryan-Home/about/) | about/index.html, src/app.js |

Shared runtime: src/site.js and src/page-transitions.js. Scope cleanup: src/page-lifecycle.js. Motion overrides only: src/components/sites/ryan/personal.css. Persistent R logo/header are never replaced on navigation.

## Validation

- `npm test`: actual templates/controllers/router in a DOM unit environment, with a mocked scroll engine and shortened timers; this verifies routing/lifecycle rather than visual frame pacing.
- Covers repeated round trips (same document/header/logo and one active scroll controller), actual Work/About main fade selectors, article count, project count, relative URLs under /Ryan-Home/, filters, Text mode, mobile menu interactions, direct About entry, reduced motion, history during entry, failed HTML/content requests and retries.
- Native Safari: observed the Work content visibly fading to its background while the R logo and navigation remain visible; observed About settled; exercised reverse navigation and Personal Agent filter (one project).
- `npm run check`, `npm run build`.

No spotlight effect was added. Mobile menu routing is covered in DOM tests; a physical mobile-device animation check was not performed.
