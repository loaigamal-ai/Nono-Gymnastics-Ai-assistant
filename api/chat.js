export default async function handler(req, res) {
  // إعدادات السماح بالوصول (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // جلب المفتاح من متغيرات البيئة
  const GEMINI_API_KEY = process.env.gemini_api_key;

  if (!GEMINI_API_KEY) {
    console.error('gemini_api_key is missing!');
    return res.status(500).json({ error: 'API key not configured' });
  }

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    // تم التعديل إلى الإصدار v1 لضمان التوافق مع نموذج Flash 1.5
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${AIzaSyDX6BOjfQ9Njd83qKjIb8GMycEWuG-Q04U}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { 
            maxOutputTokens: 800, 
            temperature: 0.7 
          }
        })
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error('Gemini error details:', JSON.stringify(data));
      return res.status(geminiRes.status).json({ error: 'Gemini error', details: data });
    }

    // استخراج النص من استجابة جوجل
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '##TRANSFER##';
    return res.status(200).json({ text });

  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
