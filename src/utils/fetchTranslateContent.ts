import { GoogleGenerativeAI } from '@google/generative-ai'

const API = import.meta.env.VITE_APP_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API)

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

interface TranslateResponse {
    detected: string,
    translatedTitle: string,
    translatedContent: string
}

export default async function fetchTranslateConntent(lang: string, title: string, content: string): Promise<TranslateResponse | string | undefined> {
    try {
        let prompt = `You will be given a title and a content and a language, you need to translate the given title and content into that given language exactly except the numerical values. The numerical values must kept in English language. Apart from translating, you need to detect and tell the language of the given title and content. If the given content is already in the same language as the language given you to translate the content then simply give empty text or string like : "". Your response format must be in JSON format given : {"detected": <language detectedof the given content in strings>, "translatedTitle": <translated title into the language given, leave this in empty string if the title is already in the same language as given>, "translatedContent": <translated content into the language given, leave this in empty string if the content is already in the same language as given>}. Now respond to this: \n\nGiven Language to convert to: ${lang} \n\nGiven title to convert: ${title} \n\nGiven content to convert to: ${content}`
        let result = ''

        while (1) {
            const response = await model.generateContent(prompt)
            
            result = response.response.text()

            result = result.substring(7, result.length - 3).trim()
            // console.log('fetched', result)

            try {
                result = JSON.parse(result)
                return result
            } catch(err) {
                continue
            }
        }
    } catch(err) {
        console.error('Error occured:', err)
        return 'error'
    }
}
