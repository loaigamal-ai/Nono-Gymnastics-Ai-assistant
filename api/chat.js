module.exports = async function handler(req, res) {
  // 1. إعدادات السماح للواجهة بالاتصال
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  // 2. قراءة المفتاح من الخزنة
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key is missing in Vercel" });
  }

  // 3. استلام رسالة المستخدم
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    // 4. الاتصال بجوجل
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // 5. قسم الإضافات: مكتوب بالطريقة الصحيحة (system_instruction)
          system_instruction: {
            parts: [{ 
              text: `أنت (نونو)، المساعد الذكي والودود لأكاديمية الجمباز.
              مهمتك الاساسية هى الرد على استفسارات المستخدم بشكل ودود و احترافى و الترويج بطريقة غير مباشرة لأكاديمية نور للجمباز لحث المستخدم على الاشتراك بها.` 
            }]
          },
          // 6. رسالة المستخدم
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    // التعامل مع أخطاء جوجل
    if (!response.ok) return res.status(response.status).json(data);

    // استخراج الرد
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '##TRANSFER##';
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
