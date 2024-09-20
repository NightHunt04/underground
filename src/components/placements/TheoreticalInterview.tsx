import { useState } from "react"
import fetchRoleChecker from "../../utils/fetchRoleChecker"
import fetchMockInterview from "../../utils/fetchMockInterview"
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge'
import { LineChart } from '@mui/x-charts/LineChart'
import { Box, Stack } from '@mui/material';
import { Outlet, useNavigate } from "react-router-dom"


interface RoleCheckResponse {
    isValid: number
}

interface GeminiResponse {
    question: string
}

interface AnalysisResponse {
    communicationClarity: number,
    overallScore: number,
    technicalAccuracy: number
}

export default function TheoreticalInterview() {
    const navigate = useNavigate()

    const [isMockInterview, setIsMockInterview] = useState<boolean>(false)
    const [role, setRole] = useState<string>('')

    const [loader, setLoader] = useState<boolean>(false)
    const [loader1, setLoader1] = useState<boolean>(false)


    const [confirmedRole, setConfirmedRole] = useState<string>('')
    const [geminiResponse, setGeminiResponse] = useState<string>('')
    // const [studentResponses, setStudentResponses] = useState<string[]>([])
    const [feedback, setFeedback] = useState<string>('')

    const [studentResponse, setStudentResponse] = useState<string>('')
    const [prevStudentResponse, setPrevStudentResponse] = useState<string>('')

    const [skills, setSkills] = useState<string>('')

    const [nounce, setNounce] = useState<number>(0)

    const [analysis, setAnalysis] = useState<AnalysisResponse>()
    const [allAnalysis, setAllAnalysis] = useState<AnalysisResponse[]>([])
    const [allStudentResponse, setAllStudentResponse] = useState<string[]>([])
    const [allGeminiResponse, setAllGeminiResponse] = useState<string[]>([])

    const [stopTest, setStopTest] = useState<boolean>(false)

    const handleSelectRole = async (): Promise<void> => {
        setLoader(true)
        setFeedback('')
        setPrevStudentResponse('')
        setAllStudentResponse([])
        setAllGeminiResponse([])
        setStopTest(false)

        let response: RoleCheckResponse | string = await fetchRoleChecker(role, skills)

        try {
            response = JSON.parse(response)

            if (typeof response !== 'string') {
                if (response.isValid) {
                    setConfirmedRole('success')

                    handleGeminiResponse()

                    // break
                } else {
                    setConfirmedRole('failure')
                    // break
                }
            }
        } catch(err) {
            console.error(err)
        }
    // }

        setLoader(false)
    }

    // will only call first time
    const handleGeminiResponse = async (): Promise<void> => {
        // while (1) {
        let response = await fetchMockInterview('', '', role, skills, 0)
        try {
            response = JSON.parse(response)
            // if (typeof response !== 'string')
            setGeminiResponse(response.question)
            setAllGeminiResponse(prev => [...prev, response.question])
            setNounce(prev => prev + 1)
            // break
        } catch(err) {
            console.error(err)
        }
        console.log('intro', response)
    // }
    }

    const handleStudentResponse = async(): Promise<void> => {
        setLoader1(true)

        setPrevStudentResponse(studentResponse)
        setAllStudentResponse(prev => [...prev, studentResponse])

        let response 

            response = await fetchMockInterview(studentResponse, geminiResponse, role, skills, nounce)

            try {
                response = JSON.parse(response)
            } catch(err) {
                console.error(err)
            }

        setFeedback(response.feedback)
        setGeminiResponse(response.nextQuestion)
        setAllGeminiResponse(prev => [...prev, response.nextQuestion])

        setAnalysis(response.analysis)
        setAllAnalysis(prev => [...prev, response.analysis])

        setNounce(prev => prev + 1)

        setStudentResponse('')

        setLoader1(false)
    }

    const handleStopTest = () => {
        setStopTest(true)
        setPrevStudentResponse('')
        setGeminiResponse('')
        setStudentResponse('')
        setFeedback('')
    }

  return (
    <div className="w-full">
        {/* set role and skills */}
        <div className="relative flex flex-col items-start justify-start p-5 bg-white drop-shadow-lg rounded-lg w-full">
            <button onClick={() => {
                navigate('../')
            }} className="hover:bg-red-600 transition-all py-3 px-5 text-xs md:text-sm bg-red-500 text-white font-semibold absolute right-4 top-3 rounded-lg drop-shadow-lg">Close</button>

            <div className='font-semibold gap-3 flex items-center justify-start'>
                <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>2</div>
                <p className='text-lg md:text-xl'>Select the job role before going for the theoretical interview test</p>
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
                <button onClick={handleSelectRole} className="hover:opacity-80 px-8 transition-all py-3 rounded-r-lg hover:bg-gray-100"><i className="fa-solid fa-arrow-up"></i></button>
            </div> 

            {loader && <div className="flex items-center justify-center w-full mt-16">Checking the role&nbsp;&nbsp;&nbsp;<div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>}

            {confirmedRole && confirmedRole === 'failure' && <p className="font-semibold mt-10 text-red-500">There is no such role/skills in IT department, please correct your role/skills.</p>}
        </div>


        {/* after confirming role */}
        {confirmedRole && confirmedRole === 'success' && <div className="relative flex flex-col items-start justify-start p-5 bg-white drop-shadow-lg rounded-lg w-full">
            <button onClick={() => { 
                setConfirmedRole('') 
                setRole('')
                setSkills('')
                setGeminiResponse('')
                setStudentResponse('')
                setNounce(0)
                setFeedback('')
                setPrevStudentResponse('')
                setAllAnalysis([])
            }} className="hover:bg-red-600 transition-all py-3 px-5 text-xs md:text-sm bg-red-500 text-white font-semibold absolute right-4 top-3 rounded-lg drop-shadow-lg">Close</button>

            <div className='font-semibold gap-3 flex items-center justify-start'>
                <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>3</div>
                <p className='text-lg md:text-xl'>Start taking a test 🎉</p>
            </div>        

            {prevStudentResponse && feedback && 
                <div className="w-full border-2 border-green-500 mt-10 rounded-lg flex flex-col items-start justify-start p-5">
                    <p className="font-semibold text-sm md:text-lg">Previous question's answer</p>
                    <p className="w-full p-3 font-medium text-gray-700">
                        - {prevStudentResponse}
                    </p>

                    <p className="font-semibold text-sm md:text-lg mt-14">Feedback</p>
                    <p className={`w-full p-3 font-medium ${geminiResponse !== null ? 'text-gray-700' : 'text-red-500'}`}>
                        {feedback}
                    </p>

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
                                value={analysis?.overallScore! * 10}
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
                                <p>Overall Score</p>
                            </Box>
                        </Stack>
                    </div>
                </div>}

            {geminiResponse &&
                <div className="w-full p-3 flex flex-col mt-10 items-start justify-start">
                    <p className="text-sm md:text-lg w-full p-3 font-semibold text-gray-700">
                        Q. {geminiResponse}
                    </p>
                </div>}

            {geminiResponse !== null && !stopTest &&  
            <div className="w-[90%] flex flex-col items-start justify-start gap-10">
                <div className="flex items-center justify-center rounded-lg border-2 border-green-500 w-full mt-1 ml-5">
                    <input 
                        type="text"
                        value={studentResponse}
                        onChange={e => setStudentResponse(e.target.value)}
                        placeholder="Answer here"
                        onKeyDown={e => e.key === 'Enter' && handleStudentResponse()}
                        className="bg-transparent w-full outline-none px-5 py-3" />
                    <button onClick={handleStudentResponse} className="hover:opacity-80 px-8 transition-all py-3 rounded-r-lg hover:bg-gray-100"><i className="fa-solid fa-arrow-up"></i></button>
                </div>
                <button onClick={handleStopTest} className="font-semibold text-white px-5 py-3 text-xs md:text-sm bg-red-500 hover:bg-red-600 transition-all rounded-lg drop-shadow-lg">Stop the test</button>
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
                                    data: allAnalysis.map((analysis) => analysis.overallScore),
                                },
                            ]}
                            width={500}
                            height={300}
                        />
                        <div className="w-[50%] flex flex-col items-start justify-start gap-3">
                            <p className="font-semibold text-gray-700">Overall total score</p>
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
                            <p className="px-5 py-3 rounded-lg drop-shadow-lg text-xs md:text-sm font-medium bg-gray-200">{index + 1}. AI response: {allGeminiResponse[index]}</p>
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
                                      value={allAnalysis[index].overallScore * 10}
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
                                    <p className="text-xs md:text-sm">Overall Score</p>
                                </Box>
                            </Stack>
                        </div>      
                        </div>
                      )
                    })}
                  </div>}

            {loader1 && <div className="flex items-center justify-center w-full mt-16"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>}
        </div>}
        </div>
  )
}
