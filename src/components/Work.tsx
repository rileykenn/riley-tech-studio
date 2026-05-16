'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from '@phosphor-icons/react';

interface ProjectData {
  title: string;
  category: string;
  description: string;
  details: string[];
  mockup: string;
  review: {
    name: string;
    text: string;
    rating: number;
  };
}

const projects: ProjectData[] = [
  {
    title: 'Jervis Bay Boat Storage',
    category: 'Business Website',
    description:
      'Premium landing page for a boat storage facility on the South Coast. Conversion-focused design with lead generation forms, coastal branding, and mobile-first architecture. Built with Next.js and Tailwind CSS.',
    details: ['Next.js & Tailwind', 'Lead generation', 'SEO optimised', 'Mobile-first'],
    mockup: '/mockups/jervisbayboatstorage.jpeg',
    review: {
      name: 'Matt O\'Connor',
      text: '"Creative design, friendly, informative, professional service and very reasonable pricing. Won\'t hesitate to use Riley in the future."',
      rating: 5,
    },
  },
  {
    title: 'East Coast Pipe & Civil',
    category: 'Business Website',
    description:
      'High-performance marketing site for a poly pipe and civil supplies company in the Shoalhaven. Custom branding, interactive product gallery, and local SEO optimisation for the Nowra region.',
    details: ['Next.js 16', 'Product gallery', 'Local SEO', 'Custom branding'],
    mockup: '/mockups/eastcoast.jpeg',
    review: {
      name: 'Peter Sloan',
      text: '"We could not be happier with the outcome. Very professional to deal with and made the whole process easy and stress free."',
      rating: 5,
    },
  },
  {
    title: 'Land to Sea Cleaning Co.',
    category: 'Business Website',
    description:
      'Clean, professional website for a commercial cleaning business. Service breakdowns, team showcase, and integrated quote request forms. Mobile-first with fast page loads.',
    details: ['Next.js & Tailwind', 'Quote forms', 'Service pages', 'Performance tuned'],
    mockup: '/mockups/landtoseaclaning.jpeg',
    review: {
      name: 'Haley Short',
      text: '"Absolutely incredible to work with! Professional, creative, responsive and made the whole process so easy. The final website exceeded my expectations."',
      rating: 5,
    },
  },
  {
    title: 'Inclusive Transport',
    category: 'Business Website',
    description:
      'Accessible, conversion-focused website for a disability transport provider. Clear service information, booking pathways, and NDIS integration details. Built for trust and accessibility.',
    details: ['Accessible design', 'NDIS integration', 'Booking flow', 'Trust signals'],
    mockup: '/mockups/inclusivetransport.jpeg',
    review: {
      name: 'Beni Brown',
      text: '"Riley was outstanding to work with. He has a great eye for creativity and really brought my vision to life. Highly recommend."',
      rating: 5,
    },
  },
  {
    title: 'Zampa Services',
    category: 'Business Website',
    description:
      'Professional trades and services website with a bold visual identity. Service showcases, project galleries, and lead generation. Designed to stand out in a competitive market.',
    details: ['Bold branding', 'Project gallery', 'Lead gen forms', 'Mobile-first'],
    mockup: '/mockups/zampaservices.jpeg',
    review: {
      name: 'Leanne Zampa',
      text: '"He took my ideas and turned them into a professional, polished website that truly represents my business. Highly recommend!"',
      rating: 5,
    },
  },
];

export default function Work() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  const activeProject = selected !== null ? projects[selected] : null;

  function handleClick(index: number) {
    setSelected((prev) => (prev === index ? null : index));
  }

  // Build display order: selected project goes to top
  const orderedIndices = selected !== null
    ? [selected, ...projects.map((_, i) => i).filter((i) => i !== selected)]
    : projects.map((_, i) => i);

  return (
    <section
      id="work"
      style={{
        paddingTop: '2rem',
        paddingBottom: 'var(--section-gap)',
      }}
    >
      <div className="section-container">

        {/* Two-column layout */}
        <div className="work-grid">
          {/* Left — Project list */}
          <div>
            {orderedIndices.map((i) => {
              const project = projects[i];
              const isSelected = selected === i;
              const isHovered = hovered === i;

              return (
                <motion.div
                  key={project.title}
                  layout
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <motion.button
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleClick(i)}
                    whileTap={{ scale: 0.99 }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      padding: '1.5rem 0',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      textAlign: 'left',
                      background: 'transparent',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: 'var(--color-foreground-subtle)',
                        minWidth: '2rem',
                        fontFamily: "'SF Mono', 'Fira Code', monospace",
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span
                      style={{
                        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                        fontWeight: 700,
                        color: isHovered || isSelected ? 'var(--color-primary)' : 'var(--color-foreground)',
                        letterSpacing: '-0.03em',
                        flex: 1,
                        transition: 'color 200ms',
                      }}
                    >
                      {project.title}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ paddingBottom: '1.5rem', paddingLeft: '3.5rem' }}>
                          <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.35 }}
                            style={{
                              fontSize: '0.9375rem',
                              lineHeight: 1.65,
                              color: 'var(--color-foreground-muted)',
                              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                              maxWidth: '48ch',
                            }}
                          >
                            {project.description}
                          </motion.p>
                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '0.375rem',
                              marginTop: '1rem',
                            }}
                          >
                            {project.details.map((d, j) => (
                              <motion.span
                                key={d}
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: 0.15 + j * 0.05,
                                  type: 'spring',
                                  stiffness: 200,
                                  damping: 20,
                                }}
                                style={{
                                  padding: '0.3rem 0.7rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.6875rem',
                                  fontWeight: 600,
                                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                  background: 'var(--color-muted-bg)',
                                  color: 'var(--color-foreground-muted)',
                                  border: '1px solid var(--color-border)',
                                }}
                              >
                                {d}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Right — Mockup + review card (sticky) */}
          <div
            style={{
              position: 'sticky',
              top: '6rem',
              alignSelf: 'start',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              minHeight: '460px',
              overflow: 'visible',
            }}
          >
            {/* Mockup image */}
            <AnimatePresence mode="popLayout">
              {activeProject && (
              <motion.div
                key={activeProject.title + '-mockup'}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                style={{
                  width: '140%',
                  marginRight: '-20%',
                  WebkitMaskImage: 'radial-gradient(ellipse 85% 80% at center, black 50%, transparent 100%)',
                  maskImage: 'radial-gradient(ellipse 85% 80% at center, black 50%, transparent 100%)',
                }}
              >
                <img
                  src={activeProject.mockup}
                  alt={activeProject.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    objectFit: 'cover',
                  }}
                />
              </motion.div>
              )}
            </AnimatePresence>

            {/* Google review card — parallax (slower slide) */}
            <AnimatePresence mode="popLayout">
              {activeProject && (
              <motion.div
                key={activeProject.title + '-review'}
                initial={{ opacity: 0, x: 140 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                style={{
                  position: 'absolute',
                  bottom: '-1rem',
                  left: '-1.5rem',
                  zIndex: 2,
                  maxWidth: '280px',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: '#1a1a1a',
                  boxShadow: '0 16px 48px -12px rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Stars */}
                <div style={{ display: 'flex', gap: '2px', marginBottom: '0.625rem' }}>
                  {Array.from({ length: activeProject.review.rating }).map((_, i) => (
                    <Star key={i} size={14} weight="fill" color="#FBBF24" />
                  ))}
                </div>

                <p
                  style={{
                    fontSize: '0.8125rem',
                    lineHeight: 1.55,
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontStyle: 'italic',
                  }}
                >
                  {activeProject.review.text}
                </p>

                <div
                  style={{
                    marginTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {/* Google "G" icon */}
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      color: '#4285F4',
                    }}
                  >
                    G
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                      }}
                    >
                      {activeProject.review.name}
                    </div>
                    <div
                      style={{
                        fontSize: '0.625rem',
                        color: 'rgba(255, 255, 255, 0.4)',
                      }}
                    >
                      Google Review
                    </div>
                  </div>
                </div>
              </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .work-grid {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 2rem;
          align-items: center;
          overflow: visible;
        }
        @media (max-width: 768px) {
          .work-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
