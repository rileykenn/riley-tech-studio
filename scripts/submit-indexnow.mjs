// Submits every URL in public/sitemap-0.xml to IndexNow (api.indexnow.org).
// Plain Node, no dependencies. MANUAL USE ONLY — run `node scripts/submit-indexnow.mjs`
// after a production deploy. Deliberately NOT wired into postbuild.
//
// The key below must match the file public/<key>.txt (served at the site root).
// If you ever rotate the key, generate a new one (e.g. `openssl rand -hex 16`),
// write it to public/<key>.txt with no trailing newline, and update KEY here.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const HOST = 'www.rileytechstudio.com.au';
const KEY = '166b42147a7113879aeaa4a546758a8d';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const sitemap = fs.readFileSync(path.join(ROOT, 'public', 'sitemap-0.xml'), 'utf8');
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, loc]) =>
  loc
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"'),
);

if (urlList.length === 0) {
  console.error('No <loc> URLs found in public/sitemap-0.xml — aborting.');
  process.exit(1);
}

console.log(`Submitting ${urlList.length} URLs to IndexNow for ${HOST}...`);

const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  }),
});

console.log(`IndexNow response: ${response.status} ${response.statusText}`);
