export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { product, path, content } = req.body;
  const TOKEN = process.env.GITHUB_PAT;
  const REPO = 'Windmar-Home/fl-solar-workshop';
  try {
    let sha = null;
    const check = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, { headers: { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json' } });
    if (check.ok) { const d = await check.json(); sha = d.sha; }
    const body = { message: `Workshop ${new Date().toISOString().slice(0,16)}`, content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'), branch: 'main' };
    if (sha) body.sha = sha;
    const save = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${TOKEN}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return res.status(save.ok ? 200 : 500).json({ success: save.ok });
  } catch(e) { return res.status(500).json({ error: e.message }); }
}
