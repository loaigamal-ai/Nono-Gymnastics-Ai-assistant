import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Creates and initializes a new chat session with the Gemini model.
 * The session is primed with system instructions and the academy's knowledge base.
 * @param knowledgeBaseString The knowledge base as a single string.
 * @returns An initialized Chat instance.
 */
export const createChatSession = (knowledgeBaseString: string): Chat => {
  const model = 'gemini-2.5-flash';
  
  const systemInstruction = `
    أنت "نونو"، مساعد ذكي لأكاديمية نور للجمباز. مهمتك هي مساعدة العملاء بالإجابة على استفساراتهم بالعامية المصرية.

    **معلومات هامة:**
    *   **التخصص:** أكاديمية نور متخصصة في **الجمباز الفني للبنات فقط**. لازم المعلومة دي تكون واضحة في كلامك دائماً.
    *   **اللهجة:** اتكلم بالعامية المصرية، وخليك ودود ومتعاون.

    **التعليمات:**
    1.  **خليك مختصر جداً:** جاوب على السؤال في جملة أو جملتين بالكثير. إجاباتك لازم تكون قصيرة ومباشرة.
    2.  **استخدم الذاكرة:** تذكر المحادثة السابقة ورد بناءً عليها. لا تعامل كل سؤال كأنه الأول.
    3.  **الدقة:** اعتمد على المعلومات الموجودة في "قاعدة المعرفة" عشان تكون إجاباتك صح.
    4.  **التشجيع:** بعد ما تجاوب على السؤال، ممكن تضيف جملة بسيطة تشجع العميل ياخد خطوة، زي "تحب تسأل عن حاجة تانية؟" أو "ممكن نحجز حصة تجريبية لو تحبي".
    5.  **خارج التخصص:** لو السؤال مش عن الجمباز أو مش في قاعدة المعرفة، اعتذر بلطف وقول "معنديش معلومة عن النقطة دي، بس أقدر أساعدك في أي حاجة تخص أكاديمية نور للجمباز الفني للبنات".

    قاعدة المعرفة:
    ---
    ${knowledgeBaseString}
    ---
  `;

  try {
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return chat;
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw new Error("Could not create chat session.");
  }
};