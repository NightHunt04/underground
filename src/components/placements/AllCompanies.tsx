import { COMPANY_DATA } from '../../CONSTANTS/CONSTANTS'
import { useState } from 'react'

export default function AllCompanies() {
    const [isPinned, setIsPinned] = useState<number[]>([])

    const handlePinCompany = (index: number) => {
        if (isPinned.includes(index))
            setIsPinned(prev => prev.filter(companyInd => companyInd !== index))
        else setIsPinned(prev => [...prev, index])


        // fetch api to save the pinned company index


    }

  return (
    <div className="w-[80%] rounded-lg py-4 flex flex-col gap-5 items-start justify-start">
        {COMPANY_DATA.map((company, index) => {
            return (
                <div key={index} className='bg-white drop-shadow-lg p-6 rounded-lg flex items-start gap-3 justify-between w-full relative'>
                    <div className='flex items-center justify-center gap-3 z-20 absolute right-80 top-7'>
                        <button onClick={() => handlePinCompany(index)} className=''><i className={`text-lg fa-solid ${isPinned.includes(index) ? 'fa-thumbtack-slash' : 'fa-thumbtack'} `}></i></button>
                    </div>

                    <p className='text-xs md:text-sm text-gray-600'>{index + 1}</p>

                    <img src={company.profileImage} alt="img" className='ml-5 w-[30px] h-[30px] rounded-md object-cover' />
                    
                    <div className='w-full flex flex-col items-start justify-start'>
                        <h3 className='font-semibold text-sm md:text-xl'>{company.name}</h3>
                        <p className='text-xs md:text-sm text-gray-600 font-medium'>{company.address}</p>
                        <p className='text-xs md:text-sm text-gray-600 font-medium'>Employees : {company.numberOfEmployees}</p>

                        <p className='bg-green-100 p-1 rounded-md font-semibold mt-3'>({company.work})</p>
                        
                        <p className='text-xs md:text-sm text-gray-600 mt-10'>Roles offered</p>
                        <div className='mt-2 flex flex-col items-start justify-start w-[80%]'>
                            {company.jobRoles.map((role, index) => {
                                return (
                                    <div key={index} className='w-full flex flex-col items-start p-5 justify-start gap-1 mb-10 border-2 border-green-500 rounded-lg'>
                                        <div className='flex items-start justify-between gap-5 w-full text-xs md:text-sm'>
                                            <p className='font-semibold text-sm md:text-lg'>{role.role}</p>
                                            <p>₹ {role.salaryRange}</p>
                                        </div>
                                        
                                        <div className='w-full text-xs md:text-sm flex items-start justify-start flex-col'>
                                            <p>Skills required</p>

                                            <div className='text-gray-600 flex items-start justify-start gap-4 w-full'>
                                                {role.skillsRequired.map((skill, index) => {
                                                    return (
                                                        <p key={index} className='bg-green-100 font-medium drop-shadow-lg p-2 border-[1px] border-green-300 rounded-lg mt-2'>{skill}</p>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )
        })}
    </div>
  )
}
