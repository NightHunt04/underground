import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../context/ContextProvider'

export default function SideNavBar() {
  const navigate = useNavigate()
    const context = useAppContext()

    const STUDENT_INFO = {
      name: 'Nemishkumar Bhuva',
      enroll: '22SE02CE003',
      branch: 'Computer Engineering'
    }

  return (
    <div className='sticky top-3 left-0 flex flex-col min-h-[96vh] items-center justify-start p-5 rounded-lg bg-white drop-shadow-lg w-[20vw]'>
        <img src="/assets/logo.jpg" alt="logo" className='w-[100px] h-auto object-cover my-10' />

        <div className='flex items-start justify-center w-full gap-2 pb-10'>
          <img src="/assets/nemish.webp" alt="student" className='w-[40%] h-auto rounded-md' />
          
          <div className='flex flex-col items-start text-xs md:text-sm justify-start'>
            <p className='font-semibold'>{STUDENT_INFO.name}</p>
            <p className='font-medium mt-1 p-1 rounded-md bg-blue-100'>{STUDENT_INFO.enroll}</p>
            <p className='text-gray-700 mt-1'>{STUDENT_INFO.branch}</p>
          </div>
        </div>

        {/* <p className='px-1 font-semibold text-md md:text-lg mt-4 w-full text-left px-10 border-y-[0.5px] pb-3 border-gray-300 pt-12'><i className="fa-solid fa-route"></i>&nbsp;&nbsp;Navigation</p> */}
        <div className='flex flex-col items-start justify-start w-full pt-10 border-t-[1px] border-gray-300 mb-10 font-semibold'>
            <button onClick={() => {
              context?.setMainNav(0)
              context?.setShowIndividualSubjectAssign(false)
              navigate('subjects')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 0 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-folder text-gray-800"></i>&nbsp;&nbsp;Subjects</button>

            <button onClick={() => {
              context?.setMainNav(1)
              context?.setShowIndividualSubjectAssign(false)
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 1 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} mt-2 hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-file text-gray-800"></i>&nbsp;&nbsp;Syllabus</button>

            {/* <button onClick={() => {
              context?.setMainNav(2)
              context?.setShowIndividualSubjectAssign(false)
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 2 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} mt-2 hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-square-check text-green-800"></i>&nbsp;&nbsp;Submitted</button>

            <button onClick={() => {
              context?.setMainNav(3)
              context?.setShowIndividualSubjectAssign(false)
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 3 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} mt-2 hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-file-excel text-red-900"></i>&nbsp;&nbsp;Incomplete</button> */}

            <button onClick={() => {
              context?.setMainNav(2)
              context?.setShowIndividualSubjectAssign(false)
              navigate('question-papers')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 2 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} mt-2 hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-file text-gray-900"></i>&nbsp;&nbsp;Question Papers</button>

            <button onClick={() => {
              context?.setMainNav(3)
              context?.setShowIndividualSubjectAssign(false)
              navigate('ai-tutor')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 3 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} mt-2 hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-robot text-gray-900"></i>&nbsp;&nbsp;AI Tutor</button>

            <button onClick={() => {
              context?.setMainNav(4)
              context?.setShowIndividualSubjectAssign(false)
              navigate('gen-assignment-ques')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 4 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} mt-2 hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-paperclip text-gray-900"></i>&nbsp;&nbsp;Gen Assignment Ques</button>

            <button onClick={() => {
              context?.setMainNav(5)
              context?.setShowIndividualSubjectAssign(false)
              navigate('gen-syllabus-ques')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 5 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} mt-2 hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-paperclip text-gray-900"></i>&nbsp;&nbsp;Gen Syllabus Ques</button>

            <button onClick={() => {
              context?.setMainNav(6)
              context?.setShowIndividualSubjectAssign(false)
              navigate('placements/suggested-companies')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 6 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} mt-2 hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-suitcase text-gray-900"></i>&nbsp;&nbsp;Placements</button>


          <button onClick={() => {
              context?.setMainNav(7)
              context?.setShowIndividualSubjectAssign(false)
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 7 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} mt-2 hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-bullhorn text-gray-900"></i>&nbsp;&nbsp;Announcements</button>


        </div>

        {/* <button className='py-3 mt-40 rounded-md w-full bg-[#f3f3f3] hover:bg-[#e1e1e1] transition-all'><i className="fa-solid fa-gears"></i>&nbsp;&nbsp;Settings</button> */}
    </div>
  )
}
