import { useState } from 'react'
import { useAppContext } from '../../../context/ContextProvider'
import IndividualSubjectAssign from './IndividualSubjectAssign'
import AiTutor from '../../tutor/AiTutor'
import Quiz from '../../quiz/Quiz'
import { SUBJECTS, ASSIGNMENTS } from '../../../CONSTANTS/CONSTANTS'
import SyllabusQues from '../../syllabusQues/SyllabusQues'
import QuestionPaper from '../../quesPaper/QuestionPaper'

export default function Main() {
    const context = useAppContext()
    const [subjectIndex, setSubjectIndex] = useState<number>(-1)

    

  return (
    <div className='w-[80vw] flex flex-col items-start justify-start p-5 relative'>
        {context?.mainNav === 0 && !context?.showIndividualSubjectAssign &&
            <div className='w-full overflow-y-auto min-h-[96vh] flex flex-col items-start justify-start'>
                <h2 className='text-2xl md:text-3xl font-semibold'>Subjects</h2>
                <p className='font-medium text-gray-600'>Batch: <span className='font-normal'>Computer Engineering</span></p>
                <p className='px-4 py-2 rounded-md bg-[#cbffb8] font-bold '>Semester 5</p>

                <p className='mt-12 text-gray-600'>Below are all the subjects in your current batch</p>

                <div className='grid grid-cols-4 gap-7 items-start justify-center w-full mt-5'>
                    {SUBJECTS.map((sub, index: number) => {
                        return (
                            <div key={index} onClick={() => {
                                setSubjectIndex(index)
                                context?.setShowIndividualSubjectAssign(true)
                            }} className='hover:-translate-y-2 hover:drop-shadow-2xl hover:cursor-pointer hover:border-green-500 border-2 border-white transition-all duration-200 relative p-5 rounded-lg drop-shadow-lg w-full h-[300px] flex flex-col items-center justify-center bg-white'>
                                <img src={sub.image} className='w-[100px] h-[100px] rounded-md object-cover drop-shadow-lg'/>
                                <p className='w-[90%] text-center font-semibold text-lg md:text-xl mt-6'>{sub.name}</p>
                                <p className='text-gray-700'>{sub.code}</p>
                            </div>
                        )
                    })}
                </div>
            </div>}

        {/* question paper */}
        {/* {context?.mainNav === 2 && !context?.showIndividualSubjectAssign && <QuestionPaper />} */}

        {/* ai tutor */}
        {/* {context?.mainNav === 3 && !context?.showIndividualSubjectAssign && <AiTutor />} */}

        {/* ai quiz */}
        {/* {context?.mainNav === 4 && !context?.showIndividualSubjectAssign && <Quiz />} */}

        {/* gen syllabus ques */}
        {/* {context?.mainNav === 5 && !context.showIndividualSubjectAssign && <SyllabusQues />} */}

        {context?.showIndividualSubjectAssign && <IndividualSubjectAssign assignments={ASSIGNMENTS[subjectIndex]} />}
    </div>
  )
}
