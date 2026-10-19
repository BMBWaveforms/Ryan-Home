// Each document fragment owns its listeners, observers, timers, and scroll controller.
export function createPageScope() {
  const controller = new AbortController();
  const cleanups = [];
  const timers = new Set();
  const frames = new Set();
  return {
    listen(target, type, handler, options = {}) {
      target?.addEventListener(type, handler, {...options, signal:controller.signal});
    },
    observe(target, callback) {
      const observer = new ResizeObserver(callback);
      observer.observe(target);
      cleanups.push(() => observer.disconnect());
    },
    onDispose(callback) { cleanups.push(callback); },
    setTimeout(callback, ms) {
      const id = window.setTimeout(() => { timers.delete(id); callback(); }, ms);
      timers.add(id);
      return id;
    },
    clearTimeout(id) { window.clearTimeout(id); timers.delete(id); },
    requestAnimationFrame(callback) {
      const id = window.requestAnimationFrame(time => { frames.delete(id); callback(time); });
      frames.add(id);
      return id;
    },
    cancelAnimationFrame(id) { window.cancelAnimationFrame(id); frames.delete(id); },
    dispose() {
      controller.abort();
      timers.forEach(id => window.clearTimeout(id));
      frames.forEach(id => window.cancelAnimationFrame(id));
      cleanups.splice(0).forEach(cleanup => cleanup());
      timers.clear(); frames.clear();
    }
  };
}
