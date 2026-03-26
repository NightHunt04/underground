import SideNavBar from './left-bar/SideNavBar'
import { Outlet } from 'react-router-dom'

export default function Home() {
  return (
    // h-screen and overflow-hidden ensures the window doesn't scroll
    <div className='w-full flex items-start justify-start p-3 gap-3 h-screen overflow-hidden bg-[#f4f4f4]'>
        
        {/* Left Sidebar: Fixed width, independent scroll, no visible scrollbar */}
        <div className="h-full w-[20vw] flex-shrink-0 overflow-y-auto no-scrollbar pb-10">
            <SideNavBar />
        </div>
        
        {/* Right Content: Takes remaining space (flex-1), handles its own scroll */}
        {/* Changed w-[80vw] to flex-1 to fix horizontal scrollbar issue */}
        <div className="h-full flex-1 overflow-y-auto rounded-lg thin-scrollbar relative">
            <Outlet />
        </div>
    </div>
  )
}