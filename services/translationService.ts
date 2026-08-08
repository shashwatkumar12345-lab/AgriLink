
import { GoogleGenAI } from "@google/genai";

export const translateBatch = async (
  texts: Record<string, string>,
  targetLanguage: string
): Promise<Record<string, string>> => {
  // Skip translation if target is English or input is empty
  if (!texts || Object.keys(texts).length === 0 || targetLanguage === 'English') return texts;

  try {
    const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
    const prompt = `
      You are a world-class professional translator for an agricultural app called AgriLink.
      Translate the values of the following JSON object into ${targetLanguage}.
      Keep the keys exactly the same.
      
      CRITICAL GUIDELINES:
      1. Do not translate brand names: "AgriLink", "Agri-Trace", "Kisan-Pulse", "Yield-Augment".
      2. Use clear, simple, and culturally appropriate language for rural farmers.
      3. PRESERVE ALL HTML TAGS (like <h3>, <ul>, <li>, <strong>, <b>, <br/>). Do not remove or alter the tags.
      4. Maintain placeholders like {count}, {name}, or {expertName}.
      5. Return ONLY the valid JSON object. No markdown code blocks, no preamble.

      Input JSON:
      ${JSON.stringify(texts)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { 
          responseMimeType: 'application/json',
          maxOutputTokens: 8192,
      }
    });

    const jsonStr = response.text?.trim() || '';
    if (!jsonStr) return texts;
    
    try {
      // Extract JSON content even if wrapped in markdown blocks
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : jsonStr);
      return parsed;
    } catch (parseError) {
      console.warn("Translation JSON parse failed, falling back to English.");
      return texts;
    }
  } catch (error) {
    console.error("Translation API error:", error);
    return texts;
  }
};
