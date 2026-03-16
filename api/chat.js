export default async function handler(req, res) {
  // 1. إعدادات السماح للواجهة بالاتصال
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  // 2. قراءة المفتاح من خزنة Vercel (بالاسم الذي اخترته: gemini_api_key)
  const apiKey = process.env.gemini_api_key;

  // إيقاف الكود فوراً إذا لم يجد المفتاح في الخزنة
  if (!apiKey) {
    return res.status(500).json({ error: "API Key is missing from Environment Variables" });
  }

  // 3. استلام رسالة المستخدم
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    // 4. الاتصال بنموذج gemini-2.5-flash وتمرير المفتاح بشكل آمن
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // 5. قسم الإضافات: هنا تضع عقل المساعد "نونو" وبيانات الأكاديمية
          system_instruction: {
            parts: [{ 
              text: `أنت (نونو)، المساعد الذكي والودود لأكاديمية الجمباز.
              مهمتك الأساسية هي الرد على استفسارات الاشخاص عن الجمباز و الترويج بشكل غير مباشر لأكاديمية نور للجمباز للحث على الاشتراك فيها.
              
              [قم بكتابة الإضافات هنا: الأسعار، المواعيد، شروط القبول، أو أي قواعد أخرى تريد من المساعد الالتزام بها...]` 
            }]
          },
          // 6. تمرير رسالة المستخدم للنموذج
          contents: [{ role: 'user', parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    // التعامل مع أخطاء جوجل إن وجدت
    if (!response.ok) return res.status(response.status).json(data);

    // استخراج الرد بنجاح
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '##TRANSFER##';
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
    
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
