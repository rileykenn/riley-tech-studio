import { NextResponse } from 'next/server';

// Contact form submissions. The browser posts here; we insert the lead into
// the contact_messages table in Riley's own Supabase project ("Rts Server"),
// which his personal dashboard will read from later. The publishable key is
// safe by design (the table is insert-only for it via RLS), but both values
// stay server-side anyway so the endpoint isn't advertised to the client.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

const field = (v: unknown, max: number): string | null => {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length > 0 && t.length <= max ? t : null;
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Honeypot tripped: report success so bots don't learn, store nothing.
  if (typeof body.company === 'string' && body.company.trim()) {
    return NextResponse.json({ ok: true });
  }

  const name = field(body.name, 200);
  const email = field(body.email, 320);
  const message = field(body.message, 5000);
  const phone = typeof body.phone === 'string' ? body.phone.trim().slice(0, 50) : '';

  if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Contact form: SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY not configured');
    return NextResponse.json({ error: 'Contact form is not configured' }, { status: 503 });
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ name, email, phone: phone || null, message }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      throw new Error(`Supabase insert HTTP ${res.status}: ${await res.text()}`);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Contact form: failed to store lead', err);
    return NextResponse.json({ error: 'Failed to send' }, { status: 502 });
  }
}
