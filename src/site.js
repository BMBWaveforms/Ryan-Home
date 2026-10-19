import {mountWork} from './work.js?v=20261020-pjax';
import {mountAbout} from './app.js?v=20261020-pjax';
import {createNavigation} from './page-transitions.js?v=20261020-pjax';

const loader = document.querySelector('.site-loader');
let revisit = false;
try { revisit = sessionStorage.getItem('ryan-entered') === 'yes'; } catch {}
if (new URLSearchParams(location.search).get('intro') === '1') revisit = false;
if (matchMedia('(prefers-reduced-motion: reduce)').matches || revisit) {
  loader?.remove();
  document.body.classList.add('is-ready');
} else {
  setTimeout(() => loader?.classList.add('is-out'), 3500);
  setTimeout(() => { loader?.classList.add('is-done'); document.body.classList.add('is-ready'); }, 4000);
  setTimeout(() => loader?.remove(), 4800);
  try { sessionStorage.setItem('ryan-entered', 'yes'); } catch {}
}

createNavigation({work:mountWork, about:mountAbout}).catch(error => {
  console.error(error);
  loader?.remove();
  document.body.classList.add('is-ready');
  document.documentElement.classList.remove('route-changing', 'route-leaving', 'route-entering');
  const notice = document.createElement('p');
  notice.className = 'noscript';
  notice.textContent = 'Content could not be loaded. Please reload the page.';
  document.querySelector('main').append(notice);
});
