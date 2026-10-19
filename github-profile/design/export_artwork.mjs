import {Browser} from '/Users/bmb/AI/Skills/community/design/design-taste-frontend/scripts/lib/cdp.mjs';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {resolve, dirname} from 'node:path';
import {mkdirSync} from 'node:fs';

const here=dirname(fileURLToPath(import.meta.url));
const assets=resolve(here,'../profile/assets');
const selected=new Set(process.argv.slice(2));
mkdirSync(assets,{recursive:true});
const browser=await Browser.launch();
try {
  const page=await browser.newPage({width:1200,height:500});
  await page.goto(pathToFileURL(resolve(here,'artboards.html')).href,{timeoutMs:1500,settleMs:100});
  await page.eval(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
  const results=[];
  for(const [id,width,height,filename] of [['hero',1200,280,'ryan-cover-v2.png'],['avatar',480,480,'ryan-avatar.png'],['agent',680,300,'project-agent.png'],['research',680,300,'project-research.png'],['character',680,300,'project-character.png'],['site',680,300,'project-site.png']]){
    if(selected.size&&!selected.has(id))continue;
    await page.setViewport({width,height});
    await page.eval(id=>{document.querySelectorAll('.art').forEach(el=>el.style.display=el.id===id?'':'none');window.scrollTo(0,0);},id);
    const dimensions=await page.eval(id=>{const r=document.getElementById(id).getBoundingClientRect();return {width:r.width,height:r.height,x:r.x,y:r.y};},id);
    if(dimensions.width!==width||dimensions.height!==height||dimensions.x!==0||dimensions.y!==0)throw new Error('Unexpected artboard dimensions '+id);
    await page.screenshot({path:resolve(assets,filename),format:'png'});
    results.push({id,filename,width,height});
  }
  console.log(JSON.stringify(results));
} finally {await browser.close();}
