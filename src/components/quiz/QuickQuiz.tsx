import AssignmentList from "./AssignmentList"
import fetchQuizQuestionsGemini from "../../utils/fetchQuizQuestionsGemini"
// import SyntaxHighlighter from 'react-syntax-highlighter'
// import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { SUBJECTS, ASSIGNMENTS } from '../../CONSTANTS/CONSTANTS'
import { useState } from "react";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


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

interface Props {
    selectSubjectIndex: number,
    setSelectSubjectIndex: React.Dispatch<React.SetStateAction<number>>

    selectTempSubjectIndex: number,
    setSelectTempSubjectIndex: React.Dispatch<React.SetStateAction<number>>

    selectSubjectAssignmentIndex: number,
    setSelectSubjectAssignmentIndex: React.Dispatch<React.SetStateAction<number>>

    quizProblems: Response | string
    setQuizProblems: React.Dispatch<React.SetStateAction<Response | string>>

    codeProblems: ResponseCode | string
    setCodeProblems: React.Dispatch<React.SetStateAction<ResponseCode | string>>

    loader: boolean
    setLoader: React.Dispatch<React.SetStateAction<boolean>>

    loader1: boolean
    setLoader1: React.Dispatch<React.SetStateAction<boolean>>
}

export default function QuickQuiz ({ selectSubjectAssignmentIndex, selectSubjectIndex, selectTempSubjectIndex, setLoader, loader, quizProblems, setQuizProblems, setSelectSubjectAssignmentIndex, setSelectSubjectIndex, setSelectTempSubjectIndex, loader1, setLoader1, codeProblems, setCodeProblems }: Props) {
    const [selectLang, setSelectLang] = useState<boolean>(false)
    const [selectedLang, setSelectedLang] = useState<string>('Select Language')

    const LANGUAGES = ['C', 'Cpp', 'Python', 'Java', 'Javascript', 'Csharp']

    const handleGenerateQuiz = async (practical: boolean) => {
        if (!practical)
            setLoader(true)
        else setLoader1(true)

        const title = ASSIGNMENTS[selectSubjectIndex].assignments[selectSubjectAssignmentIndex].title
        const statement = ASSIGNMENTS[selectSubjectIndex].assignments[selectSubjectAssignmentIndex].statement
        
        let lang = ASSIGNMENTS[selectSubjectIndex].lang !== 'any' ? ASSIGNMENTS[selectSubjectIndex].lang : selectedLang 

        if (title && statement) {
            // let response = await fetchQuizQuestions(title, statement)
            let response

            while (1) {
                response = await fetchQuizQuestionsGemini(title, statement, practical, lang)

                console.log('res', response)

                try {
                    console.log(JSON.parse(response))
                    response = JSON.parse(response)

                    break
                } catch(err) {
                    continue
                }
            }

            if (response !== 'error' && !practical)
                setQuizProblems(response)

            else if (response !== 'error' && practical)
                setCodeProblems(response)

            if (!practical)
                setLoader(false)
            else setLoader1(false)

            setSelectedLang('Select Language')
        }
    }

    function formatResponse(input: string): string {
        let formatted = input.replace(/\*\*Example:\*\*/, 'Example');
      
        const lines = formatted.split('\n');
      
        const exampleIndex = lines.findIndex(line => line.trim().startsWith('Example'));
      
        if (exampleIndex !== -1) {
          lines.splice(exampleIndex, 0, '');
      
          lines[exampleIndex + 1] = 'Example';
      
          lines.splice(exampleIndex + 2, 0, '');
        }
      
        return lines.join('\n');
      }

    function extractCodeAndLanguage(input: string): { code: string; language: string | null } {
        const regex = /'''(\w+)?\s*([\s\S]*?)'''/
        const regex2 = /```(\w+)?\s*([\s\S]*?)```/

        let match = input.match(regex)
        
        if (match) {
            const language = match[1] || null;
            const code = match[2].trim();
            console.log('code', code)
            return { code, language };
        } else if (input.match(regex2)) {

            match = input.match(regex2)

            const language = match![1] || null;
            const code = match![2].trim();
            console.log('code', code)
            return { code, language };
        }
        
        return { code: input.trim(), language: null };
    }

  return (
    <div className="mt-10 flex flex-col items-start justify-start p-4 rounded-lg drop-shadow-lg bg-white w-[70%]">
            <div className='font-semibold gap-3 flex items-center justify-start'>
                <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>1</div>
                <p className='text-lg md:text-xl'>Select the assignment of the subject you want to generate questions for</p>
            </div>

            <p className="text-md mt-10 md:text-lg font-semibold text-gray-800">Generate a quick <span className="text-green-700">theoretical/practical</span> questions from the <span className="text-red-700">given assignments</span></p>
            <p className="text-sm text-gray-700">Select the subject in which you want to take a quiz of assignment</p>

            <div className="flex flex-col items-start justify-start gap-3 w-full mt-10">

                {/* show all the subject button */}
                {SUBJECTS.map((sub, index: number) => {
                    return (
                        <div key={index} onClick={() => {
                            if (selectTempSubjectIndex !== index) {
                                setSelectTempSubjectIndex(index)
                                setSelectSubjectIndex(index)

                                setSelectSubjectAssignmentIndex(-1)
                            }
                            else if (selectTempSubjectIndex === index && selectTempSubjectIndex !== -1){
                                // setSelectSubjectIndex(-1)
                                setSelectTempSubjectIndex(-1)
                            }
                        }} className="flex flex-col items-start justify-start w-full">
                            <div className={`${selectSubjectIndex === index ? 'border-green-500 bg-green-200 -translate-y-1 drop-shadow-lg' : 'border-green-100'} hover:-translate-y-1 hover:shadow-lg hover:border-green-500 border-2 transition-all duration-200 w-full flex items-center justify-between text-left px-5 py-3 rounded-md bg-green-100 hover:cursor-pointer`}>
                                <p className="text-xs md:text-sm font-medium">{sub.name} {sub.code}</p>
                                <i className="fa-solid text-gray-700 fa-arrow-right-long"></i>
                            </div>

                            {/* show all the assignments below the button of subject */}
                            {selectTempSubjectIndex === index && 
                                <AssignmentList assignments={ASSIGNMENTS[index]} setSelectSubjectAssignmentIndex={setSelectSubjectAssignmentIndex} setSelectTempSubjectIndex={setSelectTempSubjectIndex}/>}
                        </div>
                    )
                })}

                {/*  once the subject is selected */}
                {selectSubjectAssignmentIndex !== -1 && 
                    <div className="relative px-4 py-3 mt-16 border-2 border-green-500 rounded-lg flex flex-col items-start justify-start w-full">
                        <div className='font-semibold gap-3 flex items-center justify-start'>
                        <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>2</div>
                        <p className='text-lg md:text-xl'>Select the generation type</p>
                    </div>

                        <button onClick={() => {
                            setSelectSubjectIndex(-1)
                            setSelectTempSubjectIndex(-1)
                            setSelectSubjectAssignmentIndex(-1)
                        }} className="px-3 py-2 text-xs md:text-sm bg-red-500 text-white font-semibold rounded-md absolute right-3 top-3 drop-shadow-md hover:opacity-80 transition-all">Cancel</button>

                        <p className="text-sm mt-10 text-green-600">Assignment selected for quick quiz</p>
                        <p className="mt-2 font-semibold text-lg md:text-xl">Title: {ASSIGNMENTS[selectSubjectIndex].assignments[selectSubjectAssignmentIndex]?.title}</p>
                        <p className="text-gray-700 font-medium">Statement: {ASSIGNMENTS[selectSubjectIndex].assignments[selectSubjectAssignmentIndex]?.statement}</p>

                        <div className={`flex ${ASSIGNMENTS[selectSubjectIndex].lang === 'any' ? 'flex-col gap-1' : 'flex-row gap-5'} mt-10 items-start justify-center`}>
                            <button disabled={loader || loader1} onClick={() => handleGenerateQuiz(false)} className="text-xs md:text-sm px-5 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-500 hover:drop-shadow-lg transition-all drop-shadow-md border-2 border-green-600">
                                {loader ?                   
                                    <div className="flex items-center justify-center">      
                                        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                                        <p className="ml-3">Generating</p>
                                    </div>:
                                    <p>Generate quick quiz</p>}
                            </button>

                            {ASSIGNMENTS[selectSubjectIndex].lang === 'any' &&
                                <div className="flex flex-col items-start justify-start mt-7 mb-1 hover:opacity-80 transition-all">
                                    <p className="text-xs md:text-sm text-gray-600 mb-1">This subject allows to perform program in your own selective programming language, select the language in which you want to generate programming questions</p>
                                    <button onClick={() => setSelectLang(prev => !prev)} className="text-xs md:text-sm px-5 py-3 rounded-md bg-gray-200 drop-shadow-md">{selectedLang}</button>

                                    {selectLang && <div className="ml-2 flex flex-col items-center justify-center">
                                        {LANGUAGES.map(lang => {
                                            return (
                                                <button onClick={() => {
                                                    setSelectedLang(lang)
                                                    setSelectLang(false)
                                                }} className="text-xs md:text-sm rounded-md px-3 py-2 mt-1 bg-gray-100 w-full">{lang}</button>
                                            )
                                        })}
                                    </div>}
                                </div>}

                            <button disabled={loader || loader1} onClick={() => handleGenerateQuiz(true)} className="text-xs md:text-sm px-5 py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-500 hover:drop-shadow-lg transition-all drop-shadow-md border-2 border-green-600">
                                {loader1 ?                   
                                    <div className="flex items-center justify-center">      
                                        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                                        <p className="ml-3">Generating</p>
                                    </div>:
                                    <p>Generate practical questions</p>}
                            </button>
                        </div>
                    </div>}


                {/* generated quiz problems */}
                {quizProblems && quizProblems !== '' && 
                    <div className="mt-16 flex flex-col items-start justify-start p-3 w-full">

                        <div className='font-semibold gap-3 flex items-center justify-start'>
                            <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>3</div>
                            <p className='text-lg md:text-xl'>Successfully generated questions 🎉</p>
                        </div>

                        <div className="mt-10 flex items-start justify-between w-full">
                            <p className="text-xl font-semibold text-gray-700">Generated quiz</p>
                            <button onClick={() => setQuizProblems('')} className="px-4 py-2 text-xs md:text-sm rounded-md bg-red-500 text-white hover:bg-red-700 font-semibold mb-2 transition-all">Close</button>
                        </div>

                        {/* iterate over all the questions and options */}
                        {quizProblems && typeof quizProblems !== 'string' && quizProblems!.response.map((res, index: number) => {
                            return (
                                <div key={index} className="flex flex-col items-start justify-start p-3 rounded-lg border-2 border-gray-300 mb-3 w-full">
                                    <p className="font-medium">Q.{index + 1}&nbsp; {res.question}</p>

                                    {res.options.map((opt, index: number) => {
                                        return (
                                            <button className="p-2 text-xs md:text-sm font-medium">{index + 1}. {opt}</button>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>}

                {codeProblems && codeProblems !== '' &&
                    <div className="mt-16 flex flex-col items-start justify-start p-3 w-full">
                        <div className='font-semibold gap-3 flex items-center justify-start'>
                            <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>3</div>
                            <p className='text-lg md:text-xl'>Successfully generated questions 🎉</p>
                        </div>

                        <div className="mt-10 flex items-start justify-between w-full">
                            <p className="text-xl font-semibold text-gray-700">Generated questions</p>
                            <button onClick={() => setCodeProblems('')} className="px-4 py-2 text-xs md:text-sm rounded-md bg-red-500 text-white hover:bg-red-700 font-semibold mb-2 transition-all">Close</button>
                        </div>

                        {/* iterate over all the questions and code */}
                        {codeProblems && typeof codeProblems !== 'string' && codeProblems!.response.map((res, index: number) => {
                            const { code, language } = extractCodeAndLanguage(res.code)

                            return (
                                <div key={index} className="flex flex-col items-start justify-start p-4 rounded-lg border-2 border-gray-300 mb-3 w-full">
                                    <pre className="max-w-full whitespace-pre-wrap break-words font-medium font-inter overflow-x-auto">
                                        Q.{index + 1}&nbsp; {formatResponse(res.question)}
                                    </pre>

                                    <div className="w-full mt-5 rounded-lg">
                                        <SyntaxHighlighter className="rounded-md" language={language!} style={vscDarkPlus}>
                                            { code }
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
            </div>
        </div>
  )
}
