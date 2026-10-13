import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../site/', import.meta.url));
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.json':'application/json'};
http.createServer(async (request,response)=>{
  try {
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const candidate=path.resolve(root,`.${pathname==='/'?'/index.html':pathname}`);
    if(candidate!==root&&!candidate.startsWith(root+path.sep)){response.writeHead(403);response.end();return;}
    const info=await stat(candidate);
    if(!info.isFile()){response.writeHead(404);response.end();return;}
    response.writeHead(200,{'Content-Type':mime[path.extname(candidate)]||'application/octet-stream','Cache-Control':'no-store'});
    response.end(await readFile(candidate));
  } catch {response.writeHead(404);response.end('Not found');}
}).listen(8877,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:8877'));
