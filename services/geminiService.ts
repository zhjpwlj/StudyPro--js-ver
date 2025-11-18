import { GoogleGenAI } from "@google/genai";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;

const getAiClient = () => {
  if (!API_KEY) {
    console.warn("API_KEY is not set. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const askGemini = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key not configured.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};

export const askGeminiPro = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini Pro API:", error);
    return "Sorry, I encountered an error with the advanced model. Please try again.";
  }
};

export const sendMessageStream = async (
    prompt: string,
    isDeepThink: boolean,
    onChunk: (chunk: string) => void,
    onComplete: () => void
): Promise<void> => {
    const ai = getAiClient();
    if (!ai) {
        onChunk("API Key not configured.");
        onComplete();
        return;
    }

    try {
        const model = isDeepThink ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
        
        const response = await ai.models.generateContentStream({
            model: model,
            contents: prompt,
            config: isDeepThink ? { thinkingConfig: { thinkingBudget: 32768 } } : {}
        });

        for await (const chunk of response) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        onChunk("Sorry, I encountered an error. Please try again.");
    } finally {
        onComplete();
    }
};