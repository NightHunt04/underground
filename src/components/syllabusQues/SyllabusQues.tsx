import { useState } from "react"
import IndividualSyllabus from "../tutor/IndividualSyllabus"
import SelectedSyllabusTopic from "./SelectedSyllabusTopic"
import { useAppContext } from "../../context/ContextProvider"

export default function SyllabusQues() {
  const context = useAppContext()
    const [selectSubjectId, setSelectSubjectId] = useState<string>('')
    const [selectTempSubjectId, setSelectTempSubjectId] = useState<string>('')
    // This now stores the Chapter ID
    const [selectChapterId, setSelectChapterId] = useState<string>('')

  return (
    // <div className="relative w-[80vw] flex flex-col items-start p-4 justify-start rounded-lg">
        <div className="relative w-full flex flex-col items-start p-4 justify-start rounded-lg">

        <p className="font-semibold text-2xl md:text-3xl">AI Syllabus Question Maker</p>
        <p className="text-md md:text-sm text-gray-700">Generates short quiz, questions, and coding questions from the given syllabus</p>

        <div className="relative h-[80%] w-full overflow-y-auto flex flex-col p-3 items-start justify-start">

          <div className='mt-5 flex flex-col items-start justify-start w-[80%] bg-white drop-shadow-lg rounded-lg p-5 gap-2'>
            <div className='font-semibold gap-3 flex items-center justify-start'>
                <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>1</div>
                <p className='text-lg md:text-xl'>Select the chapter you want to generate questions for</p>
            </div> 

              <div className='mt-10 flex flex-col items-start justify-start mb-3'>
                <p className='font-semibold text-md md:text-lg'>Subject's <span className='text-green-500'>Syllabus</span> in current semester</p>
                <p className='text-xs md:text-sm text-gray-700'>Select the subject to continue with from below</p>
              </div>

              {context?.subjects?.map((sub, index: number) => {
                    return (
                        <div key={index} className="flex flex-col items-start justify-start w-full">
                            <div onClick={() => {
                                if (selectTempSubjectId !== sub._id) {
                                    setSelectTempSubjectId(sub._id)
                                    setSelectSubjectId(sub._id)
                                    
                                    setSelectChapterId('')
                                }
                                else if (selectTempSubjectId === sub._id){
                                    setSelectSubjectId('')
                                    setSelectTempSubjectId('')
                                }
                            }} className='w-full'>
                              <div className={`${selectSubjectId === sub._id ? 'border-green-500 bg-green-200 -translate-y-1 drop-shadow-lg' : 'border-green-100'} hover:-translate-y-1 hover:shadow-lg hover:border-green-500 border-2 transition-all duration-200 w-full flex items-center justify-between text-left px-5 py-3 rounded-md bg-green-100 hover:cursor-pointer`}>
                                  <p className="text-xs md:text-sm font-medium">{sub.name} {sub.code}</p>
                                  <i className="fa-solid text-gray-700 fa-arrow-right-long"></i>
                              </div>
                            </div>

                            {selectTempSubjectId !== '' && selectTempSubjectId === sub._id &&
                              <IndividualSyllabus 
                                selectSubjectId={selectSubjectId} 
                                setSelectChapterId={setSelectChapterId}/>}
                        </div>
                    )
                })}

            </div>

             {/* show selected topics and conecpt */}
             {selectChapterId && 
              <SelectedSyllabusTopic 
                selectSubjectId={selectSubjectId} 
                selectChapterId={selectChapterId} 
                setSelectChapterId={setSelectChapterId}/>}
        </div>
    </div>
  )
}














// import { useState } from "react"
// import { SUBJECTS } from '../../CONSTANTS/CONSTANTS'
// import IndividualSyllabus from "../tutor/IndividualSyllabus"
// import SelectedSyllabusTopic from "./SelectedSyllabusTopic"
// import { useAppContext } from "../../context/ContextProvider"

// export default function SyllabusQues() {
//   const context = useAppContext()
//     const [selectSubjectId, setSelectSubjectId] = useState<string>('')
//     const [selectTempSubjectId, setSelectTempSubjectId] = useState<string>('')
//     const [selectSubjectTopicId, setSelectSubjectTopicId] = useState<number>(-1)

//   return (
//     <div className="relative w-[80vw] flex flex-col items-start p-4 justify-start rounded-lg">
//         <p className="font-semibold text-2xl md:text-3xl">AI Syllabus Question Maker</p>
//         <p className="text-md md:text-sm text-gray-700">Generates short quiz, questions, and coding questions from the given syllabus</p>

//         <div className="relative h-[80%] w-full overflow-y-auto flex flex-col p-3 items-start justify-start">

//           <div className='mt-5 flex flex-col items-start justify-start w-[80%] bg-white drop-shadow-lg rounded-lg p-5 gap-2'>
//             <div className='font-semibold gap-3 flex items-center justify-start'>
//                 <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>1</div>
//                 <p className='text-lg md:text-xl'>Select the chapter you want to generate questions for</p>
//             </div> 

//               <div className='mt-10 flex flex-col items-start justify-start mb-3'>
//                 <p className='font-semibold text-md md:text-lg'>Subject's <span className='text-green-500'>Syllabus</span> in current semester</p>
//                 <p className='text-xs md:text-sm text-gray-700'>Select the subject to continue with from below</p>
//               </div>

//               {context.subjects.map((sub, index: number) => {
//                     return (
//                         <div key={index} className="flex flex-col items-start justify-start w-full">
//                             <div onClick={() => {
//                                 if (selectTempSubjectId !== sub._id) {
//                                     setSelectTempSubjectId(sub._id)
//                                     setSelectSubjectId(sub._id)
//                                     setSelectSubjectId(sub._id)

//                                     setSelectSubjectTopicId(-1)
//                                 }
//                                 else if (selectTempSubjectId === sub._id){
//                                     setSelectSubjectId('')
//                                     setSelectTempSubjectId('')
//                                 }
//                             }} className='w-full'>
//                               <div className={`${selectSubjectId === sub._id ? 'border-green-500 bg-green-200 -translate-y-1 drop-shadow-lg' : 'border-green-100'} hover:-translate-y-1 hover:shadow-lg hover:border-green-500 border-2 transition-all duration-200 w-full flex items-center justify-between text-left px-5 py-3 rounded-md bg-green-100 hover:cursor-pointer`}>
//                                   <p className="text-xs md:text-sm font-medium">{sub.name} {sub.code}</p>
//                                   <i className="fa-solid text-gray-700 fa-arrow-right-long"></i>
//                               </div>
//                             </div>

//                             {selectTempSubjectId !== '' && selectTempSubjectId === sub._id &&
//                               <IndividualSyllabus selectSubjectId={selectSubjectId} setSelectTempSubjectId={setSelectTempSubjectId} setSelectSubjectTopicId={setSelectSubjectTopicId}/>}
//                         </div>
//                     )
//                 })}

//             </div>

//              {/* show selected topics and conecpt */}
//              {selectSubjectTopicId !== -1 && 
//               <SelectedSyllabusTopic selectSubjectId={selectSubjectId} selectSubjectTopicId={selectSubjectTopicId} setSelectSubjectTopicId={setSelectSubjectTopicId}/>}
//         </div>
//     </div>
//   )
// }
