import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import handler from '../api/contact.js';

const root = resolve(process.argv.includes('--dist') ? 'dist' : '.');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp'};
const server = http.createServer(async (req,res) => {
  const pathname = new URL(req.url,'http://localhost').pathname;
  if (pathname === '/api/contact') {
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
      if (Buffer.byteLength(raw) > 24000) {res.writeHead(413,{'Content-Type':'application/json'});res.end(JSON.stringify({ok:false,message:'Message too long.'}));return;}
    }
    req.body = raw;
    res.status = code => {res.statusCode = code;return res;};
    res.json = data => {res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};
    await handler(req,res);
    return;
  }
  try {
    const relative = decodeURIComponent(pathname).replace(/^\/+/, '') || 'index.html';
    const file = resolve(root,relative);
    if (!file.startsWith(root+sep) || !['.html','.css','.js','.webp'].includes(extname(file)) || /(^|[\\/])(?:api|scripts|node_modules)([\\/])/.test(relative)) throw new Error('Not public');
    const info = await stat(file);
    if (!info.isFile()) throw new Error('Not a file');
    res.writeHead(200,{'Content-Type':types[extname(file)],'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    if (req.method === 'HEAD') res.end();
    else res.end(await readFile(file));
  } catch {res.writeHead(404,{'Content-Type':'text/plain'});res.end('Page not found.');}
});
server.listen(4173,'127.0.0.1',() => console.log('LXY Visuals preview: http://127.0.0.1:4173'));
