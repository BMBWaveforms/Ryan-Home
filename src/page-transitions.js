// Persistent document navigation, matching SHIFTBRAIN's content-only fade sequence.
const base = new URL('../', import.meta.url);
const route = url => url.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
const routes = new Map([[route(base), 'work'], [route(new URL('about/', base)), 'about']]);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export async function createNavigation(mounts) {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cache = new Map();
  let currentPath = route(location);
  let busy = false;
  let runtime;
  let navigationCount = 0;
  let queuedPop;
  let currentURL = location.href;
  // Resolve relative fragment assets against their own route before adopting them.
  const absolutize = (container, url) => {
    container.querySelectorAll('a[href],use[href],img[src],video[src],video[poster],source[src]').forEach(element => {
      for (const name of ['href', 'src', 'poster']) {
        const value = element.getAttribute(name);
        if (value) element.setAttribute(name, new URL(value, url).href);
      }
    });
  };
  absolutize(document, location.href);
  if (!document.querySelector('.about-atmosphere')) {
    const atmosphere = document.createElement('div');
    atmosphere.className = 'about-atmosphere';
    atmosphere.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(atmosphere, document.querySelector('#scroll-content'));
  }
  const load = target => {
    const url = new URL(target); url.hash = '';
    // The HTML templates do not vary by Work filter or Text/Visual query state.
    const key = route(url);
    if (!cache.has(key)) {
      const promise = fetch(url, {headers:{'Accept':'text/html'}, signal:AbortSignal.timeout(10000)})
        .then(async response => {
          if (!response.ok) throw new Error(`Page request failed: ${response.status}`);
          const page = new DOMParser().parseFromString(await response.text(), 'text/html');
          if (!page.querySelector('#scroll-content') || page.documentElement.dataset.page !== routes.get(key)) throw new Error('Unexpected page response');
          absolutize(page, url.href);
          return page;
        }).catch(error => { cache.delete(key); throw error; });
      cache.set(key, promise);
    }
    return cache.get(key);
  };
  const prefetch = url => { if (routes.has(route(url))) load(url).catch(() => {}); };
  const syncShell = page => {
    for (const selector of ['.main-nav', '.mobile-menu nav']) {
      const oldLinks = [...document.querySelectorAll(`${selector} .nav-link`)];
      page.querySelectorAll(`${selector} .nav-link`).forEach((next, index) => {
        const old = oldLinks[index];
        old.href = next.href;
        old.classList.toggle('is-current', next.classList.contains('is-current'));
        if (next.hasAttribute('aria-current')) old.setAttribute('aria-current', 'page');
        else old.removeAttribute('aria-current');
      });
    }
    document.querySelector('.mobile-menu').classList.remove('is-open');
    document.querySelector('.mobile-menu').inert = true;
    document.querySelector('.menu-button').setAttribute('aria-expanded', 'false');
    document.querySelector('.menu-button').setAttribute('aria-label', 'Open menu');
  };
  const navigate = async (target, {pop = false} = {}) => {
    if (busy) return;
    busy = true;
    const previousURL = pop ? currentURL : location.href;
    const previousPage = new DOMParser().parseFromString(document.documentElement.outerHTML, 'text/html');
    const previousContent = document.querySelector('#scroll-content');
    const previousSwitcher = document.querySelector('.mode-switch');
    let swapped = false;
    root.classList.add('route-changing', 'route-leaving');
    document.querySelector('#scroll-content').inert = true;
    runtime.stop();
    try {
      const [page] = await Promise.all([load(target), delay(reduced.matches ? 0 : 500)]);
      runtime.dispose();
      const next = document.importNode(page.querySelector('#scroll-content'), true);
      next.inert = true;
      document.querySelector('#scroll-content').replaceWith(next);
      swapped = true;
      document.querySelector('.mode-switch')?.remove();
      const switcher = page.querySelector('.mode-switch');
      if (switcher) document.body.append(document.importNode(switcher, true));
      document.body.classList.remove('motion-enabled');
      document.body.style.overflow = '';
      document.body.style.height = '';
      root.dataset.page = page.documentElement.dataset.page;
      root.dataset.mode = root.dataset.page === 'about' || target.searchParams.get('view') === 'text' ? 'text' : 'visual';
      document.title = page.title;
      document.querySelector('meta[name="description"]').content = page.querySelector('meta[name="description"]').content;
      document.querySelector('meta[name="theme-color"]').content = root.dataset.mode === 'text' ? '#121212' : '#ffffff';
      if (!pop) history.pushState({}, '', target);
      currentPath = route(target);
      syncShell(page);
      window.scrollTo(0, 0);
      runtime = await mounts[root.dataset.page]();
      currentURL = location.href;
      // Establish opacity:0 on the new content before starting its delayed fade.
      getComputedStyle(next.querySelector('main')).opacity;
      root.classList.add('route-entering');
      root.classList.remove('route-leaving');
      navigationCount++;
      await delay(reduced.matches ? 0 : 1150);
      next.inert = false;
      const main = next.querySelector('main');
      main.tabIndex = -1;
      main.focus({preventScroll:true});
    } catch (error) {
      console.error('Page transition failed', error);
      // Keep navigation usable when a route request fails; never leave hidden content.
      if (swapped) {
        document.querySelector('#scroll-content').replaceWith(previousContent);
        document.querySelector('.mode-switch')?.remove();
        if (previousSwitcher) document.body.append(previousSwitcher);
        root.dataset.page = previousPage.documentElement.dataset.page;
        root.dataset.mode = previousPage.documentElement.dataset.mode;
        document.body.classList.remove('motion-enabled');
        document.title = previousPage.title;
        syncShell(previousPage);
        history.replaceState({}, '', previousURL);
        currentPath = route(new URL(previousURL));
        runtime = await mounts[root.dataset.page]();
      } else {
        runtime.start();
        if (pop) history.replaceState({}, '', previousURL);
      }
      document.querySelector('#scroll-content').inert = false;
    } finally {
      root.classList.remove('route-changing', 'route-leaving', 'route-entering');
      busy = false;
      if (queuedPop) {
        const target = queuedPop;
        queuedPop = null;
        if (route(target) !== currentPath) navigate(target, {pop:true});
      }
    }
  };
  runtime = await mounts[root.dataset.page]();
  history.scrollRestoration = 'manual';
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const target = new URL(link.href);
    if (target.origin !== location.origin || !routes.has(route(target)) || route(target) === currentPath) return;
    event.preventDefault();
    if (!busy) navigate(target);
  });
  for (const type of ['pointerover', 'focusin']) document.addEventListener(type, event => {
    const link = event.target.closest?.('.nav-link[href]');
    if (link) { const target = new URL(link.href); if (target.origin === location.origin) prefetch(target); }
  });
  addEventListener('popstate', () => {
    if (!routes.has(route(location))) return;
    if (busy) queuedPop = new URL(location.href);
    else if (route(location) !== currentPath) navigate(new URL(location.href), {pop:true});
  });
  // Read-only acceptance evidence: stable token proves navigation did not reload the document.
  const documentId = crypto.randomUUID();
  window.navigationPreview = {get state() {return {documentId, navigationCount, busy, page:root.dataset.page, reducedMotion:reduced.matches};}};
  const alternate = new URL(root.dataset.page === 'about' ? './' : 'about/', base);
  prefetch(alternate);
}
