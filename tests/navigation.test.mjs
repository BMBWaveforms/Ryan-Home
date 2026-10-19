import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {Window} from 'happy-dom';

const origin = 'https://example.com';
const prefix = '/Ryan-Home/';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(check) {
  for (let i = 0; i < 300; i++) { if (check()) return; await sleep(2); }
  throw new Error('Timed out waiting for the route to settle');
}
async function setup(t, {about = false, reduced = false, initialFailures = []} = {}) {
  const window = new Window({url:origin + prefix + (about ? 'about/' : ''), settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true,enableJavaScriptEvaluation:false}});
  const document = window.document;
  document.write(await readFile(about ? 'about/index.html' : 'index.html', 'utf8'));
  document.querySelectorAll('script').forEach(node => node.remove());
  document.body.classList.add('is-ready');
  const style = document.createElement('style');
  style.textContent = await readFile('src/components/sites/ryan/personal.css','utf8');
  document.head.append(style);
  const observers = new Set();
  let liveScrollers = 0;
  class ResizeObserver {
    constructor() { observers.add(this); }
    observe() {}
    disconnect() { observers.delete(this); }
  }
  class IntersectionObserver extends ResizeObserver {}
  window.LocomotiveScroll = class {
    constructor() { liveScrollers++; document.documentElement.classList.add('has-scroll-smooth'); }
    on() {} update() {} stop() {} start() {} scrollTo() {}
    destroy() { liveScrollers--; document.documentElement.classList.remove('has-scroll-smooth'); }
  };
  Object.defineProperty(document, 'fonts', {value:{ready:Promise.resolve()}});
  const errors = [], requests = [], fail = new Set(initialFailures), timers = new Set();
  const timeout = (fn, ms) => {
    const id = setTimeout(() => { timers.delete(id); fn(); }, Math.min(ms, 5));
    timers.add(id); return id;
  };
  window.setTimeout = timeout;
  window.clearTimeout = clearTimeout;
  window.requestAnimationFrame = fn => timeout(() => fn(performance.now()), 1);
  window.cancelAnimationFrame = clearTimeout;
  const context = vm.createContext({window,document,location:window.location,history:window.history,navigator:window.navigator,URL,URLSearchParams,AbortController:window.AbortController,AbortSignal:window.AbortSignal,crypto:globalThis.crypto,performance,ResizeObserver,IntersectionObserver,console:{...console,error:(...args)=>errors.push(args)},matchMedia:()=>({matches:reduced}),innerWidth:1440,innerHeight:900,getComputedStyle:window.getComputedStyle.bind(window),requestAnimationFrame:window.requestAnimationFrame,cancelAnimationFrame:clearTimeout,setTimeout:timeout,clearTimeout,addEventListener:window.addEventListener.bind(window),fetch:async input => {
    const url = new URL(input, window.location.href);
    requests.push(url.href);
    const path = url.pathname.slice(prefix.length) || 'index.html';
    const file = path.endsWith('/') ? path + 'index.html' : path;
    if (fail.has(file)) return {ok:false,status:503};
    const body = await readFile(file, 'utf8');
    return {ok:true,status:200,text:async()=>body,json:async()=>JSON.parse(body)};
  },DOMParser:window.DOMParser});
  const modules = new Map();
  async function load(url) {
    const id = new URL(url).pathname;
    if (modules.has(id)) return modules.get(id);
    if (id.includes('/public/vendor/')) {
      const module = new vm.SyntheticModule([], () => {}, {context}); modules.set(id,module); return module;
    }
    let source = await readFile(id.slice(prefix.length), 'utf8');
    const module = new vm.SourceTextModule(source,{context,identifier:origin+id,initializeImportMeta:meta=>meta.url=origin+id});
    modules.set(id,module);
    await module.link((specifier, parent) => load(new URL(specifier,parent.identifier)));
    return module;
  }
  const work = await load(origin+prefix+'src/work.js'); await work.evaluate();
  const app = await load(origin+prefix+'src/app.js'); await app.evaluate();
  const router = await load(origin+prefix+'src/page-transitions.js'); await router.evaluate();
  await router.namespace.createNavigation({work:work.namespace.mountWork,about:app.namespace.mountAbout});
  const click = (selector, init = {}) => {
    const event = new window.MouseEvent('click',{bubbles:true,cancelable:true,button:0,...init});
    document.querySelector(selector).dispatchEvent(event);
    return event;
  };
  const settle = () => until(() => !window.navigationPreview.state.busy);
  const pop = path => {
    window.history.replaceState({},'',origin+prefix+path);
    window.dispatchEvent(new window.PopStateEvent('popstate'));
  };
  t.after(async()=>{timers.forEach(clearTimeout); await window.happyDOM.abort();});
  return {window,document,click,settle,pop,errors,fail,requests,observers,get scrolls(){return liveScrollers}};
}

test('repeated Work/About navigation retains the document and shell with one scroll controller', async t => {
  const s = await setup(t);
  const nav = s.document.querySelector('.site-header'), logo = s.document.querySelector('.brand-symbol');
  const id = s.window.navigationPreview.state.documentId;
  for (let i=0; i<3; i++) {
    s.click('.main-nav a:nth-child(2)');
    assert.equal(s.window.getComputedStyle(s.document.querySelector('main')).opacity,'0');
    await s.settle();
    assert.equal(s.document.documentElement.dataset.page,'about');
    assert.equal(s.document.querySelectorAll('.article-row').length,4);
    assert.equal(s.document.querySelector('.about-portrait img').src,origin+prefix+'public/ryan/portrait-placeholder.svg');
    assert.equal(s.scrolls,1);
    s.click('.main-nav a:first-child');
    assert.equal(s.window.getComputedStyle(s.document.querySelector('main')).opacity,'0');
    await s.settle();
    assert.equal(s.document.querySelectorAll('.visual-card').length,4);
    assert.equal(s.scrolls,1);
    assert.equal(s.observers.size,3);
  }
  assert.equal(s.window.navigationPreview.state.documentId,id);
  assert.equal(s.window.navigationPreview.state.navigationCount,6);
  assert.equal(s.document.querySelector('.site-header'),nav);
  assert.equal(s.document.querySelector('.brand-symbol'),logo);
  assert.equal(s.errors.length,0);
});

test('filters, Text/Visual, mobile menu and history still work after remounting', async t => {
  const s = await setup(t);
  s.click('.main-nav a:nth-child(2)'); await s.settle();
  s.click('.main-nav a:first-child'); await s.settle();
  s.click('[data-filter="personal-agent"]');
  await until(()=>s.window.sitePreview.state.count===1);
  s.click('[data-view="text"]');
  assert.equal(s.window.sitePreview.state.mode,'text');
  s.click('.menu-button'); assert.equal(s.document.querySelector('.menu-button').getAttribute('aria-expanded'),'true');
  s.click('.mobile-menu a:nth-child(2)'); await s.settle();
  assert.equal(s.document.documentElement.dataset.page,'about');
  assert.equal(s.document.querySelector('.menu-button').getAttribute('aria-expanded'),'false');
  s.pop('?view=text&work_category=personal-agent'); await s.settle();
  assert.equal(s.window.sitePreview.state.mode,'text');
  assert.equal(s.window.sitePreview.state.count,1);
  assert.equal(s.scrolls,1);
  assert.equal(s.errors.length,0);
});

test('direct About entry and reduced motion navigate without reloading', async t => {
  const s = await setup(t,{about:true,reduced:true});
  const id=s.window.navigationPreview.state.documentId;
  s.click('.main-nav a:first-child'); await s.settle();
  assert.equal(s.window.navigationPreview.state.documentId,id);
  assert.equal(s.document.documentElement.dataset.page,'work');
  assert.equal(s.document.querySelectorAll('.visual-card').length,4);
});

test('browser Back during the entrance queues the route instead of desynchronizing the URL', async t => {
  const s = await setup(t);
  s.click('.main-nav a:nth-child(2)');
  await until(()=>s.window.location.pathname.endsWith('/about/'));
  s.pop('');
  await until(()=>s.window.navigationPreview.state.navigationCount===2 && !s.window.navigationPreview.state.busy);
  assert.equal(s.document.documentElement.dataset.page,'work');
  assert.equal(s.scrolls,1);
});

test('failed content mount restores the prior page and can be retried', async t => {
  const s = await setup(t);
  s.fail.add('src/data/ryan-content.json');
  s.click('.main-nav a:nth-child(2)'); await s.settle();
  assert.equal(s.document.documentElement.dataset.page,'work');
  assert.equal(s.window.location.pathname,prefix);
  assert.equal(s.document.querySelector('#scroll-content').inert,false);
  assert.equal(s.scrolls,1);
  s.fail.clear();
  s.click('.main-nav a:nth-child(2)'); await s.settle();
  assert.equal(s.document.documentElement.dataset.page,'about');
  assert.equal(s.document.querySelectorAll('.article-row').length,4);
});

test('failed route fetch leaves the prior page interactive and retryable', async t => {
  const s = await setup(t,{initialFailures:['about/index.html']});
  s.click('.main-nav a:nth-child(2)'); await s.settle();
  assert.equal(s.document.documentElement.dataset.page,'work');
  assert.equal(s.document.querySelector('#scroll-content').inert,false);
  assert.equal(s.scrolls,1);
  s.fail.clear();
  s.click('.main-nav a:nth-child(2)'); await s.settle();
  assert.equal(s.document.documentElement.dataset.page,'about');
});
