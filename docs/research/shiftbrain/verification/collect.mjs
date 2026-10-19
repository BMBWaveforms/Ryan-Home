import http from 'node:http';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
const target = new URL('./render-checks.json',import.meta.url);
const reports = {};
http.createServer((req,res) => {
  res.setHeader('Access-Control-Allow-Origin','http://127.0.0.1:5173');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method === 'OPTIONS') {res.writeHead(204).end();return;}
  if (req.method !== 'POST') {res.writeHead(405).end();return;}
  let body = '';
  req.on('data',chunk => {body += chunk; if(body.length>50000)req.destroy();});
  req.on('end',() => {
    try {const report=JSON.parse(body);reports[report.name]=report;writeFileSync(target,JSON.stringify(reports,null,2));res.writeHead(201).end('Recorded');}
    catch {res.writeHead(400).end();}
  });
}).listen(5174,'127.0.0.1',()=>console.log('Render report collector http://127.0.0.1:5174'));
