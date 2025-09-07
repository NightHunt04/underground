import { useState } from "react"
import QuickQuiz from "./QuickQuiz"

interface Response {
    response: {
            question: string,
            options: string[],
            correct: string,
        }[]
}

interface ResponseCode {
    response: {
        code: string,
        question: string
    }[]
}

export default function Quiz() {
    const [selectSubjectIndex, setSelectSubjectIndex] = useState<number>(-1)
    const [selectTempSubjectIndex, setSelectTempSubjectIndex] = useState<number>(-1)
    const [selectSubjectAssignmentIndex, setSelectSubjectAssignmentIndex] = useState<number>(-1)
    const [loader, setLoader] = useState<boolean>(false)
    const [loader1, setLoader1] = useState<boolean>(false)

    const [quizProblems, setQuizProblems] = useState<Response | string>('')
    const [codeProblems, setCodeProblems] = useState<ResponseCode | string>('')

  return (
    <div className='w-[80vw] overflow-y-auto p-4 flex flex-col items-start justify-start'>
        <p className="text-xl md:text-3xl font-semibold">AI Questions</p>
        <p className="text-gray-700">Take a quick quiz from the allocated assignments or related to it using AI</p>

        <QuickQuiz 
            selectSubjectAssignmentIndex={selectSubjectAssignmentIndex} 
            selectSubjectIndex={selectSubjectIndex} 
            selectTempSubjectIndex={selectTempSubjectIndex} 
            loader={loader}
            quizProblems={quizProblems}
            setLoader={setLoader}
            setSelectSubjectAssignmentIndex={setSelectSubjectAssignmentIndex}
            setQuizProblems={setQuizProblems}
            setSelectSubjectIndex={setSelectSubjectIndex}
            setSelectTempSubjectIndex={setSelectTempSubjectIndex}
            loader1={loader1}
            setLoader1={setLoader1}
            codeProblems={codeProblems}
            setCodeProblems={setCodeProblems}/>
    </div>
  )
}
