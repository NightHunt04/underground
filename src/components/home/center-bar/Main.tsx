// @ts-nocheck

import { useEffect, useState } from 'react'
import { useAppContext } from '../../../context/ContextProvider'
import IndividualSubjectAssign from './IndividualSubjectAssign'
import AiTutor from '../../tutor/AiTutor'
import Quiz from '../../quiz/Quiz'
import SyllabusQues from '../../syllabusQues/SyllabusQues'
import QuestionPaper from '../../quesPaper/QuestionPaper'
import Announcements from '../../announcements/Announcements'
import { subjectsApi } from '../../../api/subject'
import type { Subject } from '../../../api/subject'
import { useCookies } from 'react-cookie'
import { FolderClosed } from 'lucide-react'
import { chaptersApi } from '../../../api/chapter'
import { assignmentsApi } from '../../../api/assignment'

export default function Main() {
    const context = useAppContext() 
    const [cookie] = useCookies(['user']) 
    const [subjectId, setSubjectId] = useState<string>('')
    // Initialize with context data if available to prevent flash of empty state
    const [subjects, setSubjects] = useState<Subject[]>(context?.subjects || [])
    
    // Function to fetch subjects
    const fetchSubjects = async () => {
        if (!cookie.user) return
        try {
            const response = await subjectsApi.getSubjects({
                field: cookie.user.field,
                branch: cookie.user.branch,
                semester: cookie.user.semester
            })
            setSubjects(response.data)
            context?.setSubjects(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    const getAssignmentsForStudent = async (subjectId: string) => {
        try {
            const response = await assignmentsApi.getAssignmentBySubjectIdForStudent({
                subjectId,
                studentId: cookie.user?.id
            });

            if (response.success) {
                return response.data
            }
            return []
        } catch (error) {
            console.error("Failed to load assignments", error);
            return []
        }
    }

    const getChapters = async (subjectId: string) => {
        if (!subjectId) return []
        try {
            const response = await chaptersApi.getBySubjectId(subjectId)
            if (response.success) {
                return response.data
            } else {
                return []
            }
        } catch (error) {
            console.error("Failed to load chapters", error)
            return []
        }
    }

    // Fetch Subjects on Mount if empty
    useEffect(() => {
        if (subjects.length === 0) {
            fetchSubjects()
        }
    }, [cookie.user])

    // Fetch Student Data (Assignments & Chapters) whenever subjects are available
    // This ensures that even if we navigate back, this runs if context assignments are empty
    useEffect(() => {
        if (subjects.length === 0) return
        if (cookie.user?.role !== "student") return

        const loadStudentData = async () => {
            // Check if we already have data in context to avoid unnecessary network calls
            // if (context?.assignments && context.assignments.length > 0) return; 
            // Commented out above line to ensure we always get fresh status on re-mount (e.g. after submission)

            try {
                const [assignmentsArr, chaptersArr] = await Promise.all([
                    Promise.all(subjects.map(s => getAssignmentsForStudent(s._id))),
                    Promise.all(subjects.map(s => getChapters(s._id)))
                ])

                context?.setAssignments(assignmentsArr.flat())
                context?.setChapters(chaptersArr.flat())
            } catch (err) {
                console.error("Failed to load student data", err)
            }
        }

        loadStudentData()
    }, [subjects, cookie.user]) // Dependencies ensure this runs when subjects are loaded

  return (
    <div className='w-full flex flex-col items-start justify-start p-5 relative'>
        {context?.mainNav === 0 && !context?.showIndividualSubjectAssign &&
            <div className='w-full overflow-y-auto min-h-[96vh] flex flex-col items-start justify-start'>
                <h2 className='text-2xl md:text-3xl font-semibold'>Subjects</h2>
                <p className='font-medium text-gray-600'>Batch: <span className='font-normal'>{cookie.user?.branch}</span></p>
                <p className='px-4 py-2 rounded-md bg-[#cbffb8] font-bold '>Semester: {cookie.user?.semester}</p>

                <p className='mt-12 text-gray-600'>Below are all the subjects in your current batch</p>

                {subjects.length === 0 ? <p className="mt-5 text-gray-500">Loading subjects...</p> : 
                <div className='grid grid-cols-4 gap-7 items-start justify-center w-full mt-5'>
                    {subjects.map((sub, index: number) => {
                        return (
                            <div key={sub._id} onClick={() => {
                                setSubjectId(sub._id)
                                context?.setShowIndividualSubjectAssign(true)
                            }} className='hover:-translate-y-2 hover:drop-shadow-2xl hover:cursor-pointer hover:border-green-500 border-2 border-white transition-all duration-200 relative p-5 rounded-lg drop-shadow-lg w-full h-[300px] flex flex-col items-center justify-center bg-white'>
                                <FolderClosed className='w-[60px] h-[60px] text-green-500'/>
                                <p className='w-[90%] text-center font-semibold text-lg md:text-xl mt-6'>{sub.name}</p>
                                <p className='text-gray-700'>{sub.code}</p>
                            </div>
                        )
                    })}
                </div>}
            </div>}

        {/* Other Components */}
        {context?.mainNav === 2 && !context?.showIndividualSubjectAssign && <QuestionPaper />}
        {context?.mainNav === 3 && !context?.showIndividualSubjectAssign && <AiTutor />}
        {context?.mainNav === 4 && !context?.showIndividualSubjectAssign && <Quiz />}
        {context?.mainNav === 5 && !context.showIndividualSubjectAssign && <SyllabusQues />}
        {context?.mainNav === 7 && !context?.showIndividualSubjectAssign && <Announcements />}
        
        {context?.showIndividualSubjectAssign && <IndividualSubjectAssign subjectId={subjectId} />}
    </div>
  )
}