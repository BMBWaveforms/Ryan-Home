import '../public/vendor/locomotive-scroll.min.js';
import {createPageScope} from './page-lifecycle.js?v=20261020-pjax';

export async function mountProject() {
  const {listen, observe, onDispose, dispose, requestAnimationFrame} = createPageScope();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => reduced.matches ? 'instant' : 'smooth';
  const main = document.querySelector('main');
  const body = document.querySelector('.project-body');
  const index = document.querySelector('.project-index');
  const links = [...index.querySelectorAll('a')];
  const sections = links.map(link => document.querySelector(link.hash));
  const menu = document.querySelector('.mobile-menu');
  const menuButton = document.querySelector('.menu-button');
  const lightbox = document.querySelector('.project-lightbox');
  const scrollSections = [...document.querySelectorAll('[data-scroll-section]')].map(element => ({
    element, style:element.getAttribute('style')
  }));
  const errors = [];
  let scroller, desktop = innerWidth >= 1024, scrollY = window.scrollY;
  let menuOpen = false, indexVisible = false, currentId, lastImageButton, stopped = false;
  let alive = true;
  const indexSlot = document.createElement('div');
  indexSlot.className = 'project-index-slot';
  indexSlot.setAttribute('aria-hidden', 'true');
  index.replaceWith(indexSlot);
  document.body.append(index);
  // Fixed UI stays outside the transformed scroll container, including during reverse scroll.
  onDispose(() => {
    alive = false;
    if (lightbox.open) lightbox.close();
    indexSlot.replaceWith(index);
    index.style.removeProperty('top');
    index.style.removeProperty('visibility');
    destroyScroller();
    document.body.style.overflow = '';
    delete window.projectPreview;
  });
  listen(window, 'error', event => errors.push(event.message));
  listen(window, 'unhandledrejection', event => errors.push(String(event.reason)));
  function lockScroll() {
    const lock = stopped || menuOpen || lightbox.open;
    if (lock) scroller?.stop(); else scroller?.start();
    document.body.style.overflow = menuOpen || lightbox.open ? 'hidden' : '';
  }
  function setMenu(open) {
    menuOpen = open;
    menu.inert = !open;
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    main.inert = open;
    index.inert = open || !indexVisible;
    lockScroll();
    if (open) menu.querySelector('a').focus();
  }
  const nav = document.querySelector('.main-nav');
  const underline = document.querySelector('.nav-underline');
  function moveUnderline(link = nav.querySelector('a')) {
    underline.style.transform = 'translateX(' + (link.offsetLeft + 10) + 'px)';
  }
  function offset() {
    return parseFloat(getComputedStyle(main).getPropertyValue('--project-anchor-offset')) || 160;
  }
  function goTo(target, instant = false) {
    if (scroller) {
      scroller.scrollTo(target, {
        duration:instant || reduced.matches ? 0 : 900,
        easing:[.55,.05,.22,.99],
        offset:typeof target === 'number' ? 0 : -offset(),
        disableLerp:instant || reduced.matches
      });
    } else {
      const top = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY - offset();
      window.scrollTo({top, behavior:instant ? 'instant' : behavior()});
    }
  }
  function updateIndex() {
    const rect = body.getBoundingClientRect();
    const pin = desktop ? 170 : parseFloat(getComputedStyle(index).top) || 76;
    const top = desktop ? Math.min(Math.max(pin, rect.top), rect.bottom - index.offsetHeight) : pin;
    if (desktop) index.style.top = top + 'px'; else index.style.removeProperty('top');
    indexVisible = desktop
      ? rect.top < innerHeight && rect.bottom > 110
      : rect.top < pin + index.offsetHeight + 30 && rect.bottom > pin + index.offsetHeight;
    index.classList.toggle('is-visible', indexVisible);
    index.inert = menuOpen || !indexVisible;
    const line = desktop ? 240 : pin + index.offsetHeight + 45;
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= line) current = section;
    links.forEach(link => {
      const active = link.hash === '#' + current.id;
      link.classList.toggle('is-current', active);
      if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
    });
    if (currentId !== current.id && !desktop) {
      const active = links.find(link => link.hash === '#' + current.id);
      index.scrollTo({left:Math.max(0, active.offsetLeft - 15), behavior:behavior()});
    }
    currentId = current.id;
  }
  function onScroll(event) {
    scrollY = document.documentElement.classList.contains('has-scroll-smooth')
      ? event?.scroll?.y ?? 0
      : window.scrollY;
    updateIndex();
  }
  function destroyScroller() {
    scroller?.destroy();
    scroller = undefined;
    // Locomotive leaves section transforms and visibility behind on destroy.
    // Restore the native layout before changing scroll modes or remounting.
    scrollSections.forEach(({element, style}) => {
      if (style === null) element.removeAttribute('style'); else element.setAttribute('style', style);
      element.removeAttribute('data-scroll-section-inview');
    });
  }
  function createScroller() {
    destroyScroller();
    scroller = new window.LocomotiveScroll({
      el:document.querySelector('#scroll-content'),
      smooth:!reduced.matches, lerp:.1,
      smartphone:{smooth:false}, tablet:{smooth:false,breakpoint:1024},
      getDirection:true
    });
    scroller.on('scroll', onScroll);
    lockScroll();
  }
  let refreshPending = false;
  function refresh() {
    if (refreshPending || !alive) return;
    refreshPending = true;
    requestAnimationFrame(() => {
      refreshPending = false;
      scroller?.update();
      updateIndex();
    });
  }
  function restoreFragment() {
    const section = sections.find(section => '#' + section.id === location.hash);
    if (section) {
      // A browser fragment jump must not add native scrolling to transformed scrolling.
      if (document.documentElement.classList.contains('has-scroll-smooth') && window.scrollY) {
        window.scrollTo(0, 0);
        scroller?.update();
      }
      goTo(section, true);
    }
    updateIndex();
  }
  function installReveals() {
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    const targets = main.querySelectorAll('.project-eyebrow,.project-hero h1,.project-hero-media,.project-introduction,.project-facts,.project-section h2,.project-copy>p,.project-copy>h3,.project-gallery,.project-media,.project-photo,.project-awards,.project-decisions details,.project-return');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); observer.unobserve(entry.target); }
    }), {threshold:.06, rootMargin:'0px 0px -35px 0px'});
    onDispose(() => observer.disconnect());
    targets.forEach(element => { element.dataset.reveal = ''; observer.observe(element); });
    document.body.classList.add('motion-enabled');
  }
  listen(menuButton, 'click', () => setMenu(!menuOpen));
  menu.querySelectorAll('a').forEach((link, i) => {
    link.style.setProperty('--i', i);
    listen(link, 'click', () => setMenu(false));
  });
  listen(document, 'keydown', event => {
    if (event.key === 'Escape' && menuOpen) { setMenu(false); menuButton.focus(); }
    if (event.key === 'Tab' && menuOpen) {
      const items = [menuButton, ...menu.querySelectorAll('a')];
      const at = items.indexOf(document.activeElement);
      event.preventDefault();
      items[(at + (event.shiftKey ? -1 : 1) + items.length) % items.length].focus();
    }
  });
  nav.querySelectorAll('a').forEach(link => {
    listen(link, 'mouseenter', () => moveUnderline(link));
    listen(link, 'focus', () => moveUnderline(link));
  });
  listen(nav, 'mouseleave', () => moveUnderline());
  listen(nav, 'focusout', () => moveUnderline());
  links.forEach(link => listen(link, 'click', event => {
    event.preventDefault();
    const section = document.querySelector(link.hash);
    goTo(section);
    history.replaceState(null, '', link.hash);
    section.tabIndex = -1;
    section.focus({preventScroll:true});
  }));
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    const slides = [...track.querySelectorAll('.gallery-slide')];
    const prev = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    let current = 0, dragging = false, moved = false, originX = 0, originScroll = 0;
    const sync = () => {
      current = slides.reduce((best, slide, i) => Math.abs(slide.offsetLeft - track.offsetLeft - track.scrollLeft) < Math.abs(slides[best].offsetLeft - track.offsetLeft - track.scrollLeft) ? i : best, 0);
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 3) current = slides.length - 1;
      prev.disabled = current === 0;
      next.disabled = current === slides.length - 1;
      gallery.querySelector('.gallery-count').textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
    };
    const go = delta => {
      const at = Math.min(slides.length - 1, Math.max(0, current + delta));
      track.scrollTo({left:slides[at].offsetLeft - slides[0].offsetLeft, behavior:behavior()});
    };
    listen(prev, 'click', () => go(-1));
    listen(next, 'click', () => go(1));
    listen(track, 'scroll', sync, {passive:true});
    listen(track, 'wheel', event => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) event.stopPropagation();
    }, {passive:true});
    listen(track, 'keydown', event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault(); go(event.key === 'ArrowLeft' ? -1 : 1);
    });
    listen(track, 'pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragging = true; moved = false; originX = event.clientX; originScroll = track.scrollLeft;
    });
    listen(window, 'pointermove', event => {
      if (!dragging) return;
      const delta = event.clientX - originX;
      if (Math.abs(delta) > 5) { moved = true; track.classList.add('is-dragging'); event.preventDefault(); track.scrollLeft = originScroll - delta; }
    });
    listen(window, 'pointerup', () => { dragging = false; track.classList.remove('is-dragging'); });
    listen(track, 'click', event => { if (moved) { event.preventDefault(); event.stopPropagation(); moved = false; } }, {capture:true});
    listen(track, 'dragstart', event => event.preventDefault());
    listen(window, 'resize', sync);
    sync();
  });
  document.querySelectorAll('.image-open').forEach(button => listen(button, 'click', () => {
    if (typeof lightbox.showModal !== 'function') return;
    const source = button.querySelector('img'), target = lightbox.querySelector('img');
    target.src = source.currentSrc || source.src; target.alt = source.alt;
    lightbox.querySelector('.lightbox-caption').textContent = button.closest('figure').querySelector('figcaption')?.textContent || source.alt;
    lastImageButton = button;
    lightbox.showModal();
    index.inert = true;
    lockScroll();
  }));
  listen(lightbox.querySelector('.lightbox-close'), 'click', () => lightbox.close());
  listen(lightbox, 'click', event => { if (event.target === lightbox) lightbox.close(); });
  listen(lightbox, 'close', () => { lockScroll(); updateIndex(); lastImageButton?.focus({preventScroll:true}); });
  document.querySelectorAll('.project-decisions details').forEach(details => {
    let animation, expanded = details.open;
    const summary = details.querySelector('summary');
    onDispose(() => { animation?.cancel(); details.style.overflow = ''; });
    listen(details, 'toggle', () => { if (!animation) expanded = details.open; refresh(); });
    listen(summary, 'click', event => {
      if (reduced.matches || typeof details.animate !== 'function') return;
      event.preventDefault();
      const start = details.getBoundingClientRect().height;
      expanded = !expanded;
      animation?.cancel();
      details.style.height = '';
      details.open = true;
      const end = expanded ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 1;
      details.style.overflow = 'hidden';
      const running = details.animate([{height:start + 'px'}, {height:end + 'px'}], {
        duration:500, easing:'cubic-bezier(.18,.06,.23,1)', fill:'both'
      });
      animation = running;
      running.finished.then(() => {
        if (animation !== running) return;
        details.open = expanded;
        running.cancel();
        details.style.overflow = '';
        animation = undefined;
        refresh();
      }).catch(() => {});
    });
  });
  listen(document.querySelector('.back-to-top'), 'click', () => goTo(0));
  listen(window, 'resize', () => {
    moveUnderline();
    if ((innerWidth >= 1024) !== desktop) {
      const position = scrollY;
      desktop = innerWidth >= 1024;
      createScroller();
      goTo(position, true);
    }
    currentId = undefined;
    if (innerWidth > 768 && menuOpen) setMenu(false);
    refresh();
  });
  listen(window, 'hashchange', restoreFragment);
  listen(window, 'scroll', () => {
    if (document.documentElement.classList.contains('has-scroll-smooth') && window.scrollY) restoreFragment();
  }, {passive:true});
  listen(window, 'pageshow', () => { refresh(); restoreFragment(); });
  listen(window, 'load', () => { refresh(); restoreFragment(); });
  document.querySelectorAll('img').forEach(image => listen(image, 'load', refresh));
  try {
    await document.fonts.ready;
    installReveals();
    createScroller();
    moveUnderline();
    observe(main, refresh);
    restoreFragment();
    window.projectPreview = {get state() {return {
      scroll:scrollY, current:currentId, pinned:indexVisible,
      smoothScroll:document.documentElement.classList.contains('has-scroll-smooth'),
      errors:[...errors]
    };}};
    return {
      dispose,
      stop() { stopped = true; lockScroll(); },
      start() { stopped = false; lockScroll(); }
    };
  } catch (error) { dispose(); throw error; }
}
