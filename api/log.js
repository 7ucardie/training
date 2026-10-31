import { get, put } from '@vercel/blob';

const PATH = 'logboek.json';
const EMPTY = { sessies: [], profiel: {}, bijgewerkt: null };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const pin = req.headers['x-pin'] || '';
  if (!process.env.LOG_PIN || pin !== process.env.LOG_PIN) {
    return res.status(401).json({ error: 'Onjuist wachtwoord' });
  }
  try {
    if (req.method === 'GET') {
      const r = await get(PATH, { access: 'private', useCache: false });
      if (!r) return res.status(200).json(EMPTY);
      const text = await new Response(r.stream).text();
      return res.status(200).json(JSON.parse(text));
    }
    if (req.method === 'PUT') {
      const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
      const doc = {
        sessies: Array.isArray(body.sessies) ? body.sessies.slice(0, 5000) : [],
        profiel: body.profiel && typeof body.profiel === 'object' ? body.profiel : {},
        bijgewerkt: new Date().toISOString(),
      };
      const json = JSON.stringify(doc);
      if (json.length > 4_000_000) return res.status(413).json({ error: 'Logboek te groot' });
      await put(PATH, json, { access: 'private', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json' });
      return res.status(200).json(doc);
    }
    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'Methode niet toegestaan' });
  } catch (e) {
    return res.status(500).json({ error: 'Opslag niet bereikbaar', detail: String(e && e.message) });
  }
}
