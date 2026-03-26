import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../context/ContextProvider'
import { assignmentsApi, StudentAssignment } from '../../../api/assignment'
import { useCookies } from 'react-cookie'

interface Props {
    subjectId: string
}

export default function IndividualSubjectAssign({ subjectId }: Props ) {
    const context = useAppContext()
    const navigate = useNavigate()
    const [cookies] = useCookies(['user'])
    const [showOptions, setShowOptions] = useState<number>(-1)   
    
    // State to store fetched submission data
    const [submissionContent, setSubmissionContent] = useState<string>('')
    const [loadingSubmission, setLoadingSubmission] = useState<boolean>(false)

    // Helper to check late status
    const isAssignmentLate = (assignment: StudentAssignment): boolean => {
        if (assignment.isCompleted) {
             // If completed, we rely on backend status 'late' or 'completed', 
             // but if we only have isCompleted boolean, we check dates if needed.
             // However, let's use the visual indicator based on current date if needed
             // or fetched submission status.
             return false; 
        }

        const dueDate = new Date(assignment.dueDate);
        const currentDate = new Date();
        dueDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        return currentDate > dueDate;
    }

    const handleExpand = async (index: number, assignment: StudentAssignment) => {
        if (showOptions === index) {
            setShowOptions(-1) // Close
            setSubmissionContent('')
            return
        }

        setShowOptions(index)
        
        // If assignment is completed, fetch submission details
        if (assignment.isCompleted) {
            setLoadingSubmission(true)
            setSubmissionContent('')
            try {
                const response = await assignmentsApi.getSubmission(cookies.user.id, assignment._id)
                if (response.success) {
                    setSubmissionContent(response.data.submissionData)
                }
            } catch (error) {
                console.error("Failed to fetch submission", error)
                setSubmissionContent("Error loading submission content.")
            } finally {
                setLoadingSubmission(false)
            }
        }
    }

    // Function to sanitize/format HTML if necessary, 
    // though dangerouslySetInnerHTML + CSS is usually enough for TipTap output.
    const renderSubmission = () => {
        if (loadingSubmission) return <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        
        // Determine if it's code (simple string) or HTML (starts with <)
        // This is a naive check, but effective for TipTap (<p>...) vs Code (import...)
        const isHtml = submissionContent.trim().startsWith('<');

        if (isHtml) {
            return (
                <div 
                    className="ProseMirror w-full border border-gray-200 p-4 rounded-md bg-gray-50 max-h-[400px] overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: submissionContent }}
                />
            )
        } else {
            return (
                <pre className="w-full border border-gray-200 p-4 rounded-md bg-[#1e1e1e] text-white font-mono text-sm max-h-[400px] overflow-y-auto whitespace-pre-wrap break-words">
                    {submissionContent}
                </pre>
            )
        }
    }

  return (
    <div className='w-full flex flex-col relative items-start justify-start p-5 h-full overflow-y-auto'>
        <button onClick={() => context?.setShowIndividualSubjectAssign(false)} className='px-5 py-2 font-medium hover:opacity-70 transition-all rounded-md bg-[#dadada] absolute top-0 left-0'><i className="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;Go back</button>
        
        <p className='font-medium mt-12'>Subject: <span className='font-semibold p-2 rounded-md bg-[#3fec0037]'>{context?.subjects?.find((subject) => subject._id === subjectId)?.name}</span></p>
        <p className='mt-5 text-gray-600'>Below are all the assigned assignments or practicals for this subject</p>

        <div className='flex flex-col w-full p-12 rounded-lg drop-shadow-lg mt-4 bg-white items-start justify-start'>
            {/* Status Legend */}
            <div className='flex flex-wrap items-center justify-center gap-6 mb-8 w-full border-b pb-4'>
                <div className='flex items-center gap-2'>
                    <div className='w-[20px] h-[10px] rounded-sm bg-[rgb(222,255,215)] border border-green-200'></div>
                    <p className='text-sm text-gray-600'>Completed</p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='w-[20px] h-[10px] rounded-sm bg-[#ffd7d7] border border-red-200'></div>
                    <p className='text-sm text-gray-600'>Incomplete</p>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='w-[20px] h-[10px] rounded-sm bg-yellow-100 border border-yellow-200'></div>
                    <p className='text-sm text-gray-600'>Late / Overdue</p>
                </div>
            </div>

            {context?.assignments?.map((assignment: StudentAssignment, index: number) => assignment.subject._id === subjectId &&  (
                <div key={index} className='flex flex-col items-start justify-start w-full'>
                    <div 
                        onClick={() => handleExpand(index, assignment)}
                        className={`hover:cursor-pointer hover:brightness-95 transition-all flex items-start justify-start relative px-6 py-4 mb-3 w-full rounded-md border 
                        ${assignment.isCompleted 
                            ? 'bg-[rgb(222,255,215)] border-green-200' 
                            : isAssignmentLate(assignment) 
                                ? 'bg-yellow-50 border-yellow-200' 
                                : 'bg-[#ffd7d7] border-red-200'
                        }`}
                    >
                        <p className='mr-3 font-semibold text-gray-700'>{index + 1}.</p>

                        <div className='flex flex-col items-start justify-start max-w-[70%]'>
                            <h3 className='font-semibold text-gray-800'>{assignment.title}</h3>
                            <p className='text-xs md:text-sm text-gray-600 mt-1 line-clamp-1'>
                                {assignment.description ? assignment.description.slice(0, 100) : ''}...
                            </p>
                        </div>

                        <div className="absolute right-5 flex flex-col items-end">
                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Due Date</p>
                            <p className={`text-sm font-medium ${isAssignmentLate(assignment) && !assignment.isCompleted ? 'text-red-600' : 'text-gray-700'}`}>
                                {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {showOptions === index &&
                        <div className='relative w-full flex flex-col items-start px-6 py-6 mb-6 border-[1px] border-gray-300 rounded-lg shadow-inner bg-gray-50'>
                            <button 
                                onClick={() => { setShowOptions(-1); setSubmissionContent(''); }} 
                                className='absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 transition-colors'
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>

                            <div className="mb-4 w-full">
                                <h4 className='font-bold text-gray-800 mb-1'>Problem Statement</h4>
                                <p className='text-gray-700 text-sm whitespace-pre-wrap bg-white p-3 rounded border border-gray-200'>
                                    {assignment.description}
                                </p>
                            </div>
                            
                            {!assignment.isCompleted ? (
                                <div className="w-full">
                                    <h4 className='font-bold text-gray-800 mb-2'>Submit via</h4>
                                    <div className='flex items-center gap-4'>
                                        <button 
                                            onClick={() => navigate(`doc/${assignment._id}`)}
                                            className='flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all shadow-sm'
                                        >
                                            <i className="fa-solid fa-file-word"></i> Document Editor
                                        </button>
                                        
                                        <button 
                                            onClick={() => {
                                                navigate(`code/${assignment._id}`)
                                                context?.setShowIndividualSubjectAssign(false)
                                            }} 
                                            className='flex items-center gap-2 px-5 py-2.5 rounded-md bg-gray-800 text-white font-medium hover:bg-gray-900 transition-all shadow-sm'
                                        >
                                            <i className="fa-solid fa-code"></i> Code Editor
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className='font-bold text-gray-800'>Your Submission</h4>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                                            Submitted on {assignment.completedAt ? new Date(assignment.completedAt).toLocaleString() : 'N/A'}
                                        </span>
                                    </div>
                                    
                                    {/* Render the submission content */}
                                    {renderSubmission()}
                                </div>
                            )}
                        </div>
                    }
                </div>
            ))}
        </div>
    </div>
  )
}