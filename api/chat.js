export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // تأكد أن هذا الاسم هو بالضبط ما وضعته في إعدادات Vercel
  const apiKey = process.env.gemini_api_key;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing in Environment Variables' });
  }

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${AIzaSyDX6BOjfQ9Njd83qKjIb8GMycEWuG-Q04U}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Gemini API error', details: data });
    }

    const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text || '##TRANSFER##';
    return res.status(200).json({ text: outputText });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
