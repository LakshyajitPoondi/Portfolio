import { createHash } from 'node:crypto';

const unavailable = 'Enquiries are temporarily unavailable here. Please contact @lxy_visuals on Instagram.';
const subjects = new Set(['Portrait session','Automotive shoot','Wildlife project','Collaboration','Something else']);
const emailPattern = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

// Factory keeps provider calls injectable for tests; tests never send real email.
export function createContactHandler({env = process.env, fetchImpl = globalThis.fetch} = {}) {
  return async function contact(req, res) {
    res.setHeader('Cache-Control','no-store');
    res.setHeader('X-Content-Type-Options','nosniff');
    const reply = (code, message, ok = false) => res.status(code).json({ok,message});
    if (req.method !== 'POST') {
      res.setHeader('Allow','POST');
      return reply(405,'Please use the contact form to send an enquiry.');
    }
    const allowedOrigins = new Set([
      'https://lakshyajitphotography.vercel.app',
      ...(env.CONTACT_ORIGIN ? [env.CONTACT_ORIGIN] : []),
      ...(env.VERCEL_URL ? [`https://${env.VERCEL_URL}`] : []),
      ...(env.NODE_ENV !== 'production' && !env.VERCEL ? ['http://127.0.0.1:4173','http://localhost:4173'] : [])
    ]);
    if (!allowedOrigins.has(req.headers.origin)) return reply(403,'Please send your enquiry from this website.');
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return reply(415,'Please use the contact form with JavaScript enabled, or reach out on Instagram.');
    if (Number(req.headers['content-length']) > 24000) return reply(413,'Your message is too long. Please keep it under 5,000 characters.');
    let body;
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (Buffer.byteLength(JSON.stringify(body) || '') > 24000) return reply(413,'Your message is too long.');
    } catch { return reply(400,'The enquiry could not be read. Please try again.'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400,'Please complete the required fields.');
    if (body.website) return reply(400,'The enquiry could not be accepted. Please contact me on Instagram.');
    const {name, email, subject, message} = body;
    if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\r\n\x00]/.test(name)) return reply(400,'Please enter a name of up to 100 characters.');
    if (typeof email !== 'string' || email.length > 254 || !emailPattern.test(email.trim())) return reply(400,'Please enter a valid email address.');
    if (!subjects.has(subject)) return reply(400,'Please choose an enquiry type.');
    if (typeof message !== 'string' || message.trim().length < 10 || message.length > 5000 || message.includes('\0')) return reply(400,'Please write a message between 10 and 5,000 characters.');
    const requestKey = req.headers['idempotency-key'];
    if (typeof requestKey !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(requestKey)) return reply(400,'Please refresh the page and try again.');
    if (!env.RESEND_API_KEY || !env.CONTACT_FROM || !env.CONTACT_TO) return reply(503,unavailable);
    const payload = {
      from:env.CONTACT_FROM,
      to:[env.CONTACT_TO],
      reply_to:email.trim(),
      subject:`LXY Visuals — ${subject}`,
      text:`Name: ${name.trim()}\nEmail: ${email.trim()}\nEnquiry: ${subject}\n\n${message.trim()}`
    };
    // The payload digest avoids conflicts if an external caller reuses a key for different input.
    const digest = createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0,24);
    try {
      const response = await fetchImpl('https://api.resend.com/emails', {
        method:'POST',
        headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`contact-${requestKey}-${digest}`},
        body:JSON.stringify(payload),
        signal:AbortSignal.timeout(10000)
      });
      if (!response.ok) return reply(response.status === 429 ? 429 : 502, response.status === 429 ? 'Too many enquiries right now. Please wait a little before trying again.' : unavailable);
      const result = await response.json();
      if (typeof result.id !== 'string' || !result.id) return reply(502,unavailable);
      return reply(200,'Thank you. Your enquiry has been accepted for sending. I’ll reply to the email you provided.',true);
    } catch { return reply(502,'The email service could not be reached. Please retry or contact @lxy_visuals on Instagram.'); }
  };
}

export default createContactHandler();
