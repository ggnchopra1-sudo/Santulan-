// Santulan AI: estimates nutrition for dishes the app doesn't know.
// Runs free on Cloudflare Workers AI. Needs a Workers AI binding named "AI".
const ALLOWED = ['https://getsantulan.in', 'https://www.getsantulan.in', 'https://ggnchopra1-sudo.github.io'];
const MODELS = ['@cf/meta/llama-3.1-8b-instruct-fast', '@cf/meta/llama-3.1-8b-instruct', '@cf/meta/llama-3.2-3b-instruct'];
const hits = new Map(); // light per-visitor limit: 30 requests per 10 minutes

const PROMPT = `You are a nutritionist who knows Indian home, dhaba, street and restaurant food well.
Estimate nutrition for ONE typical serving of the food the user names, as eaten in India.
Reply with ONLY a JSON object, no other text:
{"food":true,"name":"short English name","serving":"e.g. 1 plate, 2 pieces, 1 glass","diet":"veg|egg|nonveg","kcal":0,"p":0,"c":0,"f":0,"fib":0,"b12":0,"d":0,"fe":0,"ca":0}
p,c,f,fib in grams; b12 and d in micrograms; fe and ca in milligrams.
If the text is not a food or drink, reply {"food":false}.`;

const LIMITS = { kcal: 3000, p: 200, c: 400, f: 200, fib: 60, b12: 50, d: 100, fe: 60, ca: 3000 };

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}
function reply(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors(origin) });
    if (req.method !== 'POST') return reply({ ok: true, service: 'santulan-ai' }, 200, origin);
    if (!ALLOWED.includes(origin)) return reply({ error: 'forbidden' }, 403, origin);

    const ip = req.headers.get('CF-Connecting-IP') || 'x', now = Date.now();
    const list = (hits.get(ip) || []).filter(t => now - t < 600000);
    if (list.length >= 30) return reply({ error: 'slow_down' }, 429, origin);
    list.push(now); hits.set(ip, list);

    let food = '';
    try { food = String((await req.json()).food || '').replace(/\s+/g, ' ').trim().slice(0, 80); } catch (e) {}
    if (food.length < 2) return reply({ error: 'no_food' }, 400, origin);

    for (const model of MODELS) {
      try {
        const out = await env.AI.run(model, {
          messages: [{ role: 'system', content: PROMPT }, { role: 'user', content: food }],
          max_tokens: 200, temperature: 0.2,
        });
        const text = typeof out.response === 'string' ? out.response : JSON.stringify(out.response || '');
        const m = text.match(/\{[\s\S]*\}/); if (!m) continue;
        const j = JSON.parse(m[0]);
        if (j.food === false) return reply({ food: false }, 200, origin);
        const r = { food: true, name: String(j.name || food).slice(0, 60), serving: String(j.serving || '1 serving').slice(0, 30),
          diet: ['veg', 'egg', 'nonveg'].includes(j.diet) ? j.diet : 'veg' };
        for (const k in LIMITS) { const v = Number(j[k]); r[k] = isFinite(v) && v >= 0 ? Math.min(v, LIMITS[k]) : 0; }
        if (!r.kcal) continue;
        return reply(r, 200, origin);
      } catch (e) { /* try the next model */ }
    }
    return reply({ error: 'ai_unavailable' }, 503, origin);
  },
};
