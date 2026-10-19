import { cp, mkdir, readFile, access, rm } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
import { execFileSync } from 'node:child_process';
const root = resolve('.');
for (const file of ['src/app.js','src/work.js','scripts/serve.mjs','scripts/build.mjs']) execFileSync(process.execPath, ['--check',file], {stdio:'inherit'});
const catalog = JSON.parse(await readFile('src/data/work-placeholders.json','utf8'));
const media = new Set(catalog.projects.flatMap(project => [project.image,project.video]).filter(Boolean));
for (const path of media) await access(resolve(root,'public' + path));
// Replace only the generated build. Keep reference media in the local workspace,
// but omit it from the build unless an active project explicitly uses it.
await rm(resolve(root,'dist'), {recursive:true,force:true});
await mkdir(resolve(root,'dist'));
for (const entry of ['index.html','about','src','public','个人主页.html','.nojekyll']) {
  await cp(resolve(root,entry),resolve(root,'dist',entry), {recursive:true,filter:source => {
    const path = relative(root,source).split(sep).join('/');
    if (path === 'src/data/shiftbrain-projects.json') return false;
    if (/^public\/sites\/shiftbrain\/(images|videos)\//.test(path)) return media.has(path.slice('public'.length));
    if (path.startsWith('public/sites/shiftbrain/icons/')) return path.endsWith('/ryan-symbol.svg');
    return true;
  }});
}
const personal = JSON.parse(await readFile('src/data/ryan-content.json','utf8'));
console.log(`Built dist/: Work + About, ${personal.articles.length} articles, ${catalog.projects.length} editable Work placeholders.`);
