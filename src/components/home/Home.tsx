import SideNavBar from './left-bar/SideNavBar'
import Main from './center-bar/Main'
import { Outlet } from 'react-router-dom'

export default function Home() {
  return (
    <div className='w-full flex items-start justify-start p-3'>
        <SideNavBar />
        {/* <Main /> */}
        <Outlet />
    </div>
  )
}
