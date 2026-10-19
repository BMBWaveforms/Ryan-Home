# Source asset observations

Reference CSS is stored only as evidence, not linked by local implementation.

Latin fonts: TT Norms Regular; Light and ExtraLight are separate family files all with declared weight 400. YakuHanJP Light supplies punctuation only; Japanese text additionally uses a remote Realtype service (not locally downloaded).

Work endpoint: POST https://shiftbrain.com/wp-json/my-theme/work, form fields locale=ja and term_taxonomy_id=all/6/9/7/5/8/16. Returns99posts with bilingual overviews.

Visual entries carry a theme color and pickup layout flag. Source plays available video on mouseenter and stops it on mouseleave. All entry detail URLs remain original /work/<slug>/ destinations (out of scope).

Inline original symbol extracted to /sites/shiftbrain/icons/shiftbrain-symbol.svg. It uses currentColor to support source light/dark contexts.

Source styles sampled below; surrounding @media context must be read in original CSS to pick viewport rule.

## `.index-header{`
```css
.index-header{position:relative}
```

## `.index-header__title{`
```css
.index-header__title{letter-spacing:-.03em;line-height:1.145;font-family:TT Norms Light,sans-serif}
.index-header__title{font-family:TT Norms ExtraLight,sans-serif}
.index-header__title{font-size:1.875rem}
.index-header__title{font-size:2.7777777778rem}
.index-header__title{font-size:calc(2.77778rem + 3.47222vw - 44.44444px)}
.index-header__title{font-size:calc(3.125rem + 2.60417vw - 37.5px)}
.index-header__title{font-size:3.90625rem}
.index-header__title{letter-spacing:-.02em}
```

## `.index-body{`
```css
.index-body{position:relative;min-height:calc(100vh - 23.125rem);overflow:hidden}
```

## `.index-visual__list{`
```css
.index-visual__list{display:flex;flex-wrap:wrap;margin:0 -.15625rem}
.index-visual__list{margin:-.7vw}
```

## `.index-visual__item{`
```css
.index-visual__item{position:relative;width:calc(50% - .3125rem);margin:0 .15625rem}
.index-visual__item{margin-bottom:1.5rem}
.index-visual__item{width:calc(33.33% - 1.38vw);margin:.69vw}
```

## `.index-visual__item.is-pickup{`
```css
.index-visual__item.is-pickup{width:100%}
.index-visual__item.is-pickup{width:calc(66.66% - 1.38vw)}
```

## `.projectLink__cover{`
```css
.projectLink__cover{position:relative;overflow:hidden;width:100%;height:53.86vw}
.projectLink__cover{height:36.8vw}
```

## `.projectLink__content{`
```css
.projectLink__content{opacity:1}
.projectLink__content{margin-top:.625rem}
.projectLink__content{position:absolute;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,.5);display:flex;flex-direction:column;justify-content:flex-end;color:#fff;opacity:0;transition:opacity 1s cubic-bezier(.18,.06,.23,1)}
.projectLink__content{padding:1.1111111111rem}
.projectLink__content{padding:calc(1.11111rem + 1.38889vw - 17.77778px)}
.projectLink__content{padding:calc(1.25rem + 1.04167vw - 15px)}
.projectLink__content{padding:1.5625rem}
```

## `.index-text__titles{`
```css

```

## `.index-text__item__link{`
```css
.index-text__item__link{display:flex;transition:opacity .5s cubic-bezier(.18,.06,.23,1),padding .8s cubic-bezier(.36,.04,.23,1)}
.index-text__item__link{flex-direction:column}
.index-text__item__link{justify-content:space-between}
.index-text__item__link{padding-top:1.6666666667rem}
.index-text__item__link{padding-top:calc(1.66667rem + 2.08333vw - 26.66667px)}
.index-text__item__link{padding-top:calc(1.875rem + 1.5625vw - 22.5px)}
.index-text__item__link{padding-top:2.34375rem}
.index-text__item__link{padding-bottom:1.1111111111rem}
.index-text__item__link{padding-bottom:calc(1.11111rem + 1.38889vw - 17.77778px)}
.index-text__item__link{padding-bottom:calc(1.25rem + 1.04167vw - 15px)}
.index-text__item__link{padding-bottom:1.5625rem}
.index-text__item__link{opacity:.5}
```

## `.index-text__item__project{`
```css
.index-text__item__project{order:1}
```

## `.index-text__item__date{`
```css
.index-text__item__date{order:3;margin-top:1.875rem}
```

## `.index-text__item__outputs{`
```css
.index-text__item__outputs{order:4}
```

## `.index-text__item__role{`
```css
.index-text__item__role{line-height:1.5;font-size:.75rem}
.index-text__item__role{font-size:.7777777778rem}
.index-text__item__role{font-size:calc(.77778rem + .97222vw - 12.44444px)}
.index-text__item__role{font-size:calc(.875rem + .72917vw - 10.5px)}
.index-text__item__role{font-size:1.09375rem}
.index-text__item__role{padding:.625rem 0;border-bottom:1px solid hsla(0,0%,100%,.05)}
.index-text__item__role{line-height:1.3}
.index-text__item__role{order:5}
```

## `.index-text__item__overview{`
```css
.index-text__item__overview{font-size:.75rem}
.index-text__item__overview{font-size:.7222222222rem}
.index-text__item__overview{font-size:calc(.72222rem + .90278vw - 11.55556px)}
.index-text__item__overview{font-size:calc(.8125rem + .67708vw - 9.75px)}
.index-text__item__overview{font-size:1.015625rem}
.index-text__item__overview{line-height:1.7}
.index-text__item__overview{order:2;margin-top:2.25rem}
```

## `.l-contentWrapper{`
```css
.l-contentWrapper{box-sizing:content-box;margin-left:auto;margin-right:auto;position:relative;padding-right:.9375rem;padding-left:.9375rem}
.l-contentWrapper{padding-left:2.5%;padding-right:2.5%}
```

## Download verification

- 99 original Work thumbnails, 52 original hover MP4 clips, 4 source fonts, and 1 extracted inline symbol are local.
- Total156 assets, 161,363,944bytes (153.89MiB). Every catalog image/video local path resolves.
- File signatures:91 raster images plus8 SVG thumbnails,52 video/mp4 files,4 valid WOFF/WOFF2 fonts,1 SVG logo.
- All99 thumbnails have recorded width/height, derived from sips for raster images and SVG viewBox for vectors. All52 MP4 files have valid tkhd dimensions and mvhd duration fields recorded.
- Largest hover clip is7.95MiB. Videos use the original files; implementation should set preload=none and load/play only on hover or user input.
- Six filter category memberships were read from the live first-party endpoint. Counts: Brand76, Global7, Independent2, Promotion15, Recruit5, Media4. Entries may have multiple categories.
- Source Human-mode assets were intentionally excluded.
