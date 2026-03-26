import { useState } from 'react'
import { useAppContext } from '../../context/ContextProvider'

export default function AllCompanies() {
    const context = useAppContext()
    const [isPinned, setIsPinned] = useState<string[]>([]) // Changed to string array for _id

    const handlePinCompany = (id: string) => {
        if (isPinned.includes(id))
            setIsPinned(prev => prev.filter(companyId => companyId !== id))
        else setIsPinned(prev => [...prev, id])

        // fetch api to save the pinned company index
    }

    // Helper to get image or placeholder
    const getProfileImage = (companyName: string) => {
        // Since backend doesn't send image yet, we use a placeholder generator based on initials
        return `https://ui-avatars.com/api/?name=${companyName}&background=random`
    }

  return (
    <div className="w-[80%] rounded-lg py-4 flex flex-col gap-5 items-start justify-start">
        {context?.companies?.length === 0 ? <p className="text-gray-500">No companies found.</p> : 
         context?.companies?.map((company, index) => {
            return (
                <div key={company._id} className='bg-white drop-shadow-lg p-6 rounded-lg flex items-start gap-3 justify-between w-full relative'>
                    <div className='flex items-center justify-center gap-3 z-20 absolute right-80 top-7'>
                        <button onClick={() => handlePinCompany(company._id)} className=''><i className={`text-lg fa-solid ${isPinned.includes(company._id) ? 'fa-thumbtack-slash' : 'fa-thumbtack'} `}></i></button>
                    </div>

                    <p className='text-xs md:text-sm text-gray-600'>{index + 1}</p>

                    <img src={getProfileImage(company.companyName)} alt="img" className='ml-5 w-[40px] h-[40px] rounded-md object-cover' />
                    
                    <div className='w-full flex flex-col items-start justify-start'>
                        <h3 className='font-semibold text-sm md:text-xl'>{company.companyName}</h3>
                        <p className='text-xs md:text-sm text-gray-600 font-medium'>{company.location}</p>
                        <p className='text-xs md:text-sm text-gray-600 font-medium'>Employees : {company.employeesCount}</p>

                        <p className='bg-green-100 p-1 rounded-md font-semibold mt-3 text-xs md:text-sm inline-block'>({company.workMode})</p>
                        <p className='text-xs text-gray-500 mt-2'>{company.description}</p>
                        
                        <p className='text-xs md:text-sm text-gray-600 mt-5 mb-2 font-semibold underline'>Roles offered</p>
                        <div className='mt-2 flex flex-col items-start justify-start w-[90%]'>
                            {company.roles.map((role, rIndex) => {
                                return (
                                    <div key={role._id || rIndex} className='w-full flex flex-col items-start p-5 justify-start gap-1 mb-5 border-2 border-green-500 rounded-lg'>
                                        <div className='flex items-start justify-between gap-5 w-full text-xs md:text-sm'>
                                            <p className='font-semibold text-sm md:text-lg'>{role.jobProfile}</p>
                                            <p className='font-medium text-green-700'>₹ {role.salary}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">Min CGPA: {role.minCGPA}</p>
                                        
                                        <div className='w-full text-xs md:text-sm flex items-start justify-start flex-col mt-2'>
                                            <p className="font-medium">Skills required:</p>

                                            <div className='text-gray-600 flex flex-wrap items-start justify-start gap-2 w-full'>
                                                {role.skills.map((skill, sIndex) => {
                                                    return (
                                                        <p key={sIndex} className='bg-green-100 font-medium drop-shadow-sm p-2 border-[1px] border-green-300 rounded-lg mt-2'>{skill}</p>
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











// import { COMPANY_DATA } from '../../CONSTANTS/CONSTANTS'
// import { useState } from 'react'

// export default function AllCompanies() {
//     const [isPinned, setIsPinned] = useState<number[]>([])

//     const handlePinCompany = (index: number) => {
//         if (isPinned.includes(index))
//             setIsPinned(prev => prev.filter(companyInd => companyInd !== index))
//         else setIsPinned(prev => [...prev, index])


//         // fetch api to save the pinned company index


//     }

//   return (
//     <div className="w-[80%] rounded-lg py-4 flex flex-col gap-5 items-start justify-start">
//         {COMPANY_DATA.map((company, index) => {
//             return (
//                 <div key={index} className='bg-white drop-shadow-lg p-6 rounded-lg flex items-start gap-3 justify-between w-full relative'>
//                     <div className='flex items-center justify-center gap-3 z-20 absolute right-80 top-7'>
//                         <button onClick={() => handlePinCompany(index)} className=''><i className={`text-lg fa-solid ${isPinned.includes(index) ? 'fa-thumbtack-slash' : 'fa-thumbtack'} `}></i></button>
//                     </div>

//                     <p className='text-xs md:text-sm text-gray-600'>{index + 1}</p>

//                     <img src={company.profileImage} alt="img" className='ml-5 w-[30px] h-[30px] rounded-md object-cover' />
                    
//                     <div className='w-full flex flex-col items-start justify-start'>
//                         <h3 className='font-semibold text-sm md:text-xl'>{company.name}</h3>
//                         <p className='text-xs md:text-sm text-gray-600 font-medium'>{company.address}</p>
//                         <p className='text-xs md:text-sm text-gray-600 font-medium'>Employees : {company.numberOfEmployees}</p>

//                         <p className='bg-green-100 p-1 rounded-md font-semibold mt-3'>({company.work})</p>
                        
//                         <p className='text-xs md:text-sm text-gray-600 mt-10'>Roles offered</p>
//                         <div className='mt-2 flex flex-col items-start justify-start w-[80%]'>
//                             {company.jobRoles.map((role, index) => {
//                                 return (
//                                     <div key={index} className='w-full flex flex-col items-start p-5 justify-start gap-1 mb-10 border-2 border-green-500 rounded-lg'>
//                                         <div className='flex items-start justify-between gap-5 w-full text-xs md:text-sm'>
//                                             <p className='font-semibold text-sm md:text-lg'>{role.role}</p>
//                                             <p>₹ {role.salaryRange}</p>
//                                         </div>
                                        
//                                         <div className='w-full text-xs md:text-sm flex items-start justify-start flex-col'>
//                                             <p>Skills required</p>

//                                             <div className='text-gray-600 flex items-start justify-start gap-4 w-full'>
//                                                 {role.skillsRequired.map((skill, index) => {
//                                                     return (
//                                                         <p key={index} className='bg-green-100 font-medium drop-shadow-lg p-2 border-[1px] border-green-300 rounded-lg mt-2'>{skill}</p>
//                                                     )
//                                                 })}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )
//                             })}
//                         </div>
//                     </div>
//                 </div>
//             )
//         })}
//     </div>
//   )
// }
