import {readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, resolve, extname} from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(root, 'index.html'), 'utf8');
const types = {'.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2'};
const output = source.replace(/assets\/(?:images|fonts)\/[A-Za-z0-9._-]+/g, path => {
  const type = types[extname(path)];
  if (!type) throw new Error('Unsupported asset: ' + path);
  return `data:${type};base64,${readFileSync(resolve(root, path)).toString('base64')}`;
});
writeFileSync(resolve(root, '个人主页.html'), output);
console.log('已生成个人主页.html，' + (Buffer.byteLength(output) / 1024 / 1024).toFixed(2) + ' MB');
