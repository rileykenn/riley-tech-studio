import Link from 'next/link';
// Inline re-offer after the work sections: buyers convinced by the demos
// get the CTA right there instead of hunting for the contact form.

export default function QuoteBand() {
  return (
    <section
      style={{
        padding: '3.5rem 0',
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
        background: 'var(--color-background-alt)',
      }}
    >
      <div
        className="section-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem 2rem',
          flexWrap: 'wrap',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: '1.25rem',
            fontWeight: 600,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em',
            color: 'var(--color-foreground)',
          }}
        >
          Want something like this for your business?
        </p>
        <Link href="/#contact" className="btn-primary">
          Get My Free Quote
        </Link>
      </div>
    </section>
  );
}
