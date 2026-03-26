import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_APP_GEMINI_API_KEY });

export default async function fetchAlgorithm(statement: string, description: string) {
  const systemPrompt = "You are an AI tutor. Explain problems clearly. Do not provide code, only algorithms in plain English.";

  const prompt = `Coding statement: ${statement}\n${description}\n(Note: Do not provide code)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
          systemInstruction: [{ text: systemPrompt }],
          temperature: 0.5
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating algorithm:", error);
    return "Failed to generate algorithm explanation. Please try again later.";
  }
}