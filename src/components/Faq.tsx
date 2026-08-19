// Objection handling immediately before the ask. Each question is a
// documented buyer fear (cost, ongoing fees, ownership, lock-in, timeline,
// content). Native <details> keeps it dependency-free and accessible.
// The JSON-LD must always match the visible text exactly.

const FAQS = [
  {
    q: 'How much does a website cost?',
    a: 'Our websites start from $2,000, and every job gets a fixed quote in writing before anything starts. The price doesn’t move once we’ve agreed on it. For ballpark figures, we’ve written an honest guide to what websites cost in Australia.',
    link: {
      href: '/blog/how-much-does-a-website-cost-in-australia',
      label: 'Read the cost guide',
    },
  },
  {
    q: 'Are there ongoing fees?',
    a: 'Your quote separates one-off work from anything ongoing, like hosting, so you know exactly what you’re up for. Nothing gets added after launch without you asking for it.',
  },
  {
    q: 'Do I own my website and domain?',
    a: 'Yes. The domain is registered in your name and the site is yours. If you ever move on, everything goes with you.',
  },
  {
    q: 'Am I locked into a contract?',
    a: 'No. There are no lock-in contracts, and you don’t need us to keep your site running.',
  },
  {
    q: 'How long does it take?',
    a: 'Most websites go live within a few weeks of the design being approved. Software projects vary more, so you’ll get a proper timeframe with your quote, and we’ll tell you straight if something will take longer.',
  },
  {
    q: 'Where do you work?',
    a: 'We’re based on the South Coast and build websites for businesses across the Shoalhaven and Illawarra: Wollongong, Kiama, Berry, Nowra, Huskisson, Sussex Inlet and Jervis Bay. For software projects, we work with businesses anywhere in NSW.',
  },
  {
    q: 'We don’t have photos, a logo or any writing.',
    a: 'Most of our clients don’t when we start. We sort the words, the images and the technical setup. You tell us about the business and check we got it right.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Faq() {
  return (
    <section
      id="faq"
      style={{
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="section-container">
        <div className="faq-layout">
          <h2
            style={{
              fontSize: 'clamp(1.875rem, 3.4vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              maxWidth: '16ch',
            }}
          >
            Questions business owners ask us
          </h2>

          <div>
            {FAQS.map((faq) => (
              <details key={faq.q} className="faq-item">
                <summary className="faq-question">
                  {faq.q}
                  <span className="faq-caret" aria-hidden="true" />
                </summary>
                <div className="faq-answer">
                  <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.7 }}>
                    {faq.a}{' '}
                    {faq.link && (
                      <a
                        href={faq.link.href}
                        style={{
                          color: 'var(--color-primary)',
                          fontWeight: 600,
                          textDecoration: 'underline',
                          textUnderlineOffset: '3px',
                        }}
                      >
                        {faq.link.label}
                      </a>
                    )}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
