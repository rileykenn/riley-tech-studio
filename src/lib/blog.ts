import fs from 'fs';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'public', 'raw-blog-md-files');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
}

export interface BlogPostFull extends BlogPost {
  content: string;
}

/** Extract the first H1 heading from markdown content */
export function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

/** Extract the first non-heading paragraph, truncated to maxLen chars */
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
    return plain.length > maxLen ? plain.slice(0, maxLen - 1) + '…' : plain;
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

/** Get all blog post metadata (title + excerpt), sorted alphabetically by title */
export function getAllPosts(): BlogPost[] {
  const slugs = getAllSlugs();
  const posts = slugs.map((slug) => {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
      slug,
      title: extractTitle(content),
      excerpt: extractExcerpt(content),
    };
  });
  return posts.sort((a, b) => a.title.localeCompare(b.title));
}

/** Get a single post's content, or null if not found */
export function getPostBySlug(slug: string): BlogPostFull | null {
  // Sanitise slug to prevent path traversal
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '');
  const filePath = path.join(BLOG_DIR, `${safeSlug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return {
    slug: safeSlug,
    title: extractTitle(content),
    excerpt: extractExcerpt(content, 155),
    content,
  };
}
