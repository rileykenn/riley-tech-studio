const fs = require('fs');
const path = require('path');

const BUILD_TIME = new Date().toISOString();
const BLOG_MD_DIR = path.join(__dirname, 'public', 'raw-blog-md-files');

/**
 * Reads dateModified from a blog post's frontmatter.
 * Contract (top of each md file):
 * ---
 * datePublished: <value>
 * dateModified: <value>
 * ---
 * Returns an ISO string, or null if the frontmatter/field is absent or not a valid date.
 */
function blogLastmod(slug) {
  try {
    const raw = fs.readFileSync(path.join(BLOG_MD_DIR, `${slug}.md`), 'utf8');
    if (!raw.startsWith('---')) return null;
    const end = raw.indexOf('---', 3);
    if (end === -1) return null;
    const frontmatter = raw.slice(3, end);
    const match = frontmatter.match(/^dateModified:\s*(.+)\s*$/m);
    if (!match) return null;
    const parsed = Date.parse(match[1].trim());
    if (Number.isNaN(parsed)) return null;
    return new Date(parsed).toISOString();
  } catch {
    return null;
  }
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.rileytechstudio.com.au',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ['/icon.png'],
  transform: async (config, loc) => {
    let lastmod = BUILD_TIME;
    const blogMatch = loc.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) {
      lastmod = blogLastmod(blogMatch[1]) || BUILD_TIME;
    }
    return { loc, lastmod };
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'Bingbot', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
    ],
  },
};
