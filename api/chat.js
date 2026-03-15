export default async function handler(req, res) {
  // إعدادات CORS للسماح للواجهة بالاتصال بالخادم
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // الاستجابة السريعة لطلبات OPTIONS قبل إرسال الطلب الأساسي
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  // مفتاح الـ API الخاص بك (تذكر إنشاء مفتاح جديد وحذف هذا لاحقاً لأسباب أمنية)
  const apiKey = "AIzaSyDX6BOjfQ9Njd83qKjIb8GMycEWuG-Q04U"; 

  // التأكد من وجود المفتاح فقط دون شروط معقدة
  if (!apiKey) {
    return res.status(500).json({ error: "API Key is missing" });
  }

  // استلام النص (Prompt) من الواجهة
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    // الاتصال بخوادم جوجل باستخدام النموذج الأحدث (gemini-2.5-flash) لحل مشكلة 404
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    // إذا كان هناك خطأ من طرف جوجل (مثل خطأ في الرابط أو المفتاح)، يتم إرجاعه للواجهة
    if (!response.ok) return res.status(response.status).json(data);

    // استخراج الرد بنجاح وإرساله للواجهة
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '##TRANSFER##';
    return res.status(200).json({ text });

  } catch (err) {
    // التقاط أي أخطاء وقت التشغيل وإرجاعها
    return res.status(500).json({ error: err.message });
  }
}
