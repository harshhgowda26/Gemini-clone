import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const generateGeminiResponse = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response?.text || "⚠️ No response from Gemini";
  } catch (err) {
    console.error("Gemini SDK Error:", err);

    if (err?.status === 429) {
      return "⏳ Rate limit exceeded. Please wait a few seconds.";
    }

    return "❌ Error connecting to Gemini API";
  }
};

export default generateGeminiResponse;
