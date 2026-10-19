import '../public/vendor/locomotive-scroll.min.js';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const root = document.documentElement;
const isAbout = root.dataset.page === 'about';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let scroller;
let menuOpen = false;
let desktop = innerWidth >= 1024;
let modeBusy = false;
let mode = root.dataset.mode;
let lastScroll = 0;
const switcher = $('.mode-switch');
const panels = {visual:$('#visual-panel'),text:$('#text-panel')};
const errors = [];
window.addEventListener('error',event => errors.push(event.message));
window.addEventListener('unhandledrejection',event => errors.push(String(event.reason)));
function node(tag, className, text) {
  const result = document.createElement(tag);
  if (className) result.className = className;
  if (text !== undefined) result.textContent = text;
  return result;
}
function update() {
  if (!isAbout) $('.work-stage').style.height = Math.ceil(panels[mode].scrollHeight) + 'px';
  requestAnimationFrame(() => scroller?.update());
}
function goTo(target, instant = false) {
  if (scroller) scroller.scrollTo(target,{duration:instant || reduced.matches ? 0 : 900,easing:[.55,.05,.22,.99],offset:typeof target === 'number' ? 0 : -110,disableLerp:instant});
  else if (typeof target === 'number') window.scrollTo({top:target,behavior:instant || reduced.matches ? 'instant':'smooth'});
  else target.scrollIntoView({behavior:reduced.matches ? 'instant':'smooth'});
}
function setMenu(open) {
  menuOpen = open;
  const menu = $('#mobile-menu');
  menu.inert = !open;
  menu.classList.toggle('is-open',open);
  $('.menu-button').setAttribute('aria-expanded',String(open));
  $('.menu-button').setAttribute('aria-label',open ? 'Close menu':'Open menu');
  document.body.style.overflow = open ? 'hidden':'';
  if (open) scroller?.stop(); else scroller?.start();
}
function moveLine(link = $('.main-nav .is-current')) {
  $('.nav-underline').style.transform = `translateX(${link.offsetLeft + 10}px)`;
}
function onScroll(event) {
  lastScroll = event?.scroll?.y ?? window.scrollY;
  if (switcher) switcher.classList.toggle('is-at-footer',lastScroll + innerHeight > $('#footer').offsetTop + 100);
}
function createScroller() {
  scroller?.destroy();
  scroller = new window.LocomotiveScroll({el:$('#scroll-content'),smooth:!reduced.matches,lerp:.1,smartphone:{smooth:false},tablet:{smooth:false,breakpoint:1024},getDirection:true});
  scroller.on('scroll',onScroll);
  scroller.update();
}
function applyMode() {
  root.dataset.mode = mode;
  for (const name of ['text','visual']) {
    panels[name].inert = mode !== name;
    const tab = $(`[data-view="${name}"]`);
    tab.setAttribute('aria-selected',String(mode === name));
    tab.tabIndex = mode === name ? 0 : -1;
  }
  $('meta[name="theme-color"]').content = mode === 'text' ? '#121212':'#fff';
  update();
}
function changeMode(next,history = true) {
  if (mode === next || modeBusy) return;
  modeBusy = true;
  mode = next;
  switcher.classList.remove('slide-left','slide-right');
  void switcher.offsetWidth;
  switcher.classList.add(next === 'text' ? 'slide-left':'slide-right');
  goTo(0); applyMode();
  if (history) {
    const url = new URL(location.href);
    url.searchParams.delete('view');
    if (mode === 'text') url.searchParams.set('view','text');
    window.history.pushState({},'',url);
  }
  setTimeout(() => { modeBusy = false; switcher.classList.remove('slide-left','slide-right'); },reduced.matches ? 0 : 750);
}
function renderAbout(content) {
  $('#perspective').replaceChildren(...content.perspective.map(text => node('p','',text)));
  content.articles.forEach((article,index) => {
    const row = node('a','article-row');
    row.href = article.url; row.target = '_blank'; row.rel = 'noopener'; row.dataset.reveal = '';
    const body = node('div','article-copy');
    body.append(node('p','article-category',article.category),node('h3','',article.title),node('p','article-bottom','READ ON WECHAT'));
    const arrow = node('span','article-arrow','↗'); arrow.ariaHidden = 'true';
    row.append(node('span','article-number',String(index+1).padStart(2,'0')),body,arrow);
    $('#articles').append(row);
  });
  content.experience.forEach(entry => {
    const row = node('article','timeline-row'); row.dataset.reveal = '';
    const body = node('div');
    body.append(node('p','timeline-kind',entry.kind),node('h3','',entry.title),node('p','timeline-organization',entry.organization),node('p','timeline-description',entry.description));
    row.append(node('p','timeline-date',entry.period),body); $('#timeline').append(row);
  });
  content.hackathons.forEach(entry => {
    const card = node('article','hackathon-card'); card.dataset.reveal = '';
    const mark = node('p','hackathon-mark','48'); mark.append(node('small','','HOURS / AN IDEA IN MOTION'));
    const copy = node('div','hackathon-copy');
    const meta = node('div','hackathon-meta'); meta.append(node('span','',entry.role),node('span','',entry.subtitle));
    copy.append(node('h3','',entry.title),node('p','',entry.description),meta);
    card.append(node('span','section-index',entry.period+' · 示例内容'),mark,copy); $('#hackathon-list').append(card);
  });
}
function installReveals() {
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
  }),{threshold:.08,rootMargin:'0px 0px -30px 0px'});
  $$('[data-reveal]').forEach(element => observer.observe(element));
  document.body.classList.add('motion-enabled');
}
function installInteractions() {
  $('.menu-button').addEventListener('click',() => setMenu(!menuOpen));
  $$('.mobile-menu nav a').forEach((link,index) => { link.style.setProperty('--i',index); link.addEventListener('click',() => setMenu(false)); });
  document.addEventListener('keydown',event => { if (event.key === 'Escape' && menuOpen) { setMenu(false); $('.menu-button').focus(); } });
  $$('.main-nav .nav-link').forEach(link => {
    link.addEventListener('mouseenter',() => moveLine(link));
    link.addEventListener('focus',() => moveLine(link));
  });
  $('.main-nav').addEventListener('mouseleave',() => moveLine());
  $('.main-nav').addEventListener('focusout',() => moveLine());
  $('.back-to-top').addEventListener('click',() => goTo(0));
  $$('[data-jump]').forEach(link => link.addEventListener('click',event => {
    const target = document.getElementById(link.dataset.jump);
    if (target) { event.preventDefault(); goTo(target); history.replaceState({},'','#'+target.id); }
  }));
  $$('.qr-toggle').forEach(button => button.addEventListener('click',() => {
    const target = document.getElementById(button.getAttribute('aria-controls'));
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded',String(open)); target.hidden = !open;
    $('span',button).textContent = open ? '−':'＋'; update();
  }));
  if (switcher) {
    $$('[data-view]').forEach(button => button.addEventListener('click',() => changeMode(button.dataset.view)));
    switcher.addEventListener('keydown',event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault(); const next = ['ArrowLeft','Home'].includes(event.key) ? 'text':'visual';
      changeMode(next); $(`[data-view="${next}"]`).focus();
    });
    addEventListener('popstate',() => { mode = new URLSearchParams(location.search).get('view') === 'text' ? 'text':'visual'; applyMode(); goTo(0); });
  }
  addEventListener('resize',() => {
    if (innerWidth >= 769 && menuOpen) setMenu(false);
    if ((innerWidth >= 1024) !== desktop) { desktop = innerWidth >= 1024; createScroller(); }
    update(); moveLine(); onScroll();
  });
  new ResizeObserver(update).observe($('#main'));
  document.querySelectorAll('img').forEach(image => image.addEventListener('load',update));
}
async function start() {
  const loader = $('.site-loader');
  let revisit = false;
  try { revisit = sessionStorage.getItem('ryan-entered') === 'yes'; } catch { /* Private storage may be unavailable. */ }
  if (new URLSearchParams(location.search).get('intro') === '1') revisit = false;
  const ready = () => { document.body.classList.add('is-ready'); loader.classList.add('is-done'); };
  if (reduced.matches || revisit || window.RyanNavigation?.arriving) { ready(); loader.remove(); }
  else {
    setTimeout(() => loader.classList.add('is-out'),3500);
    setTimeout(ready,4000);
    setTimeout(() => loader.remove(),4800);
    try { sessionStorage.setItem('ryan-entered','yes'); } catch { /* The page still works without storage. */ }
  }
  const response = await fetch(new URL('./data/ryan-content.json',import.meta.url));
  if (!response.ok) throw new Error('Personal content could not be loaded');
  const content = await response.json();
  if (isAbout) {
    $('.about-title').replaceChildren(...content.aboutTitle.map(text => node('span','',text)));
    renderAbout(content);
  } else {
    $('.personal-slogan').replaceChildren(...content.slogan.map(text => node('span','',text)));
    applyMode();
  }
  await document.fonts.ready;
  update(); createScroller(); installInteractions(); moveLine(); installReveals();
  window.RyanNavigation?.ready();
  if (location.hash) { const target = document.getElementById(location.hash.slice(1)); if (target) setTimeout(() => goTo(target,true),100); }
  window.sitePreview = {get state(){return {page:root.dataset.page,mode,articles:content.articles.length,projects:content.projects.length,scroll:lastScroll,smoothScroll:root.classList.contains('has-scroll-smooth'),errors:[...errors]};}};
}
start().catch(error => {
  console.error(error); errors.push(error.message);
  $('.site-loader')?.remove(); document.body.classList.add('is-ready'); document.body.classList.remove('motion-enabled');
  const notice = node('p','noscript','Content could not be loaded. Please reload the page.'); $('#main').append(notice);
  window.RyanNavigation?.ready();
});
