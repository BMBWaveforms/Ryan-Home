import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
const args = process.argv.slice(2);
const option = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const root = resolve(option('--dir', '.'));
const port = Number(option('--port', process.env.PORT || 5173));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.avif':'image/avif','.gif':'image/gif','.mp4':'video/mp4','.woff':'font/woff','.woff2':'font/woff2','.ico':'image/x-icon'};
http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end(); return; }
  let file = resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
  if (existsSync(file) && statSync(file).isDirectory()) file = resolve(file, 'index.html');
  if (!existsSync(file) || !statSync(file).isFile()) { res.writeHead(404).end('Not found'); return; }
  const size = statSync(file).size;
  const headers = {'Content-Type':types[extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache'};
  const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if (range) {
    const start = Number(range[1]);
    const end = Math.min(range[2] ? Number(range[2]) : size - 1, size - 1);
    if (start > end) { res.writeHead(416, {'Content-Range':`bytes */${size}`}).end(); return; }
    res.writeHead(206, {...headers, 'Content-Range':`bytes ${start}-${end}/${size}`, 'Content-Length':end - start + 1});
    createReadStream(file, {start,end}).pipe(res);
  } else {
    res.writeHead(200, {...headers,'Content-Length':size});
    if (req.method === 'HEAD') res.end(); else createReadStream(file).pipe(res);
  }
}).listen(port, '127.0.0.1', () => console.log(`Work preview: http://127.0.0.1:${port}`));
