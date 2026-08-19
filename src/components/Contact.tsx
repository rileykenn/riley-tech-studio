'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, CircleNotch } from '@phosphor-icons/react';

// Messages post to /api/contact, which stores them in the contact_messages
// table in Riley's own Supabase project (Rts Server). Credentials live
// server-side only; nothing here knows where leads go.

const NEXT_STEPS = [
  'We look at what you send through',
  'You get a plan and a fixed quote in writing',
  'You decide. Fine either way.',
];

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--color-surface)',
  padding: '0.75rem 1rem',
  fontSize: '1rem', // 16px minimum: stops iOS zooming the form on focus
  color: 'var(--color-foreground)',
  outline: 'none',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.375rem',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--color-foreground)',
};

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [company, setCompany] = useState(''); // honeypot: real visitors never see it
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return; // double-click can beat the disabled re-render
    if (company) return; // bot filled the hidden field
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFieldError('Please fill in your name, email and what you need.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setFieldError('That email address doesn’t look right.');
      return;
    }
    setFieldError(null);
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          company, // honeypot, checked server-side too
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      style={{
        paddingTop: 'var(--section-gap)',
        paddingBottom: 'var(--section-gap)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="contact-layout">
          {/* Left: the offer, what happens next, and one quiet phone line */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          >
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Get your free quote.
            </h2>

            <p
              style={{
                marginTop: '1.25rem',
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                maxWidth: '44ch',
              }}
            >
              Tell us what your business needs. We&rsquo;ll come back with a
              plan and a fixed price in writing.
            </p>

            <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {NEXT_STEPS.map((step, i) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--color-foreground)', fontWeight: 500 }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <p
              style={{
                marginTop: '2rem',
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                maxWidth: '44ch',
                color: 'var(--color-foreground-muted)',
              }}
            >
              We&rsquo;re the studio behind CleanRoute Pro, Stone Grill
              Huskisson, Sussex Inlet Golf Club and Todays Stash. All real,
              all checkable.
            </p>

            <p style={{ marginTop: '1.25rem', fontSize: '0.9375rem' }}>
              Prefer to talk?{' '}
              <a
                href="tel:+61499545069"
                style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
              >
                Call the studio on 0499 545 069
              </a>
            </p>
          </motion.div>

          {/* Right: the quote form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="card-shell"
          >
            <div className="card-core" style={{ padding: '2rem' }}>
              {status === 'sent' ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <CheckCircle size={48} weight="fill" color="var(--color-primary)" style={{ margin: '0 auto' }} />
                  <p style={{ margin: '1rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-foreground)' }}>
                    Request received
                  </p>
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.9375rem', color: 'var(--color-foreground-muted)' }}>
                    Thanks {name.trim().split(' ')[0] || 'there'}. We&rsquo;ll
                    reply by email within one business day with a plan and a
                    fixed quote.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <div style={{ marginBottom: '1.1rem' }}>
                    <label htmlFor="contact-name" style={labelStyle}>
                      Name
                    </label>
                    <input
                      id="contact-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      placeholder="Your name"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: '1.1rem' }}>
                    <label htmlFor="contact-email" style={labelStyle}>
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: '1.1rem' }}>
                    <label htmlFor="contact-phone" style={labelStyle}>
                      Phone{' '}
                      <span style={{ fontWeight: 400, color: 'var(--color-foreground-subtle)' }}>
                        (optional, if you&rsquo;d rather we call)
                      </span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                      placeholder="04XX XXX XXX"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <label htmlFor="contact-message" style={labelStyle}>
                      What does your business need?
                    </label>
                    <textarea
                      id="contact-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="e.g. New website for my cafe in Huskisson"
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                    />
                  </div>

                  {/* honeypot, hidden from real visitors and screen readers */}
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, opacity: 0 }}
                  />

                  {fieldError && (
                    <p role="alert" style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-destructive)' }}>
                      {fieldError}
                    </p>
                  )}
                  {status === 'error' && (
                    <p role="alert" style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-destructive)' }}>
                      Something went wrong sending that. Please try again, or
                      email{' '}
                      <a href="mailto:contactrileykennedy@gmail.com" style={{ color: 'inherit' }}>
                        contactrileykennedy@gmail.com
                      </a>
                      .
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      cursor: status === 'sending' ? 'default' : 'pointer',
                      opacity: status === 'sending' ? 0.75 : 1,
                    }}
                  >
                    {status === 'sending' ? (
                      <>
                        <CircleNotch size={17} className="animate-spin" /> Sending&hellip;
                      </>
                    ) : (
                      'Get My Free Quote'
                    )}
                  </button>
                  <p
                    style={{
                      margin: '0.75rem 0 0',
                      textAlign: 'center',
                      fontSize: '0.8125rem',
                      color: 'var(--color-foreground-subtle)',
                    }}
                  >
                    We reply within one business day. No newsletters, no spam.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (min-width: 768px) {
          .contact-layout {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
        }
        #contact input::placeholder,
        #contact textarea::placeholder {
          color: var(--color-foreground-subtle);
          opacity: 1;
        }
        #contact input:focus,
        #contact textarea:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
        }
      `}</style>
    </section>
  );
}
