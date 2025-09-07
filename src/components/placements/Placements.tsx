import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function Placements() {
    const navigate = useNavigate()
    const [activeButton, setActiveButton] = useState<number>(1)
    
    const handleButtonClicked = (set: number) => {
        setActiveButton(set)
        
        switch (set) {
            case 1:
                navigate('suggested-companies')
                break
            case 2:
                navigate('all-companies')
                break
            case 3:
                navigate('mock-test')
                break
            case 4:
                navigate('preparation')
                break
        }
    }

  return (
    <div className="relative w-[80vw] flex flex-col items-start p-4 justify-start rounded-lg">
        <p className="font-semibold text-2xl md:text-3xl">Placements</p>
        <p className="text-md md:text-sm text-gray-700">Search companies, skill sets required, mock interviews, placement preparations for the companies of college placement cell</p>

        <div className="w-[80%] bg-white rounded-lg drop-shadow-lg mt-10 px-16 py-4 flex items-center justify-between">
            <button onClick={() => handleButtonClicked(1)} className={`${activeButton === 1 ? 'bg-green-100 border-2 border-green-500 drop-shadow-lg' : ''} flex items-center justify-center font-semibold rounded-lg px-4 py-3`}><i className="fa-solid fa-building"></i>&nbsp;&nbsp;Suggested Companies</button>
            <button onClick={() => handleButtonClicked(2)} className={`${activeButton === 2 ? 'bg-green-100 border-2 border-green-500 drop-shadow-lg' : ''} flex items-center justify-center font-semibold rounded-lg px-4 py-3`}><i className="fa-solid fa-building"></i>&nbsp;&nbsp;All Companies</button>
            {/* <button onClick={() => handleButtonClicked(3)} className={`${activeButton === 3 ? 'bg-green-100 border-2 border-green-500 drop-shadow-lg' : ''} flex items-center justify-center font-semibold rounded-lg px-4 py-3`}><i className="fa-solid fa-vial"></i>&nbsp;&nbsp;Mock Test</button> */}
            <button onClick={() => handleButtonClicked(4)} className={`${activeButton === 4 ? 'bg-green-100 border-2 border-green-500 drop-shadow-lg' : ''} flex items-center justify-center font-semibold rounded-lg px-4 py-3`}><i className="fa-solid fa-pencil"></i>&nbsp;&nbsp;Prepare</button>
        </div>

        <Outlet />
    </div>
  )
}
