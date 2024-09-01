import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import fetchSpeechTest from "../../utils/fetchSpeechTest"
import Groq from 'groq-sdk'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import { LineChart } from '@mui/x-charts/LineChart'
import { Box, Stack } from '@mui/material';

interface RoleCheckResponse {
    isValid: number
}

interface GeminiResponse {
    question: string
}

interface AnalysisResponse {
    communicationClarity: number,
    responseLength: number,
    technicalAccuracy: number
}

export default function SpeechTest() {
    const navigate = useNavigate()

    const [isMockInterview, setIsMockInterview] = useState<boolean>(false)
    const [role, setRole] = useState<string>('')

    const [loader, setLoader] = useState<boolean>(false)
    const [loader1, setLoader1] = useState<boolean>(false)


    const [confirmedRole, setConfirmedRole] = useState<string>('')
    const [aiResponse, setAiResponse] = useState<string>('')
    // const [studentResponses, setStudentResponses] = useState<string[]>([])
    const [feedback, setFeedback] = useState<string>('')

    const [studentResponse, setStudentResponse] = useState<string>('')
    const [prevStudentResponse, setPrevStudentResponse] = useState<string>('')

    const [skills, setSkills] = useState<string>('')

    const [nounce, setNounce] = useState<number>(0)

    const [analysis, setAnalysis] = useState<AnalysisResponse>()
    const [allAnalysis, setAllAnalysis] = useState<AnalysisResponse[]>([])

    const [stopTest, setStopTest] = useState<boolean>(false)

    const handleBegin = async(studentRes: string = ''): Promise<void> => {
        setConfirmedRole('success')
        const response = await fetchSpeechTest(nounce, studentRes, aiResponse, role, skills)
        console.log('here coming', response)

        if (nounce)
            setAiResponse(response!.response)
        else setAiResponse(response!)
        
        const analysis = {
            communicationClarity: response.communicationClarity,
            technicalAccuracy: response.technicalAccuracy,
            responseLength: response.responseLength
        }
        setAnalysis(analysis)
        setAllAnalysis(prev => [...prev, analysis])

        console.log('testing', response)
        setNounce(prev => prev + 1)
    }



    const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setIsRecording(true);
    audioChunksRef.current = []; // Clear previous recordings

    try {
        setLoader1(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        await main(audioBlob);

        URL.revokeObjectURL(url); 
      };
      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };


  async function main(audioBlob: Blob) {
    // Convert Blob to File if necessary
    const groq = new Groq({ apiKey: import.meta.env.VITE_APP_GROQ_API, dangerouslyAllowBrowser: true })
    const file = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

    try {
      const transcription = await groq.audio.transcriptions.create({
        file: file,  // Use the File object here
        model: "whisper-large-v3",
        prompt: "Return the response in JSON object only.",
        response_format: "verbose_json",
      });
      console.log(transcription.text);
      setStudentResponse(transcription.text)

      setLoader1(false)
      handleBegin(transcription.text)


    } catch (error) {
      console.error('Error during transcription:', error);
    }
  }


  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    const handlePlay = () => setIsAudioPlaying(true);
    const handlePause = () => setIsAudioPlaying(false);
    const handleEnded = () => setIsAudioPlaying(false);

    // Listen for 'play' and 'pause' events on all audio elements
    document.addEventListener('play', handlePlay, true);
    document.addEventListener('pause', handlePause, true);
    document.addEventListener('ended', handleEnded, true);

    return () => {
      // Cleanup the event listeners when the component is unmounted
      document.removeEventListener('play', handlePlay, true);
      document.removeEventListener('pause', handlePause, true);
      document.removeEventListener('ended', handleEnded, true);
    };
  }, []);
    

  return (
    <div className="flex flex-col w-full items-start justify-start gap-5">
    <div className="relative flex flex-col items-start justify-start p-5 bg-white drop-shadow-lg rounded-lg w-full">
        <button onClick={() => {
                navigate(-1)
            }} className="hover:bg-red-600 transition-all py-3 px-5 text-xs md:text-sm bg-red-500 text-white font-semibold absolute right-4 top-3 rounded-lg drop-shadow-lg">Close</button>

            <div className='font-semibold gap-3 flex items-center justify-start'>
                <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>2</div>
                <p className='text-lg md:text-xl'>Select the job role before going for the test</p>
            </div>        

            <p className="mt-12 font-medium text-gray-600">Enter your role down below</p>
            <div className="flex items-center justify-center rounded-lg border-2 border-green-500 w-[70%] mt-1">
                <input 
                    type="text"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    placeholder="Role here"
                    // onKeyDown={e => e.key === 'Enter' && handleSelectRole()}
                    className="bg-transparent w-full outline-none px-5 py-3" />
                {/* <button onClick={handleSelectRole} className="hover:opacity-80 px-8 transition-all py-3 rounded-r-lg hover:bg-gray-100"><i className="fa-solid fa-arrow-up"></i></button> */}
            </div> 

            <p className="mt-12 font-medium text-gray-600">Enter skills that you know based on the selected role</p>
            <div className="flex items-center justify-center rounded-lg border-2 border-green-500 w-[70%] mt-1">
                <input 
                    type="text"
                    value={skills}
                    onChange={e => setSkills(e.target.value)}
                    placeholder="Skills here (add by separating with commmas ',')"
                    onKeyDown={e => e.key === 'Enter' && handleBegin()}
                    className="bg-transparent w-full outline-none px-5 py-3" />
                <button onClick={() => handleBegin('')} className="hover:opacity-80 px-8 transition-all py-3 rounded-r-lg hover:bg-gray-100"><i className="fa-solid fa-arrow-up"></i></button>
            </div> 

            {loader && <div className="flex items-center justify-center w-full mt-16">Checking the role&nbsp;&nbsp;&nbsp;<div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>}

            {confirmedRole && confirmedRole === 'failure' && <p className="font-semibold mt-10 text-red-500">There is no such role/skills in IT department, please correct your role/skills.</p>}


            {/* if confirmed role */}
    </div>
    {confirmedRole && confirmedRole === 'success' && 
        <div className="relative flex flex-col items-start justify-start p-5 bg-white drop-shadow-lg rounded-lg w-full">
            <p>Interviewer: {aiResponse}</p>

            {isAudioPlaying && <p>playing</p>}

            {studentResponse && 
                <div className="h-[150px] w-full my-20 mb-32">
                <p className="p-5">Analysis of previous given answer</p>
                <Stack direction={{ xs: 'column', md: 'row' }} className="h-full" spacing={{ xs: 1, md: 3 }}>
                    <Box textAlign="center" width="100%">
                        <Gauge
                        value={analysis?.technicalAccuracy! * 10}
                        startAngle={-110}
                        endAngle={110}
                        innerRadius="80%"
                        outerRadius="100%"
                        cornerRadius="50%"
                        sx={(theme) => ({
                            [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 30,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                            fill: '#52b202',
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                            fill: theme.palette.text.disabled,
                            },
                        })}
                        text={({ value, valueMax }) => `${value! / 10} / ${valueMax! / 10}`}
                        />
                        <p>Technical Accuracy</p>
                    </Box>

                    <Box textAlign="center" width="100%">
                        <Gauge
                        value={analysis?.communicationClarity! * 10}
                        startAngle={-110}
                        endAngle={110}
                        innerRadius="80%"
                        outerRadius="100%"
                        cornerRadius="50%"
                        sx={(theme) => ({
                            [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 30,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                            fill: '#52b202',
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                            fill: theme.palette.text.disabled,
                            },
                        })}
                        text={({ value, valueMax }) => `${value! / 10} / ${valueMax! / 10}`}
                        />
                        <p>Communication Clarity</p>
                    </Box>

                    <Box textAlign="center" width="100%">
                        <Gauge
                        value={analysis?.responseLength! * 10}
                        startAngle={-110}
                        endAngle={110}
                        innerRadius="80%"
                        outerRadius="100%"
                        cornerRadius="50%"
                        sx={(theme) => ({
                            [`& .${gaugeClasses.valueText}`]: {
                            fontSize: 30,
                            },
                            [`& .${gaugeClasses.valueArc}`]: {
                            fill: '#52b202',
                            },
                            [`& .${gaugeClasses.referenceArc}`]: {
                            fill: theme.palette.text.disabled,
                            },
                        })}
                        text={({ value, valueMax }) => `${value! / 10} / ${valueMax! / 10}`}
                        />
                        <p>Content length</p>
                    </Box>
                </Stack>
            </div>}

            {loader1 && <div className="w-full mt-12 flex items-center justify-center"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>}

            <button onClick={toggleRecording} className="px-5 py-3 text-xs md:text-sm font-semibold text-white bg-green-500 drop-shadow-lg rounded-lg mt-10">{isRecording ? 'Stop Recording' : 'Start Recording'}</button>
        </div>}
    </div>
  )
}
