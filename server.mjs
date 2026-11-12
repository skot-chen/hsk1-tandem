// @ts-check
// HSK1 Tandem — tiny zero-dependency server: serves the page and saves one JSON file.
// Safety: a save is only accepted if it is based on the latest saved version (rev),
// so an empty/stale browser tab can never overwrite the real learning log.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_DATA = path.join(HERE, '..', '..', 'data', 'hsk1-tandem', 'state.json');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };

/** @param {string} file */
async function readState(file) {
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch (e) {
    if (/** @type {any} */ (e).code === 'ENOENT') return { rev: 0 };
    throw e;
  }
}

/** @param {string} file @param {any} state */
async function writeState(file, state) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  try { await fs.copyFile(file, file + '.bak'); } catch { /* first save */ }
  const tmp = file + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(state, null, 1));
  await fs.rename(tmp, file);
}

/** @param {http.IncomingMessage} req */
function readBody(req) {
  return new Promise((resolve, reject) => {
    let s = '';
    req.on('data', (c) => { s += c; if (s.length > 5e6) reject(new Error('too big')); });
    req.on('end', () => resolve(s));
    req.on('error', reject);
  });
}

/** @param {{dataFile?: string}} [opts] */
export function createServer(opts = {}) {
  const dataFile = opts.dataFile || process.env.HSK1_DATA || DEFAULT_DATA;
  let queue = Promise.resolve(); // serialise saves
  return http.createServer(async (req, res) => {
    const url = new URL(req.url || '/', 'http://x');
    /** @param {number} code @param {any} obj */
    const send = (code, obj) => { res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(obj)); };
    try {
      if (url.pathname === '/api/state' && req.method === 'GET') return send(200, await readState(dataFile));
      if (url.pathname === '/api/state' && req.method === 'PUT') {
        const body = JSON.parse(await readBody(req));
        const result = await (queue = queue.then(async () => {
          const cur = await readState(dataFile);
          if ((cur.rev || 0) !== body.baseRev) return { code: 409, obj: cur };
          const next = { ...body.state, rev: (cur.rev || 0) + 1, savedAt: new Date().toISOString() };
          await writeState(dataFile, next);
          return { code: 200, obj: { rev: next.rev } };
        }).catch((e) => ({ code: 500, obj: { error: String(e) } })));
        return send(result.code, result.obj);
      }
      // static files: everything (page + course content) lives in public/
      let rel = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
      const base = path.join(HERE, 'public');
      const file = path.normalize(path.join(base, rel));
      if (!file.startsWith(base)) return send(403, { error: 'forbidden' });
      const data = await fs.readFile(file);
      res.writeHead(200, { 'content-type': TYPES[/** @type {keyof TYPES} */ (path.extname(file))] || 'application/octet-stream', 'cache-control': 'no-cache' });
      res.end(data);
    } catch (e) {
      if (/** @type {any} */ (e).code === 'ENOENT') return send(404, { error: 'not found' });
      send(500, { error: String(e) });
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const PORT = Number(process.env.PORT) || 8767;
  createServer().listen(PORT, '127.0.0.1', () => {
    const link = `http://localhost:${PORT}`;
    console.log(`HSK1 Tandem running at ${link}  (data: ${process.env.HSK1_DATA || DEFAULT_DATA})`);
    console.log('Close this window to stop.');
    if (process.argv.includes('--open')) exec(`start "" ${link}`);
  });
}
