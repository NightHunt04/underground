import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: import.meta.env.VITE_APP_GROQ_API, dangerouslyAllowBrowser: true })

export default async function fetchSpeechTest(nounce: number, userResponse: string, aiResponse: string, jobRole: string, skills: string): Promise<string | null> {
    let response

    console.log('taking', jobRole, skills, userResponse, aiResponse)

    console.log('user response', userResponse)
    console.log('ai response', aiResponse)

    if (nounce !== 0) {
        
        while (1) {
            try {
                response = await groq.chat.completions.create({
                    "messages": [
                        {
                            "role": "system",
                            "content": `You are a female interviewer conducting a professional interview.\\nYour role is to ask realistic and relevant questions based on the provided job role, required skills, and the interviewee's previous responses.\\nYou will be given the previous question you asked, the job role, the skills required, and the interviewee's response.\\nBased on this information, ask the next appropriate question.\\nYour responses must be professional, maintaining a formal tone throughout the interview.\\nIf the interviewee gives a response that is not respectful, is off-topic, or is not relevant to the job role, respond accordingly by being more stern and formal.\\nDo not tolerate any mischievous behavior or attempts to derail the interview from its professional tone.\\nIn addition to your next question, you will also provide a score for the interviewee's response, evaluating both communication clarity and technical accuracy and also the length of response based on the given question.\\nThese scores should be on a scale of 0 to 10, where 0 represents very poor performance and 10 represents excellent performance.\\nYour response should be in the following JSON format: {\"response\": \"<ai interviewer question>\",\"communicationClarity\": <0-10>,\"technicalAccuracy\": <0-10>, \"responseLength\": <0-10>}\\nMake sure your question is relevant to the job role and the skills required, and that it logically follows from the previous discussion.\\nAvoid being overly friendly if the interviewee does not behave professionally. \n\nYour previous question was : ${aiResponse}\m\nIf the response from the person is not good, then simply stop taking the interview.`
                        },
                        {
                            "role": "user",
                            "content": `User's job role: ${jobRole}\nUser's skills: ${skills}\nUser's response: ${userResponse}`
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

        response = JSON.parse(response!.choices[0].message.content!)
        console.log('interviewer', response)

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
        const response = await fetch('http://localhost:8000/generate-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
  
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
  
        const audio = new Audio(url)
        audio.play()
      } catch (error) {
        console.error('Error fetching audio:', error)
      }
}

// const speak = async (text: string) => {
//     console.log('gonna play')
//     const deepgramApiKey = import.meta.env.VITE_APP_DEEPGRAM_API
//     const deepgram = createClient(deepgramApiKey);
  
//     try {
//       const response = await deepgram.speak.request(
//         { text },
//         {
//           model: 'aura-asteria-en',
//         }
//       );
  
//       const stream = await response.getStream();
//       if (stream) {
//         const audioChunks: Blob[] = [];
  
//         // Collect the audio chunks from the stream
//         stream.on('data', (chunk: Blob) => {
//           audioChunks.push(chunk)
//         });
  
//         stream.on('end', () => {
//           const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
//           const audioUrl = URL.createObjectURL(audioBlob);
  
//           // Create a new audio element and play it automatically
//           const audio = new Audio(audioUrl);
//           audio.play();
//         });
//       } else {
//         console.error('Error generating audio');
//       }
//     } catch (err) {
//       console.error('Error generating audio:', err.message);
//     }
//   };