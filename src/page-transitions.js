// A small cross-document transition shared by Work and About, including Pages subpaths.
(() => {
  const root = document.documentElement;
  const base = new URL('../', document.currentScript.src);
  const key = 'ryan-page-transition';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const route = url => url.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  const routes = new Set([route(base), route(new URL('about/', base))]);
  let leaving = false;
  let recovery;
  const reset = () => {
    leaving = false;
    root.classList.remove('page-leaving', 'page-arriving', 'page-entering');
    clearTimeout(recovery);
  };
  try {
    const pending = JSON.parse(sessionStorage.getItem(key) || 'null');
    sessionStorage.removeItem(key);
    if (!reduced.matches && pending?.target === location.href && Date.now() - pending.time < 15000) {
      root.classList.add('page-arriving');
      // A failed content request must never leave the site behind a curtain.
      recovery = setTimeout(reset, 5000);
    }
  } catch { /* Storage restrictions leave ordinary links fully functional. */ }

  window.RyanNavigation = {
    get arriving() { return root.classList.contains('page-arriving'); },
    ready() {
      if (!this.arriving) return;
      let revealed = false;
      const reveal = () => {
        if (revealed) return;
        revealed = true;
        clearTimeout(recovery);
        root.classList.add('page-entering');
        root.classList.remove('page-arriving');
        recovery = setTimeout(reset, 700);
      };
      requestAnimationFrame(() => requestAnimationFrame(reveal));
      // Safari can suspend animation frames for an occluded window or background tab.
      setTimeout(reveal, 80);
    }
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const target = new URL(link.href);
    if (target.origin !== location.origin || !routes.has(route(target)) || route(target) === route(location) || reduced.matches) return;
    if (leaving) { event.preventDefault(); return; }
    try {
      sessionStorage.setItem(key, JSON.stringify({target:target.href, time:Date.now()}));
    } catch { return; }
    event.preventDefault();
    leaving = true;
    root.classList.remove('page-entering');
    root.classList.add('page-leaving');
    setTimeout(() => location.assign(target.href), 340);
  });
  // Back/forward cache restores the old DOM, including any departure classes.
  addEventListener('pageshow', event => { if (event.persisted) reset(); });
})();
