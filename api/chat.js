module.exports = async function handler(req, res) {
  // إعدادات السماح للواجهة بالاتصال
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  // قراءة المفتاح من خزنة Vercel (تأكد أن الاسم في Vercel هو GEMINI_API_KEY بحروف كبيرة)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key is missing" });
  }

  // استلام رسالة المستخدم
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // هنا تضع عقل المساعد وبيانات الأكاديمية (لا تنسَ تعديلها)
          systemInstruction: {
            parts: [{ 
              text: `أنت (نونو)، المساعد الذكي والودود لأكاديمية الجمباز الفني.
              مهمتك الاساسية هى الرد على استفسارات المستخدم بطريقة جذابة بخصوص الجمباز بشكل عام و الترويج لأكاديمية نور للجمباز بشكل خاص و بطريقة غير مباشرة لحث المستخدم للاشتراك فى الاكاديمية.` 
            }]
          },
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) return res.status(response.status).json(data);

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '##TRANSFER##';
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
