import Link from 'next/link';
import Image from 'next/image';

// Static, monochrome client grid: the receipts for the hero's "50+ local
// businesses" claim. Static beats a marquee for a local audience (the one
// logo a visitor recognises must not scroll away), mono beats colour near a
// CTA. Most recognisable names sit top-left. The whole band links to the
// work section.
//
// TODO(riley): as real logo files land in /public/clientlogos/ (SVG or
// transparent PNG), add `logo: '/clientlogos/<file>'` to an entry and the
// image replaces the monogram tile automatically.
const clients: Array<{
  name: string;
  mark: string;
  round?: boolean;
  logo?: string;
}> = [
  { name: 'Stone Grill Huskisson', mark: 'SG' },
  { name: 'Sussex Inlet Golf Club', mark: 'GC', logo: '/casestudy/sigc-logo.png' },
  { name: 'Todays Stash', mark: 'TS' },
  { name: 'Land to Sea Cleaning', round: true, mark: 'LS' },
  { name: 'CleanRoute Pro', round: true, mark: 'CR' },
  { name: 'JD Air', round: true, mark: 'JD' },
  { name: 'First Choice Glass', mark: 'FC' },
  { name: 'Bay & Basin Hotel', mark: 'BB' },
  { name: 'East Coast Pipe', mark: 'EP' },
  { name: 'North Eastern Building', round: true, mark: 'NE' },
  { name: 'Coastal Escapes', mark: 'CE' },
  { name: 'BAS to Basics', mark: 'BB' },
];

export default function ClientLogoGrid() {
  return (
    <Link
      href="/#work"
      className="hero-logo-band"
      aria-label="See the work we build for these businesses"
    >
      <ul className="hero-logo-grid">
        {clients.map((client) => (
          <li key={client.name} className="hero-logo-item">
            {client.logo ? (
              <Image
                src={client.logo}
                alt=""
                width={30}
                height={30}
                style={{
                  width: 30,
                  height: 30,
                  objectFit: 'contain',
                  filter: 'grayscale(1)',
                  opacity: 0.75,
                  flexShrink: 0,
                }}
              />
            ) : (
              <span
                aria-hidden="true"
                className="hero-logo-mark"
                style={{ borderRadius: client.round ? '50%' : 8 }}
              >
                {client.mark}
              </span>
            )}
            <span className="hero-logo-name">{client.name}</span>
          </li>
        ))}
      </ul>
    </Link>
  );
}
