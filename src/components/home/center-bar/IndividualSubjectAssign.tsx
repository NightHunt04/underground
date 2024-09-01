import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../context/ContextProvider'

interface Assignment {
    id: string
    title: string
    statement: string
    receivedDate: string
}

interface SubjectAssignment {
    subject: string
    code: string
    assignments: Assignment[]
}

interface Props {
    assignments: SubjectAssignment,
}

export default function IndividualSubjectAssign({ assignments }: Props ) {
    const context = useAppContext()
    const navigate = useNavigate()
    const COMPLETED = [true, true, true, true, false, false, false]
    const [showOptions, setShowOptions] = useState<number>(-1)   

  return (
    <div className='w-full flex flex-col relative items-start justify-start p-5 h-screen overflow-y-auto'>
        <button onClick={() => context?.setShowIndividualSubjectAssign(false)} className='px-5 py-2 font-medium hover:opacity-70 transition-all rounded-md bg-[#dadada] absolute top-0 left-0'><i className="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;Go back</button>
        
        <p className='font-medium mt-12'>Subject: <span className='font-semibold p-2 rounded-md bg-[#3fec0037]'>{assignments.subject} ({assignments.code})</span></p>
        <p className='mt-5 text-gray-600'>Below are all the assigned assignments or practicals for this subject</p>

        <div className='flex flex-col w-full p-12 rounded-lg drop-shadow-lg mt-4 bg-white items-start justify-start'>
            <div className='flex flex-col items-center justify-center mb-5'>
                <div className='flex items-center justify-center gap-2'>
                    <div className='w-[20px] h-[10px] p-1 rounded-sm bg-green-200'></div>
                    <p className='text-xs md:text-sm text-gray-600'>Completed</p>
                </div>

                <div className='flex items-center justify-center gap-2'>
                    <div className='w-[20px] h-[10px] p-1 rounded-sm bg-red-200'></div>
                    <p className='text-xs md:text-sm text-gray-600'>Incomplete</p>
                </div>
            </div>

            {assignments.assignments.map((assignment: Assignment, index: number) => {
                return (
                    <div key={index} className='flex flex-col items-start justify-start w-full'>
                        <div onClick={() => {
                        console.log(showOptions)
                        setShowOptions(index)
                    }}  className={`hover:cursor-pointer hover:opacity-80 transition-all flex items-start justify-start relative px-6 py-4 mb-3 w-full rounded-md ${COMPLETED[index] ? 'bg-[rgb(222,255,215)]' : 'bg-[#ffd7d7]'}`}>
                            <p className='mr-3 text-gray-600'>{index}</p>

                            <div className='flex flex-col items-start justify-start'>
                                <h3 className='font-medium'>{assignment.title}</h3>
                                <p className='text-xs md:text-sm text-gray-600'>{assignment.statement.slice(0, 80)}...</p>
                            </div>

                            <p className='absolute right-5 text-xs md:text-sm text-gray-600'>{assignment.receivedDate}</p>
                        </div>

                        {showOptions === index &&
                            <div className='relative w-full flex flex-col items-start justify-between px-6 py-4 mb-3 border-[1px] border-gray-300 rounded-lg drop-shadow-lg'>
                                <p className='font-semibold text-xs md:text-sm mb-3'>Assignment number: {index}</p>
                                <p className='font-semibold'>Problem statement</p>
                                <p className='text-gray-600 text-xs md:text-sm mb-5'>{assignment.statement}</p>

                                <p className='font-semibold'>Tools</p>
                                <div className='flex items-center justify-center mt-3 text-xs md:text-sm text-gray-800 gap-5'>
                                    <button className='flex items-center justify-center gap-3 px-4 py-2 rounded-md hover:-translate-y-1 transition-all duration-200 bg-blue-100'><i className="fa-solid fa-file"></i>Document</button>
                                    <button onClick={() => {
                                        navigate(`code/${assignment.id}`)
                                        context?.setShowIndividualSubjectAssign(false)}} className='flex items-center justify-center gap-3 px-4 py-2 hover:-translate-y-1 transition-all duration-200 rounded-md bg-blue-100'><i className="fa-solid fa-code"></i>Code</button>
                                </div>

                                <button onClick={() => setShowOptions(-1)} className='flex items-center justify-center w-[25px] h-[25px] rounded-full bg-red-500 text-white absolute top-5 right-5 z-20 hover:bg-red-700 drop-shadow-md'>x</button>
                            </div>}
                    </div>
                )
            })}
        </div>
    </div>
  )
}
