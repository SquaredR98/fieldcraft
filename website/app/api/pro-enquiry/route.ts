import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, interest, message } = body?.values ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 },
      );
    }

    // TODO: Send email or forward to SaaS backend when ready.
    // For now, log to server console so enquiries aren't lost.
    console.log('[pro-enquiry]', { name, email, interest, message, at: new Date().toISOString() });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
