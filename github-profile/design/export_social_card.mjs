import {Browser} from '/Users/bmb/AI/Skills/community/design/design-taste-frontend/scripts/lib/cdp.mjs';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {dirname,resolve} from 'node:path';

const here=dirname(fileURLToPath(import.meta.url));
const browser=await Browser.launch();
try{
  const page=await browser.newPage({width:1200,height:1000});
  await page.send('Emulation.setDefaultBackgroundColorOverride',{color:{r:0,g:0,b:0,a:0}});
  await page.goto(pathToFileURL(resolve(here,'social-card.html')).href,{timeoutMs:1500,settleMs:100});
  await page.eval(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
  const results=[];
  for(const [name,width] of [['social-card',1200],['social-card-mobile',660]]){
    await page.setViewport({width,height:1400});
    const size=await page.eval(()=>({width:document.querySelector('.sheet').offsetWidth,height:Math.ceil(document.querySelector('.sheet').getBoundingClientRect().height)}));
    await page.setViewport(size);
    await page.screenshot({path:resolve(here,'../profile/assets',name+'.png'),format:'png'});
    results.push({name,...size});
  }
  console.log(JSON.stringify(results));
}finally{await browser.close();}
