// Generates public/llms.txt and public/llms-full.txt from the raw blog markdown files.
// Plain Node, no dependencies. Run via `node scripts/generate-llms.mjs` (wired into postbuild).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BLOG_MD_DIR = path.join(ROOT, 'public', 'raw-blog-md-files');
const SITE_URL = 'https://www.rileytechstudio.com.au';

const SUMMARY =
  'Riley Tech Studio is a software studio on the South Coast of NSW, Australia, building custom software, web apps, SaaS products, websites and booking systems for businesses across the Shoalhaven and Illawarra. The studio designs and ships production software end to end — from idea validation through to launch and ongoing iteration.';

/** Strips the frontmatter block (--- ... ---) from the top of a markdown file, if present. */
function stripFrontmatter(raw) {
  if (!raw.startsWith('---')) return raw;
  const end = raw.indexOf('---', 3);
  if (end === -1) return raw;
  return raw.slice(end + 3).replace(/^\s+/, '');
}

/** Returns the first H1 heading text, or the slug as a fallback. */
function parseTitle(body, slug) {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : slug;
}

const posts = fs
  .readdirSync(BLOG_MD_DIR)
  .filter((file) => file.endsWith('.md'))
  .sort()
  .map((file) => {
    const slug = file.replace(/\.md$/, '');
    const body = stripFrontmatter(fs.readFileSync(path.join(BLOG_MD_DIR, file), 'utf8')).trim();
    return {
      slug,
      title: parseTitle(body, slug),
      body,
      canonical: `${SITE_URL}/blog/${slug}`,
      rawMirror: `${SITE_URL}/raw-blog-md-files/${slug}.md`,
    };
  });

const header = [
  '# Riley Tech Studio',
  '',
  `> ${SUMMARY}`,
  '',
  '## Key links',
  '',
  `- [Home](${SITE_URL}/)`,
  `- [About](${SITE_URL}/about)`,
  `- [Blog](${SITE_URL}/blog)`,
  `- [Contact](${SITE_URL}/#contact)`,
].join('\n');

const llmsTxt = [
  header,
  '',
  '## Blog',
  '',
  ...posts.map(
    (post) => `- [${post.title}](${post.canonical}) — raw markdown: ${post.rawMirror}`,
  ),
  '',
].join('\n');

const llmsFullTxt = [
  header,
  '',
  ...posts.map((post) => ['---', '', `Canonical URL: ${post.canonical}`, '', post.body, ''].join('\n')),
].join('\n');

fs.writeFileSync(path.join(ROOT, 'public', 'llms.txt'), llmsTxt);
fs.writeFileSync(path.join(ROOT, 'public', 'llms-full.txt'), llmsFullTxt);

console.log(`Wrote public/llms.txt (${posts.length} posts) and public/llms-full.txt`);
