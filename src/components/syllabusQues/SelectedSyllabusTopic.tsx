import { useState } from 'react'
import { SUBJECTS_INFO } from '../../CONSTANTS/CONSTANTS'
import fetchSyllabusQues from '../../utils/fetchSyllabusQues'

interface Props {
    selectSubjectIndex: number
    selectSubjectTopicIndex: number
    setSelectSubjectTopicIndex: React.Dispatch<React.SetStateAction<number>>
}

interface MCQResponse {
    response: {
        question: string,
        options: string[],
        correct: string
    }[]
}

interface BriefQuesResponse {
    response: {
        question: string,
        answer: string
    }[]
}

export default function SelectedSyllabusTopic({ selectSubjectIndex, selectSubjectTopicIndex, setSelectSubjectTopicIndex }: Props) {
    const [selectedTopics, setSelectedTopics] = useState<number[]>([])
    const [loader, setLoader] = useState<boolean>(false)
    const [mcqData, setMcqData] = useState<MCQResponse | undefined | string>()
    const [briefQuesData, setBriefQuesData] = useState<BriefQuesResponse | undefined | string>()

    const handleSelectTopic = (ind: number) => {
        if (selectedTopics.includes(ind))
            setSelectedTopics(prev => prev.filter(topicInd => topicInd !== ind))
        else setSelectedTopics(prev => [...prev, ind])
    }

    const handleGenerateMCQ = async (isBrief: boolean): Promise<void> => {
        setLoader(true)
        let topicsToBeCovered: string[] = []

        if (selectedTopics.length === 0) {
            if (SUBJECTS_INFO[selectSubjectIndex].syllabus) {
                SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].content.map(topic => topicsToBeCovered.push(topic))
            }
        }


        if (SUBJECTS_INFO[selectSubjectIndex] && SUBJECTS_INFO[selectSubjectIndex].syllabus) {
            selectedTopics.forEach(topicInd => {
                if (SUBJECTS_INFO[selectSubjectIndex].syllabus)
                topicsToBeCovered.push(SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].content[topicInd])
            })

            console.log('selected', topicsToBeCovered)

            while (1) {
                let response = await fetchSyllabusQues(SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].title, topicsToBeCovered, isBrief)

                try {
                    response = JSON.parse(response)

                    if (!isBrief) {
                        if (typeof response !== 'string')
                            setMcqData(response)
                    } else {
                        if (typeof response !== 'string')
                            setBriefQuesData(response)
                    }

                    break
                } catch(err) {
                    console.error(err)
                }
            }
        }

        setLoader(false)
    }

  return (
    <div className='relative mt-5 flex flex-col items-start justify-start w-[80%] bg-white drop-shadow-lg rounded-lg p-5 gap-2'>
        <button onClick={() => { setSelectSubjectTopicIndex(-1) }} className="px-3 py-2 text-xs md:text-sm bg-red-500 text-white font-semibold rounded-md absolute right-3 top-3 drop-shadow-md hover:opacity-80 transition-all">Cancel</button>

        <p className='font-semibold'>Selected topic</p>
        <p className='font-sm text-gray-700'>Subject name: <span className='p-1 bg-green-100 font-semibold rounded-md'>{SUBJECTS_INFO[selectSubjectIndex].name}</span></p>

        <div className='font-semibold mt-10 gap-3 flex items-center justify-start'>
            <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>2</div>
            <p className='text-lg md:text-xl'>Select the topics of which you want to generate questions for</p>
        </div>

        <p className='mt-10 font-semibold text-xl'>Title: {SUBJECTS_INFO[selectSubjectIndex].syllabus && SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].title}</p>
        <p className='text-xs md:text-sm text-gray-600'>Select topics from below of which you want to generate questions about</p>

        <p className='text-xs md:text-sm font-medium'><span className='text-red-500'>Note: </span>If you won't select any topic and click on generate button, then by default all the topics will get selected</p>

        {/* topics of the selected chapter */}
        <div className='flex flex-col ietms-start justify-start p-2'>
            {SUBJECTS_INFO[selectSubjectIndex].syllabus && SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].content.map((item, index: number) => {
                return (
                    <button onClick={() => handleSelectTopic(index)} key={index} className={`${selectedTopics.includes(index) ? 'bg-green-100 border-green-500 hover:bg-green-200' : 'bg-blue-100 border-blue-500 hover:bg-blue-200'} border-2 text-gray-700 transition-all text-xs md:text-sm font-medium w-full text-left mb-2 p-2 rounded-md`}>{item}</button>
                )
            })}
        </div>

        {/* generate button */}
        <div className='font-semibold mt-14 gap-3 flex items-center justify-start'>
            <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>3</div>
            <p className='text-lg md:text-xl'>Select the type of generation you want</p>
        </div>

        <p className='mt-7 font-medium'>These includes <span className='text-red-600'>two</span> types of generation, MCQs and one theoretical brief questions</p>
        <p className='text-xs md:text-sm text-gray-600'>MCQs generation: 15 MCQs will be generated</p>
        <p className='text-xs md:text-sm text-gray-600'>Brief questions generation: 10 breif questions will be generated</p>

        {/* generate buttons */}
        <div className='flex items-center justify-center gap-5'>
            <button disabled={loader} onClick={() => handleGenerateMCQ(false)} className='mt-3 px-5 py-3 text-sm hover:bg-green-400 transition-all text-white bg-green-500 drop-shadow-lg rounded-lg font-semibold'>Generate MCQs</button>
            <button disabled={loader} onClick={() => handleGenerateMCQ(true)} className='mt-3 px-5 py-3 text-sm hover:bg-green-400 transition-all text-white bg-green-500 drop-shadow-lg rounded-lg font-semibold'>Generate Brief Questions</button>
        </div>

        {loader && <div className='w-full flex items-center justify-center mt-10'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>}

        {mcqData && 
            <div className='relative flex flex-col items-start justify-start w-full mt-14'>
                <button onClick={() => { 
                    setMcqData('')
                 }} className="px-3 py-2 text-xs md:text-sm bg-red-500 text-white font-semibold rounded-md absolute right-3 top-3 drop-shadow-md hover:opacity-80 transition-all">Clear</button>

                <div className='font-semibold mt-14 gap-3 flex items-center justify-start'>
                    <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>4</div>
                    <p className='text-lg md:text-xl'>Successfully generated 🎉</p>
                </div>

                <p className='text-gray-600 font-medium mt-7 p-2'>Generated MCQs</p>

                <div className='w-full flex flex-col items-start justify-start mt-6'>
                    {typeof mcqData !== 'string' && mcqData.response.map((mcq, index: number) => {
                        return (
                            <div className='flex flex-col items-start justify-start p-2 w-full mb-5'>
                                <p className='font-semibold'>Q. {index + 1} {mcq.question}</p>

                                {mcq.options.map((option, ind: number) => {
                                    return (
                                        <p className='w-full mt-3 p-3 rounded-md bg-gray-100 drop-shadow-lg text-xs md:text-sm font-medium'>{ind + 1}. {option}</p>
                                    )
                                })}

                                <p className='mt-4 font-semibold'>Correct: <span className='text-green-600'>{mcq.correct}</span></p>
                            </div>
                        )
                    })}
                </div>
            </div>}

        {briefQuesData && 
            <div className='relative flex flex-col items-start justify-start w-full mt-14'>
                <button onClick={() => { 
                    setBriefQuesData('')
                 }} className="px-3 py-2 text-xs md:text-sm bg-red-500 text-white font-semibold rounded-md absolute right-3 top-3 drop-shadow-md hover:opacity-80 transition-all">Clear</button>

                <div className='font-semibold mt-14 gap-3 flex items-center justify-start'>
                    <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>4</div>
                    <p className='text-lg md:text-xl'>Successfully generated 🎉</p>
                </div>

                <p className='text-gray-600 font-medium mt-7 p-2'>Generated BriefQuestions</p>

                <div className='w-full flex flex-col items-start justify-start mt-6'>
                    {typeof briefQuesData !== 'string' && briefQuesData?.response.map((ques, index: number) => {
                        return (
                            <div className='p-2 flex flex-col items-start justify-start w-full mb-5'>
                                <p className='font-semibold w-full'>Q. {index + 1} {ques.question}</p>
                                <p className='mt-2 p-3 rounded-lg w-full bg-green-100 border-2 border-green-500'>{ques.answer}</p>
                            </div>
                        )
                    })}
                </div>
            </div>}
    </div>
  )
}
