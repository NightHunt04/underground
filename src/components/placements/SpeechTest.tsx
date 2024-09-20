// @ts-nocheck


import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import fetchSpeechTest, { audioEmitter } from "../../utils/fetchSpeechTest"
import Groq from 'groq-sdk'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import { LineChart } from '@mui/x-charts/LineChart'
import { Box, Stack } from '@mui/material';
import fetchRoleChecker from "../../utils/fetchRoleChecker"

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

    // const [isMockInterview, setIsMockInterview] = useState<boolean>(false)
    const [role, setRole] = useState<string>('')

    const [loader, setLoader] = useState<boolean>(false)
    const [loader1, setLoader1] = useState<boolean>(false)


    const [confirmedRole, setConfirmedRole] = useState<string>('')
    const [aiResponse, setAiResponse] = useState<string>('')
    // const [studentResponses, setStudentResponses] = useState<string[]>([])
    // const [feedback, setFeedback] = useState<string>('')

    const [studentResponse, setStudentResponse] = useState<string>('')
    // const [prevStudentResponse, setPrevStudentResponse] = useState<string>('')

    const [skills, setSkills] = useState<string>('')

    const [nounce, setNounce] = useState<number>(0)

    const [analysis, setAnalysis] = useState<AnalysisResponse>()
    const [allAnalysis, setAllAnalysis] = useState<AnalysisResponse[]>([])

    const [stopTest, setStopTest] = useState<boolean>(false)

    const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false)

    const [allStudentResponse, setAllStudentResponse] = useState<string[]>([])
    const [allAiResponse, setAllAiResponse] = useState<string[]>([])
    
    useEffect(() => {
      const onAudioPlayed = () => {
        setIsAudioPlaying(true)
        console.log('playing')
      }

      const onAudioEnded = () => {
        setIsAudioPlaying(false)
        console.log('stopped')
      }

      audioEmitter.on('audioPlayed', onAudioPlayed)
      audioEmitter.on('audioEnded', onAudioEnded)

      return () => {
        audioEmitter.off('audioPlayed', onAudioPlayed)
        audioEmitter.off('audioEnded', onAudioEnded)
      }
    }, [])

    const handleBegin = async(studentRes: string = ''): Promise<void> => {
        setStopTest(false)
        setConfirmedRole('success')
        const response = await fetchSpeechTest(nounce, studentRes, aiResponse, role, skills)
        console.log('here coming', response)

        if (nounce) {
            setAiResponse(response!.response)
            setAllAiResponse(prev => [...prev, response!.response])
        }
        else {
          setAiResponse(response!)
          setAllAiResponse(prev => [...prev, response!])
        }
        
        const analysis = {
            communicationClarity: response.communicationClarity,
            technicalAccuracy: response.technicalAccuracy,
            responseLength: response.responseLength
        }
        console.log(analysis)
        setAnalysis(analysis)
        setAllAnalysis(prev => [...prev, analysis])

        console.log('testing', response)
        console.log('all analysis', allAnalysis)
        setNounce(prev => prev + 1)
    }


    const handleSelectRole = async (): Promise<void> => {
      setLoader(true)
      // setFeedback('')
      // setPrevStudentResponse('')
      setStopTest(false)

      let response: RoleCheckResponse | string = await fetchRoleChecker(role, skills)

      try {
          response = JSON.parse(response)

          if (typeof response !== 'string') {
              if (response.isValid) {
                  setConfirmedRole('success')

                  handleBegin('')
              } else {
                  setConfirmedRole('failure')
              }
          }
      } catch(err) {
          console.error(err)
      }

      setLoader(false)
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
      setAllStudentResponse(prev => [...prev, transcription.text])

      setLoader1(false)
      handleBegin(transcription.text)


    } catch (error) {
      console.error('Error during transcription:', error);
    }
  }


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
                navigate('../')
            }} className="hover:bg-red-600 transition-all py-3 px-5 text-xs md:text-sm bg-red-500 text-white font-semibold absolute right-4 top-3 rounded-lg drop-shadow-lg">Close</button>

            <div className='font-semibold gap-3 flex items-center justify-start'>
                <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>2</div>
                <p className='text-lg md:text-xl'>Select the job role before going for the speech interview test</p>
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
                    onKeyDown={e => e.key === 'Enter' && handleSelectRole()}
                    className="bg-transparent w-full outline-none px-5 py-3" />
                <button onClick={() => handleSelectRole} className="hover:opacity-80 px-8 transition-all py-3 rounded-r-lg hover:bg-gray-100"><i className="fa-solid fa-arrow-up"></i></button>
            </div> 

            {loader && <div className="flex items-center justify-center w-full mt-16">Checking the role&nbsp;&nbsp;&nbsp;<div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>}

            {confirmedRole && confirmedRole === 'failure' && <p className="font-semibold mt-10 text-red-500">There is no such role/skills in IT department, please correct your role/skills.</p>}


            {/* if confirmed role */}
    </div>
    {confirmedRole && confirmedRole === 'success' && 
        <div className="relative flex flex-col items-start justify-start p-5 bg-white drop-shadow-lg rounded-lg w-full">
            <p>Interviewer: {aiResponse}</p>

            {isAudioPlaying && 
              <div className="mt-16 w-full flex items-center justify-center">
                <img src="/assets/speak2.gif" className="w-[50%] h-auto object-cover" />
              </div>}

            {studentResponse && !stopTest &&
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

            {stopTest && 
                <div className="w-full h-[200px] mt-10 mb-[950px]">
                    <p className="p-10 font-semibold">Overall analysis of given test</p>
                    {/* technical accuracy */}
                    <div className="w-full h-full flex items-start justify-start gap-5 p-10">
                        <LineChart
                            xAxis={[{ 
                                data: allAnalysis.map((_, index) => index + 1) 
                            }]}
                            yAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                            series={[
                                {
                                    data: allAnalysis.map((analysis) => analysis.technicalAccuracy),
                                }
                            ]}
                            width={500}
                            height={300}
                            sx={{
                                // Optional: Add easing to the entire chart animation
                                '& .MuiLineElement-root': {
                                    transition: 'all 3000ms cubic-bezier(0.4, 0, 0.2, 1)',
                                },
                            }}
                        />
                        <div className="w-[50%] flex flex-col items-start justify-start gap-3">
                            <p className="font-semibold text-gray-700">Overall Technical Accuracy</p>
                            <p className="text-xs md:text-sm text-gray-600 max-w-[70%]">This measures how correctly and effectively your answers demonstrate knowledge and application of technical concepts. It reflects the precision and correctness of the solutions or explanations you provide during the interview.</p>
                            <p className="text-2xl">&#x1D465; &#8594; <span className="text-sm md:text-lg">Answer number</span></p>
                            <p className="text-2xl">&#x1D466; &#8594; <span className="text-sm md:text-lg">Points in terms of technical accuracy</span></p>
                        </div>
                    </div>

                    {/* communication clarity */}
                    <div className="w-full h-full flex items-start justify-start gap-5 mt-36 p-10">
                        <LineChart
                            xAxis={[{ 
                                data: allAnalysis.map((_, index) => index + 1) 
                            }]}
                            yAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                            series={[
                                {
                                    data: allAnalysis.map((analysis) => analysis.communicationClarity),
                                },
                            ]}
                            width={500}
                            height={300}
                        />
                        <div className="w-[50%] flex flex-col items-start justify-start gap-3">
                            <p className="font-semibold text-gray-700">Overall Communication Clarity</p>
                            <p className="text-xs md:text-sm text-gray-600 max-w-[70%]">This assesses how clearly and effectively you express your ideas. It reflects your ability to convey complex technical concepts in a way that is easy to understand, ensuring that your explanations are logical, concise, and well-structured.</p>
                            <p className="text-2xl">&#x1D465; &#8594; <span className="text-sm md:text-lg">Answer number</span></p>
                            <p className="text-2xl">&#x1D466; &#8594; <span className="text-sm md:text-lg">Points in terms of communication clarity</span></p>
                        </div>
                    </div>

                    {/* overall */}
                    <div className="w-full h-full flex items-start justify-start gap-5 mt-36 p-10">
                        <LineChart
                            xAxis={[{ 
                                data: allAnalysis.map((_, index) => index + 1) 
                            }]}
                            yAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                            series={[
                                {
                                    data: allAnalysis.map((analysis) => analysis.responseLength),
                                },
                            ]}
                            width={500}
                            height={300}
                        />
                        <div className="w-[50%] flex flex-col items-start justify-start gap-3">
                            <p className="font-semibold text-gray-700">Response total length</p>
                            <p className="text-xs md:text-sm text-gray-600 max-w-[70%]">This gives overall score which is based upon technical accuracy and communication clarity.</p>
                            <p className="text-2xl">&#x1D465; &#8594; <span className="text-sm md:text-lg">Answer number</span></p>
                            <p className="text-2xl">&#x1D466; &#8594; <span className="text-sm md:text-lg">Points in terms of overall score</span></p>
                        </div>
                    </div>
                </div>}

                {stopTest &&
                  <div className="w-full mt-12 p-5 grid grid-cols-2 row-span-1 items-start justify-start gap-5">
                    {allStudentResponse.map((res, index) => {
                      return (
                        <div key={index} className="flex flex-col border-2 row-span-1 h-full border-gray-300 items-start justify-between w-full p-3 rounded-lg">
                          <div className="flex flex-col items-start justify-start w-full gap-3">
                            <p className="px-5 py-3 rounded-lg drop-shadow-lg text-xs md:text-sm font-medium bg-gray-200">{index + 1}. AI response: {allAiResponse[index]}</p>
                            <p className="px-5 py-3 rounded-lg drop-shadow-lg text-xs md:text-sm bg-green-100">Your response: {res}</p>
                          </div>
                          
                          {/* <p className="mt-10 font-semibold">Analytics</p> */}
                          <div className="h-[90px] w-full mt-12 mb-32">
                            <p className="p-5">Analysis of given answer</p>
                            <Stack direction={{ xs: 'column', md: 'row' }} className="h-full" spacing={{ xs: 1, md: 3 }}>
                                <Box textAlign="center" width="100%">
                                    <Gauge
                                      value={allAnalysis[index].technicalAccuracy * 10}
                                      startAngle={-110}
                                      endAngle={110}
                                      innerRadius="90%"
                                      outerRadius="100%"
                                      cornerRadius="50%"
                                      sx={(theme) => ({
                                          [`& .${gaugeClasses.valueText}`]: {
                                          fontSize: 19,
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
                                    <p className="text-xs md:text-sm">Technical Accuracy</p>
                                </Box>

                                <Box textAlign="center" width="100%">
                                    <Gauge
                                      value={allAnalysis[index].communicationClarity * 10}
                                      startAngle={-110}
                                      endAngle={110}
                                      innerRadius="90%"
                                      outerRadius="100%"
                                      cornerRadius="50%"
                                      sx={(theme) => ({
                                          [`& .${gaugeClasses.valueText}`]: {
                                          fontSize: 19,
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
                                    <p className="text-xs md:text-sm">Communication Clarity</p>
                                </Box>

                                <Box textAlign="center" width="100%">
                                    <Gauge
                                      value={allAnalysis[index].responseLength * 10}
                                      startAngle={-110}
                                      endAngle={110}
                                      innerRadius="90%"
                                      outerRadius="100%"
                                      cornerRadius="50%"
                                      sx={(theme) => ({
                                          [`& .${gaugeClasses.valueText}`]: {
                                          fontSize: 19,
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
                                    <p className="text-xs md:text-sm">Content length</p>
                                </Box>
                            </Stack>
                        </div>      
                        </div>
                      )
                    })}
                  </div>}

            {loader1 && <div className="w-full mt-12 flex items-center justify-center"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>}

            {!stopTest && <div className="w-full flex items-center justify-center gap-5 mt-10">
              <button onClick={toggleRecording} className="px-5 py-3 text-xs md:text-sm font-semibold text-white bg-green-500 drop-shadow-lg rounded-lg">{isRecording ? 'Stop Recording' : 'Start Recording'}</button>
              <button onClick={() => setStopTest(true)} className="px-5 py-3 text-xs md:text-sm font-semibold text-white bg-red-500 drop-shadow-lg rounded-lg">Stop and get analysis</button>
            </div>}
        </div>}
    </div>
  )
}
