import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAllPosts, formatPostDate } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog | Riley Tech Studio — Web Design & Development Insights',
  description:
    'Practical guides on web design, software development, and growing your business online — from Riley Tech Studio in the Shoalhaven and Illawarra.',
  alternates: {
    canonical: 'https://www.rileytechstudio.com.au/blog',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Blog | Riley Tech Studio — Web Design & Development Insights',
    description:
      'Practical guides on web design, software development, and growing your business online — from Riley Tech Studio in the Shoalhaven and Illawarra.',
    type: 'website',
    url: 'https://www.rileytechstudio.com.au/blog',
    siteName: 'Riley Tech Studio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Riley Tech Studio Blog',
      },
    ],
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  // ItemList JSON-LD of all posts
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `https://www.rileytechstudio.com.au/blog/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <main style={{ overflowX: 'hidden', width: '100%', maxWidth: '100%' }}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <Navbar />

      {/* ── Page Header ── */}
      <section
        style={{
          paddingTop: 'clamp(7rem, 14vw, 10rem)',
          paddingBottom: 'clamp(3rem, 6vw, 5rem)',
          background: 'var(--color-background)',
        }}
      >
        <div className="section-container" style={{ maxWidth: '1100px' }}>
          <span className="eyebrow" style={{ marginBottom: '1.5rem' }}>
            Insights &amp; Guides
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--color-foreground)',
              lineHeight: 1.1,
              marginBottom: '1rem',
              maxWidth: '22ch',
            }}
          >
            Web Design &amp; Development Insights
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              color: 'var(--color-foreground-muted)',
              lineHeight: 1.7,
              maxWidth: '55ch',
            }}
          >
            Practical guides on building better websites, growing your business online,
            and the thinking behind our work across the Shoalhaven and Illawarra.
          </p>
        </div>
      </section>

      {/* ── Blog Card Grid ── */}
      <section
        style={{
          paddingBottom: 'clamp(5rem, 10vw, 8rem)',
          background: 'var(--color-background)',
        }}
      >
        <div className="section-container" style={{ maxWidth: '1100px' }}>
          {posts.length === 0 ? (
            <p style={{ color: 'var(--color-foreground-muted)' }}>
              No blog posts yet — check back soon.
            </p>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="blog-card"
                  aria-label={`Read: ${post.title}`}
                >
                  <div className="blog-card-inner">
                    <div className="blog-card-body">
                      {post.datePublished && (
                        <p className="blog-card-date">
                          <time dateTime={post.datePublished}>
                            {formatPostDate(post.datePublished)}
                          </time>
                          {post.dateModified &&
                            post.dateModified !== post.datePublished && (
                              <>
                                {' · Updated '}
                                <time dateTime={post.dateModified}>
                                  {formatPostDate(post.dateModified)}
                                </time>
                              </>
                            )}
                        </p>
                      )}
                      <h2 className="blog-card-title">{post.title}</h2>
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                    </div>
                    <div className="blog-card-footer">
                      <span className="blog-read-more">
                        Read article
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
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
          }
        }

        .blog-card {
          display: block;
          text-decoration: none;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          transition: transform 400ms cubic-bezier(0.32, 0.72, 0, 1),
                      box-shadow 400ms cubic-bezier(0.32, 0.72, 0, 1),
                      border-color 300ms ease;
          overflow: hidden;
        }
        .blog-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-foreground-subtle);
        }

        .blog-card-inner {
          padding: 1.75rem 2rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 220px;
          justify-content: space-between;
          gap: 1.25rem;
        }

        .blog-card-body {
          flex: 1;
        }

        .blog-card-date {
          font-family: var(--font-body);
          font-size: 0.8125rem;
          color: var(--color-foreground-subtle);
          margin-bottom: 0.625rem;
        }

        .blog-card-title {
          font-family: var(--font-heading);
          font-size: 1.125rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--color-foreground);
          line-height: 1.3;
          margin-bottom: 0.75rem;
        }

        .blog-card-excerpt {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          color: var(--color-foreground-muted);
          line-height: 1.65;
          max-width: 100%;
        }

        .blog-card-footer {
          border-top: 1px solid var(--color-border-subtle);
          padding-top: 1rem;
        }

        .blog-read-more {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-primary);
          transition: gap 250ms ease;
        }
        .blog-card:hover .blog-read-more {
          gap: 0.625rem;
        }
      `}</style>
    </main>
  );
}
