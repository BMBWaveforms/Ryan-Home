"""Fetch first-party Work content/assets for a local editable recreation. No production JS is executed."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from html import unescape
from urllib.parse import urljoin,quote,urlparse
import subprocess,json,re,time
ROOT=Path(__file__).resolve().parents[4]
BASE='https://shiftbrain.com'
EVIDENCE=ROOT/'docs/research/shiftbrain/assets'
PUBLIC=ROOT/'public/sites/shiftbrain'
DATA=ROOT/'src/data'
for p in [PUBLIC/'images',PUBLIC/'videos',PUBLIC/'fonts',PUBLIC/'icons',DATA]:p.mkdir(parents=True,exist_ok=True)

def fetch(source,dest,cap=None):
 dest.parent.mkdir(parents=True,exist_ok=True)
 args=['curl','-L','--fail','--silent','--show-error','--retry','1','--max-time','90']
 if cap:args+=['--max-filesize',str(cap)]
 args += [quote(urljoin(BASE,source),safe=':/?=&%@'),'-o',str(dest)]
 result=subprocess.run(args,capture_output=True,text=True)
 if result.returncode:
  dest.unlink(missing_ok=True)
  return {'source':urljoin(BASE,source),'error':result.stderr.strip()}
 filetype=subprocess.run(['file','-b','--mime-type',str(dest)],capture_output=True,text=True).stdout.strip()
 record={'source':urljoin(BASE,source),'local':'/'+str(dest.relative_to(ROOT/'public')),'bytes':dest.stat().st_size,'type':filetype}
 if filetype.startswith('image/') and filetype!='image/svg+xml':
  dimensions=subprocess.run(['sips','-g','pixelWidth','-g','pixelHeight',str(dest)],capture_output=True,text=True).stdout
  for key in ['pixelWidth','pixelHeight']:
   m=re.search(key+r':\s*(\d+)',dimensions)
   if m:record[{'pixelWidth':'width','pixelHeight':'height'}[key]]=int(m[1])
 return record

def category(cat):
 slug,cid,label=cat
 result=subprocess.run(['curl','-L','--fail','--silent','--show-error','--max-time','30',BASE+'/wp-json/my-theme/work','--data',f'locale=ja&term_taxonomy_id={cid}'],capture_output=True,text=True,check=True)
 data=json.loads(result.stdout);(EVIDENCE/f'catalog-{slug}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
 return slug,[p['link'] for p in data['posts']]
categories=[('brand',6,'Brand'),('global',9,'Global'),('independent',7,'Independent'),('promotion',5,'Promotion'),('recruit',8,'Recruit'),('media',16,'Media')]
raw=json.loads((EVIDENCE/'catalog-all.json').read_text())['posts']
with ThreadPoolExecutor(max_workers=6) as pool: memberships=dict(pool.map(category,categories))

def plain(html):return unescape(re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',html))).strip()
projects=[];jobs=[]
for i,p in enumerate(raw):
 slug=p['link'].strip('/').split('/')[-1]
 ext=Path(urlparse(p['cover']).path).suffix.lower() or '.jpg'
 image=PUBLIC/'images'/f'{i+1:02d}-{slug}{ext}'
 entry={'id':i+1,'slug':slug,'title':plain(p['title']),'titleHtml':p['title'],'client':unescape(p['client']),'date':p['date'],'outputs':[x.strip() for x in p['outputs'].split(',') if x.strip()],'roles':[x.strip() for x in p['roles'].split(',') if x.strip()],'overview':plain(p['overview'].get('ja','')),'overviewEn':plain(p['overview'].get('en','')),'overviewHtml':p['overview'],'categories':[slug2 for slug2,links in memberships.items() if p['link'] in links],'url':urljoin(BASE,p['link']),'image':'/'+str(image.relative_to(ROOT/'public')),'imageSource':urljoin(BASE,p['cover']),'video':None,'videoSource':urljoin(BASE,p['video']) if p['video'] else None,'pickup':bool(p['pick_up']),'theme':p['theme']}
 projects.append(entry);jobs.append((entry,'image',p['cover'],image,12*1024*1024))
 if p['video']:
  video=PUBLIC/'videos'/f'{i+1:02d}-{slug}.mp4';jobs.append((entry,'video',p['video'],video,15*1024*1024))
fonts=[('/wp-content/themes/my-theme/assets/fonts/TTNorms-ExtraLight.8ea04972.woff2','TTNorms-ExtraLight.woff2'),('/wp-content/themes/my-theme/assets/fonts/TTNorms-Regular.20e63fea.woff','TTNorms-Regular.woff'),('/wp-content/themes/my-theme/assets/fonts/TTNorms-Light.97d37e75.woff2','TTNorms-Light.woff2'),('https://cdn.jsdelivr.net/npm/yakuhanjp@4.1.1/dist/fonts/YakuHanJP/YakuHanJP-Light.woff2','YakuHanJP-Light.woff2')]
for source,name in fonts:jobs.insert(0,(None,'font',source,PUBLIC/'fonts'/name,None))
manifest=[];errors=[]
with ThreadPoolExecutor(max_workers=8) as pool:
 futures={pool.submit(fetch,source,dest,cap):(entry,kind) for entry,kind,source,dest,cap in jobs}
 for j,f in enumerate(as_completed(futures),1):
  entry,kind=futures[f]
  try:rec=f.result()
  except Exception as e:rec={'error':str(e),'id':entry and entry['id'],'kind':kind}
  if 'error' in rec:errors.append(rec)
  else:
   rec['kind']=kind;rec['projectId']=entry and entry['id'];manifest.append(rec)
   if entry:
    entry[kind]=rec['local']
    if kind=='image':entry['imageWidth']=rec.get('width');entry['imageHeight']=rec.get('height')
  if j%15==0:print(f'downloaded {j}/{len(jobs)}',flush=True)
result={'source':BASE+'/','fetchedAt':'2026-10-19','filters':[{'id':s,'label':label,'taxonomyId':cid} for s,cid,label in categories],'projects':projects,'fonts':[{'family':name.split('.')[0],'path':'/sites/shiftbrain/fonts/'+name} for _,name in fonts]}
(DATA/'shiftbrain-projects.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
(EVIDENCE/'manifest.json').write_text(json.dumps({'assets':sorted(manifest,key=lambda x:x['local']),'errors':errors,'totalBytes':sum(x['bytes'] for x in manifest)},ensure_ascii=False,indent=2))
print(json.dumps({'projects':len(projects),'assets':len(manifest),'totalBytes':sum(x['bytes'] for x in manifest),'errors':errors},ensure_ascii=False),flush=True)
