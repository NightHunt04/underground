import Groq from 'groq-sdk'
import EventEmitter from 'eventemitter3';
import { ttsApi } from '../api/tts';

export const audioEmitter = new EventEmitter();

const groq = new Groq({ apiKey: import.meta.env.VITE_APP_GROQ_API, dangerouslyAllowBrowser: true })

export default async function fetchSpeechTest(nounce: number, userResponse: string, aiResponse: string, jobRole: string, skills: string): Promise<any> {
    let response

    console.log('taking', jobRole, skills, userResponse, aiResponse)

    if (nounce !== 0) {
        
        while (1) {
            try {
                response = await groq.chat.completions.create({
                    "messages": [
                        {
                            "role": "system",
                            "content": `You are a female interviewer for an IT department conducting a professional interview. Your task is:
1. Begin with 2-3 questions about the candidate's projects related to their skills.
2. Then transition to theoretical concepts related to the candidate's skills and job role.
3. For programming skills, ask about specific concepts, best practices, and use cases.
4. Maintain a professional yet approachable tone throughout.
5. Respond to answers, discussing them briefly and professionally.
6. Follow up with related questions based on responses.
7. Use occasional filler words like "um" or "uh" sparingly.
8. Include brief pauses using "..." at appropriate points.
9. Express uncertainty professionally when needed.
10. Ask for clarification professionally if something is unclear.
11. Provide constructive feedback and appropriate appreciation for good responses.
12. Keep questions concise and relevant.
13. If the candidate behaves unprofessionally, kindly request them to maintain a professional demeanor.
14. Always return responses in a JSON object format without code formatting indicators.
15. Include scores for communication clarity, technical accuracy, and response length (0-10) based on the candidate's answers.
Example flow:
1. Ask about projects: "Could you describe a recent project where you used JavaScript?"
2. Follow up on project details: "What challenges did you face in implementing that feature?"
3. Transition to theoretical concepts: "Let's discuss some JavaScript concepts. Could you explain closures and their importance?"
4. Continue with specific technical questions: "How do you handle asynchronous operations in JavaScript?"
Example output format:
{"response": "Thank you for sharing about your project. Now, let's discuss some JavaScript concepts. Could you explain closures and their importance in JavaScript?","communicationClarity": 8,"technicalAccuracy": 7,"responseLength": 6}
Maintain this professional approach while adhering to the JSON format for responses. 

Your previous question was : ${aiResponse}\m
If the response from the person is not good, then simply stop taking the interview.`
                        },
                        {
                            "role": "user",
                            "content": `Given job role: ${jobRole}\nGiven skills: ${skills}\nUser's response: ${userResponse}`
                    }
                    ],
                    "model": "llama-3.1-8b-instant",
                    "temperature": 1,
                    "max_tokens": 1024,
                    "top_p": 1,
                    "stream": false,
                    "response_format": {
                    "type": "json_object"
                    },
                    "stop": null
                })

                break
            } catch (err) {
                console.error(err)
                continue
            }
        }

        console.log(response)

        // @ts-ignore
        response = JSON.parse(response!.choices[0].message.content!)
        console.log('interviewer', response)

        // @ts-ignore
        speak(response.response)

        return response
    }

    else {
        response = "Hello there... introduce yourself in brief please"

        speak(response)

        return response
    }

}

const speak = async (text: string): Promise<void> => {
    try {
        // Use the new API
        const blob = await ttsApi.generateAudio(text);
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url)

        audio.onplay = () => {
            audioEmitter.emit('audioPlayed');
        }

        audio.onended = () => {
            audioEmitter.emit('audioEnded');
        }

        audio.play()
      } catch (error) {
        console.error('Error generating audio:', error)
      }
}