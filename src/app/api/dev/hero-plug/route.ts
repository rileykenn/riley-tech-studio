import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

// Dev-only: the hero plug tuner posts its position here and it gets written
// into hero-plug.json so the placement lives in the code. 404 in production.

const num = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;

const isCable = (v: unknown): v is [number, number][] =>
  Array.isArray(v) &&
  v.length === 3 &&
  v.every(
    (p) => Array.isArray(p) && p.length === 2 && p.every((n) => num(n, -300, 1100))
  );

export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }
  const body = await req.json().catch(() => null);
  if (
    !body ||
    !num(body.x, 0, 100) ||
    !num(body.y, 0, 100) ||
    !num(body.rotate, -180, 180) ||
    !num(body.size, 100, 1200) ||
    !num(body.opacity, 0.02, 0.5) ||
    !isCable(body.cable)
  ) {
    return NextResponse.json({ error: 'Invalid plug config' }, { status: 400 });
  }
  const round = (n: number) => Math.round(n * 100) / 100;
  const file = path.join(process.cwd(), 'src', 'components', 'hero-plug.json');
  await fs.writeFile(
    file,
    JSON.stringify(
      {
        x: round(body.x),
        y: round(body.y),
        rotate: round(body.rotate),
        size: Math.round(body.size),
        opacity: round(body.opacity),
        cable: (body.cable as [number, number][]).map((p) => [
          Math.round(p[0]),
          Math.round(p[1]),
        ]),
      },
      null,
      2
    ) + '\n'
  );
  return NextResponse.json({ ok: true });
}
