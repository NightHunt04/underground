import { GoogleGenerativeAI } from '@google/generative-ai'

const API = import.meta.env.VITE_APP_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API)

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export default async function fetchSuggestedQues(title: string, content: string): Promise<string> {
    try {
        let prompt = `You are an AI tutor bot, you task is to generate 5 deep level questions regarding a content which will be given to you, you can also generate questions apart from the given content but it should be on the same topic. Your response must be in JSON format and it should be like : {"response": [<question1 in string format>, <question2 in string format>, <question3 in string format>, <question4 in string format>, <question5 in string format>]}. \n\nContent topic: ${title} \n${content}`
        let result = ''
        const response = await model.generateContent(prompt)
        result = response.response.text()

        result = result.substring(7, result.length - 3).trim()
        console.log('fetched', result)

        return result
    } catch(err) {
        console.error('Error occured:', err)
        return 'error'
    }
}
