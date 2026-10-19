# About source brief

Source: https://shiftbrain.com/about/. Scope of this research is source evidence only. No app files changed. User excludes the source mouse spotlight; treat it as intentionally omitted when building.

## Hero and source background

- `main` uses data-bg-color="dark"; dark source canvas clear color is #121212. `.about-sightView` sits outside the transformed scroll container, position fixed, width100%, height100vh. Its show/hide opacity transition is0.7s cubic-bezier(.43,.05,.17,1).
- The huge title is an ORIGINAL IMAGE TEXTURE, not a CSS heading: `components/sightview/sightrenewal.38a3d656.png`,2200×200, text SIGHT RENEWAL. Mobile file `sightrenewal-sp.48a03d4f.png`,1200×440. Both originalfiles are saved here as `hero-source-desktop.png` and `hero-source-mobile.png`.
- Desktop/mobile texture switches at width960px in original controller, independently of CSS content breakpoint769px. Shader params desktop logoSize5, translate(0,-1.5); mobile logoSize6.77, translate(0,-.6). These are shader UV parameters, not CSSpx.
- Source colored background is real-time WebGL RGB/noise, not a backgroundphoto. Mouse spotlight is part of that shader and deliberately outside requested behavior. Parent can use originaltitletexture as a static/scrolling visual without that spotlight.
- Source camera position is computed to fill viewport, renderer pixelratio=min(devicepixelratio,1.5). Source texture coordinates show only part of fulltextureUV. Do not assume originalPNG should simply be stretched to entireviewport; compare browser framing.

## Intro lower-right prose

- Source first section `.pageAbout-sightView-section` has `padding-top:60vh!important`.
- Gutter follows global `.l-contentWrapper` (2.5vw desktop).
- Prose `.pageAbout-sightView__description`: mobile width80%,margin-leftauto,margin-top30px. Desktop(min769px) width36.84% ofcontentwrapper,margin-right7.89%,margin-leftauto. At1440width its margin-top36px; at1920margin-top45px.
- Body `.text--14`:14px atmobile and1440width; desktop769→1280uses12.444px;1280→1440fluid12.444→14px;1440→1920fluid14→17.5px,max17.5px. Mobileline-height1.75;desktop1.8. Japanese descriptionopacity.8.
- Exacttwo originalparagraphs remain in source.html. Text has an explicitdoublebreak between paragraphs.

## Scroll and Our Team entrance

- Source uses the same LocomotiveScroll configuration as Work: desktop smoothlerp.1,tablet/mobile native; native fallback is not a pinned scene.
- Hero texture scrolltracks `scrollY/innerHeight`, clampedmax1. Shader logoOpacity=1-progress. Texture moves upward via shader scrollUV: desktop `-progress*7`,mobile `-progress*3`. Thus title is fully faded after oneviewport scrolling.
- No special scroll-pin, sectionmorph, or clicktrigger found at OurTeam boundary. Content remains in normal flow beneathfixedhero; apparent drifting background comes from that fixedWebGL scene + Locomotive's interpolated scroll.
- Intro contains Showreel BEFOREOurTeam: desktopblockwidth84.21%,ratio determined by padding-top48.31% (wrapper-relative),margin-top153px at1440. Mobilewidth73.59vw,height106.66vw,margin-top256px. Imagehover recedes/zooms via perspective1000px translateZ30px over1.5s cubic-bezier(.43,.05,.17,1); normalreturn0.8s cubic-bezier(.18,.06,.23,1). Originalshowreel links https://youtu.be/YUiXUwwmcpM.
- OurTeam sectiontop padding100px at1440;125px at1920;mobile150px. Desktop769→1280starts88.889px and fluidscales upward from1280.
- OurTeam title TTNormsExtraLight desktop, TTNormsLightmobile. Size32px at1440/mobile;28.444px at769–1280;max40px at1920. Line-height1.2,trackingdesktop-.04em/mobile-.01em.
- At>=1024px Teamfixednav isdisplayed and sticky within#fixed-target; nav and content eachpadding-top290px. Contentmargin-left26.31%. Categorylinkclick uses commonscrollTo withoffset-120px and0.8s easing[.55,.05,.22,.99]. Currentcategorymarker is driven by IntersectionObserver rootMargin'-50%'. Below1024navhidden andeachteamcategoryheadingvisible.
- Teamphotos have original before.jpg and animatedafter.gif; originalHTMLlistsCorporate5/Creative7/Produce8/Development3/Partner1. Sourcephotoreferences are in asset-sources.json (notdownloaded in thisread-onlytask).

## Evidence files

- source.html: complete originalAboutHTML.
- layout-source-rules.json: relevantdeclaredCSS rules preserving source@media conditionprefixes.
- asset-sources.json:68 originalAboutimage references +2heroassets.
-11.chunk.a108e07a.js: originalAboutcanvas/controller behavior;7.chunk.3fbe33fb.js:dependencybundle;9.chunk.a0893b66.js:fixednavcontroller. Referenceonly, never importedbyimplementation.
