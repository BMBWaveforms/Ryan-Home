# Motion evidence: Work Text + Visual

Reference controller chunks only; do not execute or import these production bundles into recreation. Hashes were verified against source main.js's chunk map.

## Scroll

- Source uses Locomotive Scroll (module372 in12.chunk.d6cdd6ad.js). Exact package version is not declared in this bundle; implementation is the v4-style class API.
- Source instantiation supplies only `{el: document.querySelector('[data-scroll-container]'), smooth: !isMac || !isFirefox}`. Thus desktop smooth unless Firefox on Mac. Default smooth-scroll settings from library: lerp0.1, multiplier1, firefoxMultiplier50, touchMultiplier2, resetNativeScrolltrue, verticaldirection. Smartphone smoothfalse; tablet smoothfalse, breakpoint1024.
- Programmatic scroll defaults0.8s, easing[0.55,0.05,0.22,0.99], offset0. Anchor links call offset-120. Mobile/tablet programmatic scroll uses GSAP Power3 easeInOut duration0.8s.
- On each Text/Visual switch, controller emits scrollTo(0,0), which means both modes animate to document top over default0.8s rather than preserving scroll position. Source sets bodyheight to active mode offsetHeight and updates on ResizeObserver. The mode switch remains locked until CSStransitionend.
- Footer IntersectionObserver hides fixed Text/Visual/Human switch when footer intersects viewport; reactivates when footer leaves.

## Initial loading

- Black fixed overlay: z-index100, pointereventsauto until done; opacity exit transition0.7s cubic-bezier(0.18,0.06,0.23,1).
- Controller starts onconnect, and language-switch event; adds `.in`, removes body `.is-doneAnim`. At3500ms adds `.out`; at4000ms adds body `.is-doneAnim` and removes in/out. Therefore overlay is released after4s plus its0.7s opacitysettle.
- Original SHIFTBRAIN wordmark is191×21SVG; letters start fillblack/translateY26px. Letter1 through10 enter with translate transition1s cubic-bezier(.55,.05,.22,.99), stagger40ms; first delay40ms. Fill transitions0.5s with delays340ms through700ms.
- At1.5s wordmark recedes translateZ(-100px) over1s cubic-bezier(.43,.05,.17,1), opacity fades0.5s starting1.7s.
-24×46symbol starts translateZ(200px)/opacity0. At1.7s recedes toZ0 over1.5s with same perspectivecurve; fadesin0.5s starting2s. Atout state(3.5s) moves toZ-200px over1.5s and fadesout0.5s after0.2s.
- Original inline wordmark extracted as `/sites/shiftbrain/icons/shiftbrain-wordmark.svg` in addition to symbol.

## Category filters

- Category accordion applies only windowwidth<1024. Measures sumchildoffsetHeight. Open animates listheight0→measured over0.8s GSAP Power3 easeInOut. Close1s Power3 easeInOut with0.1sdelay.
- Desktop Visual: y0→-10px in0.3s Power1 easeIn; opacity1→0 in0.35s Power1 easeInOut; after first-party APIresponse, replaceitems/resety0; fadein0.4s Power1 easeInOut.
- Desktop Text: fadeout0.3s Power3 easeOut; replaceitems; fadein0.4s Power1 easeInOut.
- Mobile/tablet filter: programmatic scrollTo100 over0.8s Power3 easeInOut; fadeout0.2s Power0 easeIn; replaceitems; fadein1.2s Power1 easeInOut.
- Filter button text: fadesout/movesy-70%0.3s Power1 easeIn, then fromy120%/opacity0 toy0/opacity1 over1s Power3 easeInOut, start-0.2s.
- Filter persists `work_category=<category>`query, clearing it forAll. Visual mode omitsview query;Text uses`view=text`.
- Source highlights large pickup tiles only inAllmode; filtered mode makes everytile standardwidth.

## Text hover and Visual media

- No cursor-followingthumbnail found in Textmarkup, CSS, or relevantcontroller. Textlinks are opacity0.5 onhover-capabledevices; hoveredrowopacity1. Transitionopacity0.5s cubic-bezier(.18,.06,.23,1), padding0.8s cubic-bezier(.36,.04,.23,1). Touchrows do not getopacity0.5 rule.
- hover-videocontroller only queries a video's descendant insideVisualprojectlink. Onmouseenter: addis-active, currentTime0, play. Onmouseleave: removeis-active thenpause afterplay promise.
- Video fadesin0.8s cubic-bezier(.18,.06,.23,1), fadesout0.4s cubic-bezier(.26,.06,0,1). Source suppressesvideos atwidth<=768px. Useoriginalfiles lazilyloaded.
