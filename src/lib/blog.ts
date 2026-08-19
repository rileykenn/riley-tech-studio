import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'public', 'raw-blog-md-files');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date string from frontmatter, or undefined if not set */
  datePublished?: string;
  /** ISO date string from frontmatter, or undefined if not set */
  dateModified?: string;
}

export interface BlogPostFull extends BlogPost {
  content: string;
}

interface Frontmatter {
  datePublished?: string;
  dateModified?: string;
}

/**
 * Parse the frontmatter block at the very top of a markdown file:
 *
 * ---
 * datePublished: <value>
 * dateModified: <value>
 * ---
 *
 * Values of "undefined", "null", or empty are treated as unset.
 * Returns the parsed keys plus the content with frontmatter stripped,
 * so it can never leak into titles, excerpts, or rendered HTML.
 */
export function parseFrontmatter(raw: string): {
  data: Frontmatter;
  content: string;
} {
  const source = raw.replace(/^\uFEFF/, '');
  const match = source.match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/);
  if (!match) return { data: {}, content: source };

  const data: Frontmatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':');
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    let value = line.slice(sep + 1).trim();
    // Strip optional surrounding quotes
    value = value.replace(/^['"]/, '').replace(/['"]$/, '');
    if (!value || value === 'undefined' || value === 'null') continue;
    if (key === 'datePublished') data.datePublished = value;
    if (key === 'dateModified') data.dateModified = value;
  }
  return { data, content: source.slice(match[0].length).trimStart() };
}

/** Format an ISO date string for display, e.g. "17 May 2026" */
export function formatPostDate(isoDate: string): string {
  const timestamp = Date.parse(isoDate);
  if (Number.isNaN(timestamp)) return isoDate;
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(timestamp));
}

/** Extract the first H1 heading from markdown content */
export function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

/**
 * Extract the first non-heading paragraph, ending at a sentence boundary
 * within maxLen chars (no mid-sentence truncation).
 */
export function extractExcerpt(content: string, maxLen = 160): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip headings, horizontal rules, blockquotes, empty lines, HTML
    if (
      !trimmed ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('>') ||
      trimmed.startsWith('---') ||
      trimmed.startsWith('<')
    ) {
      continue;
    }
    // Strip inline markdown: bold, italic, links, code, asterisks
    const plain = trimmed
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
      .replace(/[*_`~]/g, '')                   // emphasis
      .replace(/\s+/g, ' ')
      .trim();
    if (!plain) continue;
    if (plain.length <= maxLen) return plain;

    // Cut at the last sentence boundary that fits within maxLen
    // (punctuation followed by whitespace or end of text)
    const boundary = /[.!?]["')\]]?(?=\s|$)/g;
    let end = 0;
    let match: RegExpExecArray | null;
    while ((match = boundary.exec(plain)) !== null) {
      const candidateEnd = match.index + match[0].length;
      if (candidateEnd > maxLen) break;
      end = candidateEnd;
    }
    if (end > 0) return plain.slice(0, end);

    // Fallback: no sentence boundary fits — cut at the last word boundary
    const cut = plain.slice(0, maxLen - 1);
    const lastSpace = cut.lastIndexOf(' ');
    return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + '…';
  }
  return '';
}

/** Get all slugs (filenames without .md extension) */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

/** Get all blog post metadata, sorted by datePublished descending (tie-break by title) */
export function getAllPosts(): BlogPost[] {
  const slugs = getAllSlugs();
  const posts = slugs.map((slug) => {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = parseFrontmatter(raw);
    return {
      slug,
      title: extractTitle(content),
      excerpt: extractExcerpt(content),
      datePublished: data.datePublished,
      dateModified: data.dateModified,
    };
  });
  return posts.sort((a, b) => {
    const aTime = a.datePublished ? Date.parse(a.datePublished) : NaN;
    const bTime = b.datePublished ? Date.parse(b.datePublished) : NaN;
    const aValid = !Number.isNaN(aTime);
    const bValid = !Number.isNaN(bTime);
    if (aValid && bValid && aTime !== bTime) return bTime - aTime;
    if (aValid !== bValid) return aValid ? -1 : 1; // undated posts last
    return a.title.localeCompare(b.title);
  });
}

/** Get a single post's content, or null if not found */
export function getPostBySlug(slug: string): BlogPostFull | null {
  // Sanitise slug to prevent path traversal
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '');
  const filePath = path.join(BLOG_DIR, `${safeSlug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = parseFrontmatter(raw);
  return {
    slug: safeSlug,
    title: extractTitle(content),
    excerpt: extractExcerpt(content, 155),
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    content,
  };
}
