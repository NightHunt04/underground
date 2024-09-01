import { GoogleGenerativeAI } from '@google/generative-ai'

const API = import.meta.env.VITE_APP_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API)

const introductory = 'System: You are an AI interviewer for a {jobRole} position and {skills} given by them. Provide a relevant interview question. This is the first question, make it an introductory one. Return the response in JSON Object:\n{\n  "question": "string"\n}\n\nRespond ONLY with a JSON object containing a single "question" key. Do not include any explanations, markdown formatting, or code blocks. The response should be a valid JSON object that can be directly parsed.\n\nExample of desired response format:\n{"question": "Can you tell me about your experience with Python programming?"}\n\nEnsure your response follows this exact format, with no additional text before or after the JSON object.'

const feedBackandNext = `System: You are an AI interviewer for a {jobRole} position. The current question was "{question}" and the candidate's answer was "{answer}". Analyze the answer, provide feedback, and generate the next question if appropriate. Return the response ONLY as a valid JSON object with no additional text, formatting, or code blocks. The response must be directly parseable as JSON.\n\nResponse format:\n{"feedback": "string","nextQuestion": "string or null if the interview should end","analysis": {"technicalAccuracy": number (0-10),"communicationClarity": number (0-10),"overallScore": number (0-10)}}\n\nEnsure your response is exactly in this format, with no text before or after the JSON object. The 'analysis' object should contain scores for different aspects of the answer, helping the candidate understand areas for improvement.`

let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export default async function fetchMockInterview(userResponse: string = '', geminiResponse: string = '', userRole: string, userSkills: string, nounce: number): Promise<string> {
    try {
        let result = ''

        if (nounce === 0) {
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",  systemInstruction: introductory })
            
            let prompt = 'Given job role: ' + userRole + '\n\nGiven skills: ' + userSkills

            const response = await model.generateContent(prompt)
            result = response.response.text()

            console.log('res', result)
        } else if (nounce > 0 && nounce <= 4) {
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",  systemInstruction: feedBackandNext })

            let prompt = `Job Role: ${userRole}\n\nSkills: ${userSkills}\n\nThe current question was ${geminiResponse} and the candidate's answer was ${userResponse}`

            const response = await model.generateContent(prompt)
            result = response.response.text()

            console.log('res', result)
        }
        
        return result
    } catch(err) {
        console.error('Error occured:', err)
        return 'error'
    }
}

