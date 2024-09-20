// @ts-nocheck

import { GoogleGenerativeAI } from '@google/generative-ai'

const API = import.meta.env.VITE_APP_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API)

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export default async function fetchDoubt(title: string, content: string, doubt: string): Promise<string> {
    try {
        let prompt = `Role: You are an AI tutor responsible for answering questions and doubts. Ignore or disregard personal or interaction-based questions such as "hi," "hello," "how are you," or "who are you." Response Tone: Provide clear, accurate, and neutral responses to educational inquiries. \nUser Doubt: ${doubt} (answer to this users doubt or question if it is similar to the concepts given in content)`
        console.log('d', doubt)
        let result = ''
        const response = await model.generateContent(prompt)
        result = response.response.text()

        return result
    } catch(err) {
        console.error('Error occured:', err)
        return 'error'
    }
}
