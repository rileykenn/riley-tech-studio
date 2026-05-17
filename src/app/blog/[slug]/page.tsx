import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllSlugs, getPostBySlug } from '@/lib/blog';
import { marked } from 'marked';

// ── Marked configuration ────────────────────────────────────────────────────
// Use a custom renderer to strip the H1 from rendered HTML output
// (we render the H1 ourselves in the page layout for visual control).
const renderer = new marked.Renderer();

// Override heading: suppress H1 (we render it manually), pass through H2–H6
renderer.heading = function ({ text, depth }) {
  if (depth === 1) return ''; // H1 handled by page title display
  return `<h${depth}>${text}</h${depth}>\n`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
});

// ── Static generation ────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────────
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const canonical = `https://www.rileytechstudio.com.au/blog/${slug}`;

  return {
    title: `${post.title} | Riley Tech Studio`,
    description: post.excerpt,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${post.title} | Riley Tech Studio`,
      description: post.excerpt,
      type: 'article',
      url: canonical,
      siteName: 'Riley Tech Studio',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const canonical = `https://www.rileytechstudio.com.au/blog/${slug}`;

  // Parse markdown → HTML (H1 suppressed by custom renderer)
  const htmlContent = await marked.parse(post.content);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: 'Riley Kennedy',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Riley Tech Studio',
      url: 'https://www.rileytechstudio.com.au',
    },
    url: canonical,
  };

  return (
    <main style={{ overflowX: 'hidden', width: '100%', maxWidth: '100%' }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      {/* ── Article wrapper ── */}
      <div
        style={{
          paddingTop: 'clamp(6rem, 12vw, 9rem)',
          paddingBottom: 'clamp(4rem, 8vw, 7rem)',
          background: 'var(--color-background)',
        }}
      >
        <div className="section-container blog-post-container">

          {/* Back link */}
          <Link href="/blog" className="blog-back-link" aria-label="Back to Blog">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>

          {/* Post title */}
          <h1 className="blog-post-title">{post.title}</h1>

          {/* Author byline */}
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8125rem',
            color: 'var(--color-foreground-subtle)',
            marginBottom: '2.5rem',
            marginTop: '-1.75rem',
          }}>
            By Riley Kennedy &middot; Riley Tech Studio
          </p>

          {/* Article body */}
          <article
            className="blog-prose"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* ── CTA Section ── */}
          <div className="blog-cta-box">
            <div className="blog-cta-inner">
              <span className="eyebrow" style={{ marginBottom: '1.25rem' }}>
                Get in touch
              </span>
              <h2 className="blog-cta-heading">
                Ready to grow your business online?
              </h2>
              <p className="blog-cta-subtext">
                Get in touch with Riley Tech Studio — web design and development
                for businesses across the Shoalhaven and Illawarra.
              </p>
              <Link href="/#contact" className="btn-primary blog-cta-btn">
                Start a project
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/blog"
                style={{
                  marginTop: '1rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--color-foreground-muted)',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                }}
              >
                Or read more articles on our blog
              </Link>
            </div>
          </div>

        </div>
      </div>

      <Footer />

      <style>{`
        .blog-post-container {
          max-width: 760px !important;
        }

        .blog-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-foreground-muted);
          text-decoration: none;
          margin-bottom: 2.5rem;
          transition: color 200ms ease, gap 200ms ease;
        }
        .blog-back-link:hover {
          color: var(--color-primary);
          gap: 0.6rem;
        }

        .blog-post-title {
          font-family: var(--font-heading);
          font-size: clamp(1.875rem, 4vw, 2.75rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: var(--color-foreground);
          line-height: 1.15;
          margin-bottom: 2.5rem;
        }

        /* ── CTA box ── */
        .blog-cta-box {
          margin-top: 4rem;
          padding: 0.375rem;
          border-radius: var(--radius-2xl);
          background: rgba(241, 245, 249, 0.6);
          border: 1px solid var(--color-border);
        }
        .blog-cta-inner {
          background: var(--color-surface);
          border-radius: calc(var(--radius-2xl) - 0.375rem);
          padding: clamp(2rem, 5vw, 3rem);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          box-shadow: var(--shadow-sm), inset 0 1px 1px rgba(255,255,255,0.8);
        }
        .blog-cta-heading {
          font-family: var(--font-heading);
          font-size: clamp(1.375rem, 3vw, 1.875rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-foreground);
          line-height: 1.2;
          margin-bottom: 0.875rem;
        }
        .blog-cta-subtext {
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--color-foreground-muted);
          line-height: 1.7;
          max-width: 52ch;
          margin-bottom: 1.75rem;
        }
        .blog-cta-btn {
          text-decoration: none;
        }
      `}</style>
    </main>
  );
}
