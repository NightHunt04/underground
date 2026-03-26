import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../context/ContextProvider'
import { useCookies } from 'react-cookie'

export default function SideNavBar() {
  const navigate = useNavigate()
    const context = useAppContext()
    const [cookie, removeCookie] = useCookies(['user'])

    const handleLogout = () => {
        // 1. Remove the cookie
        removeCookie('user', { path: '/' })
        
        // 2. Clear context state
        context?.setUser(null)
        context?.setIsLoggedIn(false)
        context?.setSubjects([])
        context?.setChapters([])
        context?.setAssignments([])
        
        // 3. Redirect to signin
        navigate('/signin')
    }

  return (
    <div className='flex flex-col min-h-full items-center justify-start p-5 rounded-lg bg-white drop-shadow-lg w-full'>
        <div className='flex items-start justify-start gap-5'>
          <img src="/assets/logo.jpg" alt="logo" className='w-[100px] h-auto object-cover my-10' />
        </div>

        <div className='flex items-start justify-center w-full gap-2 pb-10'>
          <img src="/assets/nemish.webp" alt="student" className='w-[40%] h-auto rounded-md' />
          
          <div className='flex flex-col items-start text-xs md:text-sm justify-start'>
            <p className='font-semibold'>{cookie.user?.name}</p>
            <p className='font-medium mt-1 p-1 rounded-md bg-blue-100'>{cookie.user?.enrollmentNumber}</p>
            <p className='text-gray-700 mt-1'>{cookie.user?.branch}</p>
          </div>
        </div>

        <div className='flex flex-col items-start justify-start w-full pt-10 border-t-[1px] border-gray-300 mb-10 font-semibold gap-1'>
            <button onClick={() => {
              context?.setMainNav(0)
              context?.setShowIndividualSubjectAssign(false)
              navigate('subjects')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 0 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-folder text-gray-800"></i>&nbsp;&nbsp;Subjects</button>

            <button onClick={() => {
              context?.setMainNav(1)
              context?.setShowIndividualSubjectAssign(false)
              navigate('syllabus')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 1 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-book text-gray-800"></i>&nbsp;&nbsp;Syllabus</button>

            <button onClick={() => {
              context?.setMainNav(2)
              context?.setShowIndividualSubjectAssign(false)
              navigate('question-papers')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 2 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-file text-gray-900"></i>&nbsp;&nbsp;Question Papers</button>

            <button onClick={() => {
              context?.setMainNav(3)
              context?.setShowIndividualSubjectAssign(false)
              navigate('ai-tutor')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 3 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-robot text-gray-900"></i>&nbsp;&nbsp;AI Tutor</button>

            <button onClick={() => {
              context?.setMainNav(4)
              context?.setShowIndividualSubjectAssign(false)
              navigate('gen-assignment-ques')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 4 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-paperclip text-gray-900"></i>&nbsp;&nbsp;Gen Assignment Ques</button>

            <button onClick={() => {
              context?.setMainNav(5)
              context?.setShowIndividualSubjectAssign(false)
              navigate('gen-syllabus-ques')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 5 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-paperclip text-gray-900"></i>&nbsp;&nbsp;Gen Syllabus Ques</button>

            <button onClick={() => {
              context?.setMainNav(6)
              context?.setShowIndividualSubjectAssign(false)
              navigate('placements/suggested-companies')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 6 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-suitcase text-gray-900"></i>&nbsp;&nbsp;Placements</button>

            <button onClick={() => {
              context?.setMainNav(7)
              context?.setShowIndividualSubjectAssign(false)
              navigate('announcements')
            }} className={`gap-2 flex items-center justify-start px-10 py-3 rounded-md w-full text-left ${context?.mainNav === 7 ? 'bg-[#dadada]' : 'bg-[#f3f3f3]'} hover:bg-[#e1e1e1] transition-all`}><i className="fa-solid fa-bullhorn text-gray-900"></i>&nbsp;&nbsp;Announcements</button>
        </div>

        {/* Logout Button at bottom */}
        <div className="w-full mt-auto pt-10">
            <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center gap-3 px-10 py-3 rounded-md bg-red-50 text-red-600 font-semibold hover:bg-red-100 hover:text-red-700 transition-all border border-red-200"
            >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
            </button>
        </div>
    </div>
  )
}