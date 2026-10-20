// Supabase Edge Function (Deno). Receives Mercado Pago subscription notifications.
// Secrets needed: MP_ACCESS_TOKEN, MP_WEBHOOK_SECRET (plus the auto-provided SUPABASE_* vars).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const encoder = new TextEncoder();

async function validSignature(req: Request, dataId: string): Promise<boolean> {
  const secret = Deno.env.get('MP_WEBHOOK_SECRET');
  if (!secret) return false;
  const sig = req.headers.get('x-signature') ?? '';
  const requestId = req.headers.get('x-request-id') ?? '';
  const parts = Object.fromEntries(sig.split(',').map((p) => p.trim().split('=') as [string, string]));
  if (!parts.ts || !parts.v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(manifest));
  const hex = Array.from(new Uint8Array(mac)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex === parts.v1;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const body = await req.json().catch(() => ({}));
  const type = body.type ?? url.searchParams.get('type') ?? url.searchParams.get('topic');
  const dataId = String(body?.data?.id ?? url.searchParams.get('data.id') ?? url.searchParams.get('id') ?? '');

  if (!dataId) return new Response('ignored', { status: 200 });
  if (!(await validSignature(req, dataId))) return new Response('invalid signature', { status: 401 });
  if (type !== 'subscription_preapproval' && type !== 'preapproval') return new Response('ignored', { status: 200 });

  // Never trust the body: ask Mercado Pago for the real status.
  const res = await fetch(`https://api.mercadopago.com/preapproval/${dataId}`, {
    headers: { Authorization: `Bearer ${Deno.env.get('MP_ACCESS_TOKEN')}` },
  });
  if (!res.ok) return new Response('mp lookup failed', { status: 502 });
  const sub = await res.json();

  const email = String(sub.payer_email ?? '').toLowerCase();
  if (!email) return new Response('no payer email', { status: 200 });

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const { error } = await supabase.from('subscriptions').upsert(
    {
      payer_email: email,
      mp_preapproval_id: String(sub.id),
      status: String(sub.status),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'payer_email' },
  );
  if (error) return new Response(error.message, { status: 500 });

  return new Response('ok', { status: 200 });
});
