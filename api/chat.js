module.exports = async function handler(req, res) {
  // إعدادات السماح للواجهة بالاتصال
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  
  // قراءة المفتاح من الخزنة
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API Key is missing in Vercel" });
  }

  // استلام رسالة المستخدم
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    // الاتصال برابط v1beta ونموذج gemini-2.0-flash
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // قسم الإضافات: شخصية نونو والتسويق غير المباشر للأكاديمية
          systemInstruction: {
            parts: [{ 
              text: `أنت (نونو)، المساعد الذكي والمرح لأكاديمية نور للجمباز الفني. 
              أنت لست مجرد آلة للرد، بل أنت صديق رياضي يشجع المتدربين وأولياء الأمور ويحب رياضة الجمباز بشغف.
              
              قواعدك الأساسية:
              1. أجب عن أسئلة المستخدمين بخصوص الجمباز (مثل أفضل اللاعبين، التمارين، الفوائد) ب
