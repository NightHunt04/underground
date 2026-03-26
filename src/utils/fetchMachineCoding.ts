import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_APP_GEMINI_API_KEY });

const GENERATE_QUESTION_PROMPT = `
System: You are a Senior Technical Interviewer. 
Generate a coding problem suitable for a Machine Coding round based on the provided Job Role and Skills.
The problem should test algorithmic thinking, data structures, or practical implementation depending on the role.

Return ONLY a JSON object in this format:
{
  "title": "Problem Title",
  "description": "Detailed problem statement...",
  "constraints": "e.g., Time Limit: 1s, Memory: 256MB...",
  "examples": [
    { "input": "...", "output": "..." }
  ],
  "boilerplate": "// Optional starter code if applicable"
}
`;

const EVALUATE_CODE_PROMPT = `
System: You are a Senior Technical Interviewer evaluating a candidate's code submission.
Compare the user's code against the problem statement.

Analyze:
1. Correctness (Does it solve the problem?)
2. Efficiency (Time/Space complexity)
3. Code Style (Readability, variable naming)

Return ONLY a JSON object in this format:
{
  "feedback": "Constructive feedback on the approach...",
  "scores": {
    "correctness": number (0-10),
    "efficiency": number (0-10),
    "codeStyle": number (0-10),
    "overall": number (0-10)
  },
  "betterApproach": "Brief explanation of a better approach or optimization (optional)"
}
`;

export default async function fetchMachineCoding(
  mode: 'generate' | 'evaluate',
  payload: {
    role?: string,
    skills?: string,
    question?: string,
    userCode?: string,
    language?: string
  }
): Promise<string> {
  try {
    let systemInstruction = "";
    let prompt = "";

    if (mode === 'generate') {
      systemInstruction = GENERATE_QUESTION_PROMPT;
      prompt = `Job Role: ${payload.role}\nSkills: ${payload.skills}\nGenerate a coding interview problem.`;
    } else {
      systemInstruction = EVALUATE_CODE_PROMPT;
      prompt = `
      Problem Statement: ${payload.question}
      User's Code (${payload.language}): 
      ${payload.userCode}
      
      Evaluate this submission.
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: [{ text: systemInstruction }],
        responseMimeType: "application/json",
      }
    });

    return response.text!;
  } catch (err) {
    console.error("Error occurred in machine coding fetch:", err);
    return "error";
  }
}