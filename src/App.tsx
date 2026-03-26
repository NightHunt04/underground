import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import { useAppContext } from "./context/ContextProvider"
import { useCookies } from "react-cookie"

function App(): React.ReactElement {
  // const context = useAppContext()
  const [cookies] = useCookies(['user'])
  const navigate = useNavigate()

  useEffect(() => {
    if (!cookies.user) {
      navigate('/signin')
    } 
  }, [cookies.user])

  return (
    <div className="w-full min-h-screen font-inter bg-[#f4f4f4] text-black flex items-start justify-start">
      <Outlet />
    </div>
  )
}

export default App
