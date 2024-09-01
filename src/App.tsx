import { Outlet } from "react-router-dom"

function App(): React.ReactElement {

  return (
    <div className="w-full min-h-screen font-inter bg-[#f4f4f4] text-black flex items-start justify-start">
      <Outlet />
    </div>
  )
}

export default App
