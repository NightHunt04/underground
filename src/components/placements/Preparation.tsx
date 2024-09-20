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

export default function Preparation() {
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

    const [stopTest, setStopTest] = useState<boolean>(false)

    const handleSelectRole = async (): Promise<void> => {
        setLoader(true)
        setFeedback('')
        setPrevStudentResponse('')
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
        // setStudentResponses(prev => [...prev, studentResponse])

        // console.log(studentResponse, geminiResponses[geminiResponses.length - 1])
        setPrevStudentResponse(studentResponse)

        let response 

        // while (1) {
            response = await fetchMockInterview(studentResponse, geminiResponse, role, skills, nounce)

            try {
                response = JSON.parse(response)
                // break
            } catch(err) {
                console.error(err)
            }

        // }
        console.log('here', response)

        setFeedback(response.feedback)
        setGeminiResponse(response.nextQuestion)
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
    <div className="mt-5 w-[80%] rounded-lg flex flex-col gap-5 items-start justify-start mb-36">
        <div className="flex flex-col items-start justify-start p-5 bg-white drop-shadow-lg rounded-lg w-full">
            <div className='font-semibold gap-3 flex items-center justify-start'>
                <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>1</div>
                <p className='text-lg md:text-xl'>Select the type of test you would like to have</p>
            </div>

            <div className="mt-12 flex items-center justify-between w-full p-5">
                <div onClick={() => {
                    setIsMockInterview(true)
                    setRole('')
                    setSkills('')
                    setGeminiResponse('')
                    setStudentResponse('')
                    setNounce(0)
                    setFeedback('')
                    setPrevStudentResponse('')
                    setConfirmedRole('')
                    navigate('theoretical-test')
                }} className="hover:cursor-pointer hover:bg-gray-100 py-10 rounded-xl transition-all flex flex-col items-center justify-center w-full">
                    <i className="text-4xl fa-solid fa-clipboard-question text-gray-800"></i>
                    <p className="font-semibold text-lg md:text-xl">Theoretical Interview Test</p>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Includes giving answers by typing</p>
                </div>

                <div onClick={() => {
                    setIsMockInterview(true)
                    setRole('')
                    setSkills('')
                    setGeminiResponse('')
                    setStudentResponse('')
                    setNounce(0)
                    setFeedback('')
                    setPrevStudentResponse('')
                    setConfirmedRole('')
                    navigate('machine-coding')}} className="hover:cursor-pointer hover:bg-gray-100 py-10 rounded-xl transition-all flex flex-col items-center justify-center w-full">
                    <i className="text-4xl fa-solid fa-code text-gray-800"></i>
                    <p className="font-semibold text-lg md:text-xl">Machine Coding Test</p>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Includes machine coding round</p>
                </div>

                <div onClick={() => {
                    setIsMockInterview(false)
                    setRole('')
                    setSkills('')
                    setGeminiResponse('')
                    setStudentResponse('')
                    setNounce(0)
                    setFeedback('')
                    setPrevStudentResponse('')
                    setConfirmedRole('')
                    navigate('speech-test')
                }} className="hover:cursor-pointer hover:bg-gray-100 py-10 rounded-xl transition-all flex flex-col items-center justify-center w-full">
                    <i className="text-4xl fa-solid fa-microphone text-gray-800"></i>
                    <p className="font-semibold text-lg md:text-xl">Speech Interview Test</p>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">Includes interview in speech</p>
                </div>
            </div>
        </div>

        <Outlet />


        
    </div>
  )
}