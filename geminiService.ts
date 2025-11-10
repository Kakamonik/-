
import { GoogleGenAI } from "@google/genai";

const systemInstruction = "أنت كاتب تقني خبير متخصص في توثيق البرامج. أعد كتابة وصف الكود أو التطبيق التالي ليكون واضحًا وموجزًا ​​واحترافيًا. قم بتحسين القواعد النحوية والبنية والدقة الفنية. قم بإخراج النص المحسّن فقط بدون أي مقدمات أو خواتيم.";

export const enhanceTextWithGemini = async (inputText: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not configured. Please ensure it is set in your environment variables.");
  }
  
  if (!inputText.trim()) {
    throw new Error("Input text cannot be empty.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: inputText,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
         throw new Error("Invalid API Key. Please check if your API key is correct and has the necessary permissions.");
    }
    throw new Error("Failed to get a response from the AI. Please check your connection and try again.");
  }
};
