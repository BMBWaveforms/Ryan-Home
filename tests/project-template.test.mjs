import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Window} from 'happy-dom';
import {loadProjectPage, renderProjectPage} from '../scripts/project-pages.mjs';

test('project metadata is escaped while authored media and free-form story remain usable', async t => {
  const html = renderProjectPage({
    template:await readFile('templates/project-page.html','utf8'),
    project:{title:'A & B <实验>',description:'"说明" & <内容>',chapters:[{id:'research',label:'研究 & 判断'}]},
    hero:'<h1>项目自己的主标题</h1><figure class="project-hero-media"><img src="../../public/custom/cover.png" alt="项目封面"></figure>',
    story:'<section class="project-section" id="research"><h2>研究与判断</h2><div class="project-copy"><p>自定义内容。</p></div></section>'
  });
  const window = new Window({url:'https://example.com/Ryan-Home/projects/another-project/',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
  t.after(()=>window.happyDOM.abort());
  window.document.write(html);
  assert.equal(window.document.title,'A & B <实验> — Ryan');
  assert.equal(window.document.querySelector('meta[name=description]').content,'"说明" & <内容>');
  assert.equal(window.document.querySelector('.project-index a').textContent,'研究 & 判断');
  assert.equal(window.document.querySelector('.project-index a').hash,'#research');
  assert.equal(window.document.querySelector('.project-hero-media img').src,'https://example.com/Ryan-Home/public/custom/cover.png');
  assert.equal(window.document.querySelector('.project-return').href,'https://example.com/Ryan-Home/');
  assert.equal(window.document.querySelectorAll('.project-lightbox').length,1);
  assert.equal(html.includes('银河漫游'),false);
});

test('invalid or out-of-order chapter links fail before publishing a broken index', async () => {
  const template = await readFile('templates/project-page.html','utf8');
  const content = {template,hero:'<h1>项目</h1>',story:'<section class="project-section" id="first"></section><section class="project-section" id="second"></section>'};
  assert.throws(()=>renderProjectPage({...content,project:{title:'项目',description:'简介',chapters:[{id:'second',label:'第二章'},{id:'first',label:'第一章'}]}}),/section IDs and order/);
  assert.throws(()=>renderProjectPage({...content,project:{title:'项目',description:'简介',chapters:[{id:'first',label:'第一章'},{id:'first',label:'重复章节'}]}}),/unique slugs/);
  assert.equal(await loadProjectPage(process.cwd(),'../outside'),null);
});
