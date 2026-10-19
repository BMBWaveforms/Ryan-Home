import '../public/vendor/locomotive-scroll.min.js';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const assetUrl = path => new URL('public' + path, document.baseURI).href;
const runtimeErrors = [];
window.addEventListener('error',e => runtimeErrors.push(e.message));
window.addEventListener('unhandledrejection',e => runtimeErrors.push(String(e.reason)));
const state = { mode: root.dataset.mode, filter: 'all', language: 'zh-CN', busy: false, projects: [] };
const visual = $('#visual-grid');
const text = $('#text-list');
const stage = $('.work-stage');
const panels = { visual: $('#visual-panel'), text: $('#text-panel') };
const switcher = $('.mode-switch');
let scroller;
let filterTimer;
let nativeScrollFrame;
let modeTimer;
let switching = false;
let menuIsOpen = false;
let onScrollChange = () => {};
let desktopScrollContext = innerWidth >= 1024;
const videoStops = new WeakMap();
const activeVideos = new Set();
const pause = ms => new Promise(resolve => setTimeout(resolve, reduceMotion.matches ? 0 : ms));

function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}
function setUrl({replace = false} = {}) {
  const url = new URL(location.href);
  url.searchParams.delete('view');
  url.searchParams.delete('work_category');
  url.searchParams.delete('lang');
  if (state.mode === 'text') url.searchParams.set('view', 'text');
  if (state.filter !== 'all') url.searchParams.set('work_category', state.filter);
  if (state.language === 'en') url.searchParams.set('lang', 'en');
  history[replace ? 'replaceState' : 'pushState']({}, '', url);
}
function updateHeight() {
  const panel = panels[state.mode];
  stage.style.height = Math.ceil(panel.scrollHeight) + 'px';
  requestAnimationFrame(() => scroller?.update());
}
function scrollTo(y, immediate = false) {
  cancelAnimationFrame(nativeScrollFrame);
  if (scroller && root.classList.contains('has-scroll-smooth')) {
    scroller.scrollTo(y, {duration:immediate || reduceMotion.matches ? 0 : 800,easing:[.55,.05,.22,.99],disableLerp:immediate});
    return;
  }
  if (immediate || reduceMotion.matches) { window.scrollTo(0,y); return; }
  // The reference uses Power3.inOut over800ms for its native mobile/tablet path.
  const start = window.scrollY;
  const started = performance.now();
  const tick = now => {
    const t = Math.min(1,(now-started)/800);
    const eased = t < .5 ? 8*t**4 : 1-((-2*t+2)**4)/2;
    window.scrollTo(0,start+(y-start)*eased);
    if (t < 1) nativeScrollFrame = requestAnimationFrame(tick);
  };
  nativeScrollFrame = requestAnimationFrame(tick);
}
function stopVideo(video) {
  if (!video) return;
  clearTimeout(videoStops.get(video));
  video.classList.remove('is-playing');
  videoStops.set(video, setTimeout(() => { video.pause(); activeVideos.delete(video); }, 400));
}
function stopAllVideos() { activeVideos.forEach(stopVideo); }
function attachVideo(link, project, cover) {
  if (!project.video) return;
  let video;
  let hoverToken = 0;
  const play = async () => {
    if (innerWidth <= 768 || reduceMotion.matches) return;
    const token = ++hoverToken;
    if (!video) {
      video = el('video');
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'none';
      video.setAttribute('aria-hidden','true');
      video.src = assetUrl(project.video);
      cover.append(video);
    }
    clearTimeout(videoStops.get(video));
    try {
      if (video.readyState > 0) video.currentTime = 0;
      await video.play();
      if (token !== hoverToken) { stopVideo(video); return; }
      video.classList.add('is-playing');
      activeVideos.add(video);
    } catch { /* Keep the original still visible if autoplay is unavailable. */ }
  };
  const stop = () => { ++hoverToken; stopVideo(video); };
  link.addEventListener('mouseenter',play);
  link.addEventListener('mouseleave',stop);
  link.addEventListener('focus',play);
  link.addEventListener('blur',stop);
}
function makeVisual(project, index) {
  const card = el('article', 'visual-card' + (project.pickup ? ' is-pickup':'') + (project.fullWidth ? ' is-fullwidth':''));
  card.dataset.project = project.slug;
  const link = el(project.url ? 'a':'div', 'project-link');
  if (project.url) link.href = project.url;
  const cover = el('div','project-cover');
  const image = el('img');
  image.src = assetUrl(project.image);
  image.alt = project.title;
  image.loading = index < 6 ? 'eager':'lazy';
  image.decoding = 'async';
  image.width = project.imageWidth || 886;
  image.height = project.imageHeight || 1060;
  image.addEventListener('load',() => image.classList.add('is-loaded'));
  if (image.complete && image.naturalWidth) image.classList.add('is-loaded');
  cover.append(image);
  const caption = el('div','project-caption');
  caption.append(el('h2','project-title',project.title),el('p','project-client',project.client));
  link.append(cover,caption);
  attachVideo(link,project,cover);
  card.append(link);
  return card;
}
function makeText(project) {
  const row = el(project.url ? 'a':'article','text-row');
  if (project.url) row.href = project.url;
  row.dataset.project = project.slug;
  const title = el('div','text-project');
  title.append(el('h2','',project.title),el('p','',project.client));
  row.append(title);
  for (const [key,label,className] of [['date','Date','text-date'],['outputs','Outputs','text-outputs'],['roles','Role','text-roles']]) {
    const field = el('dl','text-field ' + className);
    field.append(el('dt','',label),el('dd','',Array.isArray(project[key]) ? project[key].join(', ') : project[key]));
    row.append(field);
  }
  row.append(el('p','text-overview',state.language === 'en' ? project.overviewEn || project.overview : project.overview));
  return row;
}
function renderProjects() {
  stopAllVideos();
  const projects = state.projects.filter(project => state.filter === 'all' || project.categories.includes(state.filter));
  const visualFragment = document.createDocumentFragment();
  const textFragment = document.createDocumentFragment();
  projects.forEach((project,index) => {
    visualFragment.append(makeVisual(project,index));
    textFragment.append(makeText(project));
  });
  visual.replaceChildren(visualFragment);
  text.replaceChildren(textFragment);
  visual.classList.toggle('is-all',state.filter === 'all');
  visual.dataset.count = text.dataset.count = projects.length;
  $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.filter === state.filter)));
  const filterLabel = $('.filter-toggle span');
  filterLabel.textContent = state.filter === 'all' ? 'Filters' : $('[data-filter="' + state.filter + '"]').textContent;
  updateHeight();
}
function applyMode() {
  root.dataset.mode = state.mode;
  panels.visual.inert = state.mode !== 'visual';
  panels.text.inert = state.mode !== 'text';
  $$('[data-view]').forEach(button => {
    const active = button.dataset.view === state.mode;
    button.setAttribute('aria-selected',String(active));
    button.tabIndex = active ? 0 : -1;
  });
  $('meta[name="theme-color"]').content = state.mode === 'text' ? '#121212':'#ffffff';
  updateHeight();
}
async function changeMode(mode, {history = true} = {}) {
  if (state.mode === mode || switching) return;
  switching = true;
  clearTimeout(modeTimer);
  stopAllVideos();
  state.mode = mode;
  switcher.classList.remove('slide-right','slide-left');
  void switcher.offsetWidth;
  switcher.classList.add(mode === 'visual' ? 'slide-right':'slide-left');
  scrollTo(0);
  applyMode();
  if (history) setUrl();
  modeTimer = setTimeout(() => { switching = false; switcher.classList.remove('slide-right','slide-left'); }, reduceMotion.matches ? 0 : 750);
}
function toggleFilters(force) {
  const filters = $('.filters');
  const open = typeof force === 'boolean' ? force : !filters.classList.contains('is-open');
  const list = $('#filter-list');
  filters.classList.toggle('is-open',open);
  $('.filter-toggle').setAttribute('aria-expanded',String(open));
  list.style.height = open ? list.scrollHeight + 'px' : '0px';
}
async function changeFilter(filter, {history = true} = {}) {
  if (filter === state.filter || state.busy) { toggleFilters(false); return; }
  state.busy = true;
  state.filter = filter;
  toggleFilters(false);
  if (innerWidth < 1024) scrollTo(100);
  stage.classList.add('is-filtering');
  if (history) setUrl();
  await pause(innerWidth < 1024 ? 200 : 350);
  renderProjects();
  stage.classList.remove('is-filtering');
  clearTimeout(filterTimer);
  filterTimer = setTimeout(() => state.busy = false, reduceMotion.matches ? 0 : 450);
}
function closeLanguage() {
  $('.language-switch')?.classList.remove('is-open');
  $('.language-current')?.setAttribute('aria-expanded','false');
}
function setLanguage(language, {history = true} = {}) {
  state.language = language;
  root.lang = 'zh-CN';
  if ($('.language-current')) $('.language-current').firstChild.textContent = language === 'ja' ? 'Japanese':'English';
  $$('[data-language]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.language === language)));
  closeLanguage();
  if (state.projects.length) renderProjects();
  if (history) setUrl();
}
function setMenu(open) {
  menuIsOpen = open;
  const menu = $('#mobile-menu');
  menu.classList.toggle('is-open',open);
  menu.inert = !open;
  $('.menu-button').setAttribute('aria-expanded',String(open));
  $('.menu-button').setAttribute('aria-label',open ? 'Close menu':'Open menu');
  if (open) { scroller?.stop(); document.body.style.overflow = 'hidden'; }
  else { scroller?.start(); document.body.style.overflow = ''; }
}
function installInteractions() {
  $$('[data-view]').forEach(button => button.addEventListener('click',() => changeMode(button.dataset.view)));
  switcher.addEventListener('keydown',event => {
    if (['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'ArrowLeft' || event.key === 'Home' ? 'text':'visual';
      changeMode(next);
      $(`[data-view="${next}"]`).focus();
    }
  });
  $$('[data-filter]').forEach(button => button.addEventListener('click',() => changeFilter(button.dataset.filter)));
  $('.filter-toggle').addEventListener('click',() => toggleFilters());
  $('.language-current')?.addEventListener('click',() => {
    const container = $('.language-switch');
    const open = container.classList.toggle('is-open');
    $('.language-current').setAttribute('aria-expanded',String(open));
  });
  $('.language-switch')?.addEventListener('mouseenter',() => {
    $('.language-switch').classList.add('is-open');
    $('.language-current').setAttribute('aria-expanded','true');
  });
  $('.language-switch')?.addEventListener('mouseleave',closeLanguage);
  $$('[data-language]').forEach(button => button.addEventListener('click',() => { setLanguage(button.dataset.language); setMenu(false); }));
  $('.menu-button').addEventListener('click',() => setMenu(!menuIsOpen));
  $$('.mobile-menu nav a').forEach((link,index) => { link.style.setProperty('--i',index); link.addEventListener('click',() => setMenu(false)); });
  document.addEventListener('keydown',event => { if (event.key === 'Escape') { toggleFilters(false); closeLanguage(); if (menuIsOpen) { setMenu(false); $('.menu-button').focus(); } } });
  const links = $$('.nav-link');
  const line = $('.nav-underline');
  const moveLine = link => line.style.transform = `translateX(${link.offsetLeft + 10}px)`;
  links.forEach(link => { link.addEventListener('mouseenter',() => moveLine(link)); link.addEventListener('focus',() => moveLine(link)); });
  $('.main-nav').addEventListener('mouseleave',() => moveLine(links[0]));
  moveLine(links[0]);
  const footer = $('#footer');
  const onScroll = args => {
    const scrollY = args?.scroll?.y ?? window.scrollY;
    const footerTop = footer.offsetTop;
    switcher.classList.toggle('is-at-footer',scrollY + innerHeight > footerTop + 20);
  };
  onScrollChange = onScroll;
  if (scroller) scroller.on('scroll',onScroll);
  else window.addEventListener('scroll',() => onScroll(),{passive:true});
  window.addEventListener('resize',() => {
    if (innerWidth >= 769 && menuIsOpen) setMenu(false);
    const desktop = innerWidth >= 1024;
    if (desktop !== desktopScrollContext) {
      desktopScrollContext = desktop;
      scroller?.destroy();
      scroller = new window.LocomotiveScroll({el:$('#scroll-content'),smooth:!reduceMotion.matches,lerp:.1,smartphone:{smooth:false},tablet:{smooth:false,breakpoint:1024}});
      scroller.on('scroll',onScrollChange);
    }
    updateHeight();
    onScroll();
  });
  new ResizeObserver(updateHeight).observe($('.work-intro'));
  new ResizeObserver(updateHeight).observe(panels.visual);
  new ResizeObserver(updateHeight).observe(panels.text);
  window.addEventListener('popstate',() => {
    const query = new URLSearchParams(location.search);
    state.filter = query.get('work_category') || 'all';
    state.mode = query.get('view') === 'text' ? 'text':'visual';
    state.language = query.get('lang') === 'en' ? 'en':'ja';
    renderProjects(); applyMode(); setLanguage(state.language,{history:false}); scrollTo(0);
  });
}
async function start() {
  $$('.loader-wordmark path').forEach((path,index) => path.style.setProperty('--i',index));
  const loader = $('.site-loader');
  let revisit = false;
  try { revisit = sessionStorage.getItem('ryan-entered') === 'yes'; } catch {}
  if (new URLSearchParams(location.search).get('intro') === '1') revisit = false;
  if (reduceMotion.matches || revisit || window.RyanNavigation?.arriving) { loader.remove(); document.body.classList.add('is-ready'); }
  else {
    setTimeout(() => loader.classList.add('is-out'),3500);
    setTimeout(() => { loader.classList.add('is-done'); document.body.classList.add('is-ready'); },4000);
    setTimeout(() => loader.remove(),4800);
    try { sessionStorage.setItem('ryan-entered','yes'); } catch {}
  }
  const response = await fetch(new URL('./data/work-placeholders.json',import.meta.url));
  if (!response.ok) throw new Error('Project catalog could not be loaded');
  const catalog = await response.json();
  state.projects = catalog.projects;
  const query = new URLSearchParams(location.search);
  const filter = query.get('work_category') || 'all';
  state.filter = ['all',...catalog.filters.map(item => item.id)].includes(filter) ? filter : 'all';
  state.language = query.get('lang') === 'en' ? 'en':'ja';
  renderProjects(); applyMode(); setLanguage(state.language,{history:false});
  $('.load-message').textContent = '';
  await document.fonts.ready;
  updateHeight();
  scroller = new window.LocomotiveScroll({el:$('#scroll-content'), smooth:!reduceMotion.matches, lerp:.1, smartphone:{smooth:false}, tablet:{smooth:false,breakpoint:1024}});
  updateHeight();
  installInteractions();
  window.RyanNavigation?.ready();
  // Read-only diagnostics for rendered acceptance, not UI controls.
  window.workPreview = {get state(){ return {mode:state.mode,filter:state.filter,language:state.language,count:visual.children.length,smoothScroll:root.classList.contains('has-scroll-smooth')}; }};
  window.sitePreview = {get state(){return {page:'work', ...window.workPreview.state, articles:4, projects:visual.children.length, errors:[...runtimeErrors]};}};
}
start().catch(error => {
  console.error(error);
  $('.site-loader')?.remove();
  document.body.classList.add('is-ready');
  $('.load-message').textContent = 'Work could not be loaded. Please reload the page.';
  window.RyanNavigation?.ready();
});
