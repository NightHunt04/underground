import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_APP_GEMINI_API_KEY });

export default async function fetchAlgorithm(statement: string, description: string) {
  const systemPrompt = "You are an AI tutor. Explain problems clearly. Do not provide code, only algorithms in plain English.";

  const prompt = `Coding statement: ${statement}\n${description}\n(Note: Do not provide code)`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", // or "gemini-2.5-pro"
    contents: [
      { role: "system", parts: [{ text: systemPrompt }] },
      { role: "user", parts: [{ text: prompt }] }
    ],
    config: {
        temperature: 0.5
    }
  });

  return response.text;
}











// import { GoogleGenerativeAI } from '@google/generative-ai'

// const API = import.meta.env.VITE_APP_GEMINI_API_KEY
// const genAI = new GoogleGenerativeAI(API)

// const systemPrompt = 'You are an AI tutor. You will be given a coding problem and you only have to explain that coding problem in simple and descriptive manner and also generate an algorithm for it. Note that you are not allowed to generate the code solution for that problem but can only generate the algorithm (human language sentences to explain how the code will work) and explain that coding problem. Restrictions : Do NOT provide the code in any case. Only algorithms that too in english language are allowed.'

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: systemPrompt })

// export default async function fetchAlgorithm(statement: string, description: string): Promise<string> {
//     try {
//         let prompt = `Coding statement: ${statement} \n${description} \n(Note: No code should be provided by you)`
//         const response = await model.generateContent(prompt)
//         let result = response.response.text()

//         return result
//     } catch(err) {
//         console.error('Error occured:', err)
//         return 'error'
//     }
// }
