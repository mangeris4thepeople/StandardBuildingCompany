// Contact form handler for www.standardbuildingcompany.net.
// Path 1: forward to the shared Standard intake, which saves the submission to the
//         leads database and emails it through the Gmail relay.
// Path 2: if the intake cannot be reached, email it straight through the Gmail relay.
// No third-party form service is involved. Works with JavaScript (JSON) and without it
// (a plain form post gets redirected to a thank-you page).
const SITE_KEY = 'building';
const SITE_NAME = 'Standard Building Company';
const SITE_URL = 'https://www.standardbuildingcompany.net';
const PHONE = '970-430-5884';
const INTAKE_URL = process.env.INTAKE_URL || 'https://standardroofingcompany.net/api/intake';
const MAIL_RELAY_URL = process.env.MAIL_RELAY_URL || '';
const THANKS_PATH = '/?sent=1#contact';
// Form field name -> label shown in the email.
const LABELS = {
  'name': 'Name',
  'phone': 'Phone',
  'email': 'Email',
  'projectType': 'Project type',
  'message': 'Message',
  'page': 'Page'
};
const HONEYPOTS = ['website', '_honey', '_gotcha', 'company_website'];

const clean = (v, max = 3000) => String(v == null ? '' : v).replace(/\r/g, '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);

async function postJson(url, body, headers) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 12000);
  try {
    const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), redirect: 'follow', signal: ctl.signal });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok && data.ok === true, status: r.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: { error: String(err && err.message) } };
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  let b = req.body || {};
  if (typeof b === 'string') {
    try { b = JSON.parse(b); } catch (e) { b = Object.fromEntries(new URLSearchParams(b)); }
  }
  const wantsHtml = !String(req.headers['content-type'] || '').includes('application/json');
  const done = (status, payload) => {
    if (wantsHtml) {
      res.statusCode = 303;
      res.setHeader('Location', payload.ok ? THANKS_PATH : '/contact/?error=1');
      return res.end();
    }
    return res.status(status).json(payload);
  };

  // Spam traps: hidden fields people never fill, and a minimum fill time.
  if (HONEYPOTS.some((k) => clean(b[k]))) return done(200, { ok: true });
  const started = Number(b.started || 0);
  if (started && Date.now() - started < 3000) return done(200, { ok: true });

  const name = clean(b.name, 120);
  const email = clean(b.email, 200);
  const phone = clean(b.phone, 40);
  const message = clean(b.message, 5000);
  if (!name || (!email && !phone)) return done(400, { ok: false, error: `Please include your name and an email or phone number, or call ${PHONE}.` });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return done(400, { ok: false, error: 'That email address does not look right.' });

  const fields = {};
  for (const [k, label] of Object.entries(LABELS)) {
    const v = clean(b[k], k === 'message' ? 5000 : 300);
    if (v) fields[label] = v;
  }
  const org = clean(b.company || b.organization, 160);
  const subject = `${SITE_NAME} inquiry: ${name}${org ? ` (${org})` : ''}`;
  const ip = clean(req.headers['x-real-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0], 64);

  const viaIntake = await postJson(INTAKE_URL, {
    site: SITE_KEY, kind: 'contact', subject, name, email, phone, message, fields,
    page: clean(b.page, 300) || clean(req.headers.referer, 300), ip, ua: clean(req.headers['user-agent'], 300),
  }, { 'Content-Type': 'application/json', Origin: SITE_URL });
  if (viaIntake.ok) return done(200, { ok: true, emailed: viaIntake.data.emailed === true });
  console.error('Intake failed', viaIntake.status, JSON.stringify(viaIntake.data).slice(0, 300));

  const text = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nSent from ${SITE_URL} (intake was unreachable, sent directly).`;
  const direct = await postJson(MAIL_RELAY_URL, { site: SITE_KEY, subject, text, replyTo: email }, { 'Content-Type': 'text/plain;charset=utf-8' });
  if (direct.ok) return done(200, { ok: true, emailed: true });
  console.error('Direct relay failed', direct.status, JSON.stringify(direct.data).slice(0, 300));
  return done(502, { ok: false, error: `We could not send that just now. Please call ${PHONE}.` });
}
