import { GoogleGenerativeAI } from '@google/generative-ai'

const API = import.meta.env.VITE_APP_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API)

let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export default async function fetchSyllabusQues(title: string, topics: string[], brief: boolean): Promise<string> {
    try {
        let result = ''

        if (!brief)
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: 'You are an AI tutor. You will be given a title and statement and you need to generate 15 multiple choice questions in which each question will have a question regarding the concept given by the user, and each question will have 4 distinct and unique options and also a correct answer. Your response must be in JSON format given as : {"response":[{"question": <question1>, "options": [<option1>, <option2>, <option3>, <option4>], "correct": <option1 or correct option from 4 options>}, {"question": <question2>, "options": [<option1>, <option2>, <option3>, <option4>], "correct": <option1 or correct option from 4 options>}]} (upto 15 questions on given topic)' })

        else model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: 'You are an AI tutor. You will be given a title and statement and you need to generate 10 brief questions of those give topic by the user along with proper detailed answer. The response format must be in JSON format as given : {"response": [{"question": <question1>, "answer": <answer1>}, {"question": <question2>, "answer": <answer2>}]} \n(upto 10 questions on given topic)' })
    
        let prompt = `Title: ${title}\n Topics on which questions to be covered: `

        topics.forEach(topic => {
            prompt += topic + ', '
        })

        const response = await model.generateContent(prompt)
        result = response.response.text()

        result = result.substring(7, result.length - 3).trim()

        console.log(result)

        return result
    } catch(err) {
        console.error('Error occured:', err)
        return 'error'
    }

}
