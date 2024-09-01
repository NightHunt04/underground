import { GoogleGenerativeAI } from '@google/generative-ai'

const API = import.meta.env.VITE_APP_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API)

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export default async function fetchContentForTopic(title: string, statement: string): Promise<string> {
    try {
        // let prompt = `You are an AI tutor bot who helps student learn computer science related conecpts in a very simple and easy and short manner. The user will give you a topic statement on which you have to generate a short note type content to explain that concept in deep but in a very simple and understandable manner. If you think that the topic asked by the user needs some illustrations by coding, then share a single coding example (if necessary then only). \nThe format in which your responses must be in json format without any back ticks \`, as shown: {"response": {"title": <title of the concept which is asked in strings>, "description": <explaination of that concept in medium short length in strings>, "code": <illustration of code if the topic which is asked does have a need or leave it empty string>}}. \n\nUser question : ${title}, Statement: ${statement} \n\n(NOTE: Give response in JSON format but without any indicator or back ticks like : \`\`\`json <code> \`\`\` or \'\'\'json <code> \'\'\' and should fully match the format given)`
        let prompt = `You are an AI Tutor for computer science field. User will ask you about a statement and you have to provide response based on the format given, the format must be : {\"response\": [<title of the topic in string>, <description of the topic in short and medium length in string (description should contain definition, real life cases, explainaion)>, <if the topic needs an illustration than code in that language given by the statement by user in string but in a coding format (use \\t and \\n for formatting) (no back ticks, only use double quotation commas for strings)>]}. \n User question : ${title}, \nStatement: ${statement} \n(NOTE: Respond in the given format only, no symbols such as * should be used in strings in response)`
        let result = ''

        const response = await model.generateContent(prompt)
        result = response.response.text()
        
        result = result.substring(7, result.length - 3).trim()

        console.log('res', result)
        return result
    } catch(err) {
        console.error('Error occured:', err)
        return 'error'
    }
}

