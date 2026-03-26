import { useState } from 'react'
import IndividualSyllabus from './IndividualSyllabus'
import SelectedTopic from './SelectedTopic'
import { useAppContext } from '../../context/ContextProvider'
import { Subject } from '../../api/subject'

export default function AiTutor() {
  const context = useAppContext()
  const [selectSubjectId, setSelectSubjectId] = useState<string>('')
  const [selectTempSubjectId, setSelectTempSubjectId] = useState<string>('')
  
  // This essentially represents the Chapter ID now
  const [selectChapterId, setSelectChapterId] = useState<string>('')
  
  // This represents the index of the topic within the chapter's topic array
  const [selectChapterTopicId, setSelectChapterTopicId] = useState<number>(0)

  return (
    // <div className="relative w-[80vw] flex flex-col items-start p-4 justify-start rounded-lg">
        <div className="relative w-full flex flex-col items-start p-4 justify-start rounded-lg">

        <p className="font-semibold text-2xl md:text-3xl">AI Tutor</p>
        <p className="text-md md:text-sm text-gray-700">A LLM model to ask queries regarding academical concepts</p>

        <div className="relative h-[80%] w-full overflow-y-auto flex flex-col p-3 items-start justify-start">

          <div className='mt-5 flex flex-col items-start justify-start w-[80%] bg-white drop-shadow-lg rounded-lg p-5 gap-2'>
              <div className='font-semibold gap-3 flex items-center justify-start'>
                  <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>1</div>
                  <p className='text-lg md:text-xl'>Select the chapter you want to prepare</p>
              </div>

              <div className='flex flex-col items-start justify-start mb-3 mt-10'>
                <p className='font-semibold text-md md:text-lg'>Subject's <span className='text-green-500'>Syllabus</span> in current semester</p>
                <p className='text-xs md:text-sm text-gray-700'>Select the subject to continue with from below</p>
              </div>

              {context?.subjects?.map((sub: Subject) => {
                    return (
                        <div key={sub._id} className="flex flex-col items-start justify-start w-full">
                            <div onClick={() => {
                                if (selectTempSubjectId !== sub._id) {
                                    setSelectTempSubjectId(sub._id)
                                    setSelectSubjectId(sub._id)
                                    setSelectChapterId('')
                                }
                                else if (selectTempSubjectId === sub._id){
                                    setSelectSubjectId('')
                                    setSelectTempSubjectId('')
                                    setSelectChapterId('')
                                }
                            }} className='w-full'>
                              <div className={`${selectSubjectId === sub._id ? 'border-green-500 bg-green-200 -translate-y-1 drop-shadow-lg' : 'border-green-100'} hover:-translate-y-1 hover:shadow-lg hover:border-green-500 border-2 transition-all duration-200 w-full flex items-center justify-between text-left px-5 py-3 rounded-md bg-green-100 hover:cursor-pointer`}>
                                  <p className="text-xs md:text-sm font-medium">{sub.name} {sub.code}</p>
                                  <i className="fa-solid text-gray-700 fa-arrow-right-long"></i>
                              </div>
                            </div>

                            {selectTempSubjectId !== '' && selectTempSubjectId === sub._id &&
                              <IndividualSyllabus 
                                setSelectChapterId={setSelectChapterId}
                                selectSubjectId={selectSubjectId}
                                />}
                        </div>
                    )
                })}

            </div>

            {/* show selected topics and conecpt */}
            {selectChapterId && 
              <SelectedTopic 
                selectSubjectId={selectSubjectId} 
                selectChapterId={selectChapterId} 
                selectChapterTopicId={selectChapterTopicId} 
                setSelectChapterTopicId={setSelectChapterTopicId}/>}
        </div>
    </div>
  )
}










// import { useState } from 'react'
// import { SUBJECTS } from '../../CONSTANTS/CONSTANTS'
// import IndividualSyllabus from './IndividualSyllabus'
// import SelectedTopic from './SelectedTopic'
// import { useAppContext } from '../../context/ContextProvider'
// import { Subject } from '../../api/subject'

// export default function AiTutor() {
//   const context = useAppContext()
//   const [selectSubjectId, setSelectSubjectId] = useState<string>('')
//   const [selectTempSubjectId, setSelectTempSubjectId] = useState<string>('')
//   const [selectChapterId, setSelectChapterId] = useState<string>('')
//   const [selectChapterTopicId, setSelectChapterTopicId] = useState<number>(0)

//   return (
//     <div className="relative w-[80vw] flex flex-col items-start p-4 justify-start rounded-lg">
//         <p className="font-semibold text-2xl md:text-3xl">AI Tutor</p>
//         <p className="text-md md:text-sm text-gray-700">A LLM model to ask queries regarding academical concepts</p>

//         <div className="relative h-[80%] w-full overflow-y-auto flex flex-col p-3 items-start justify-start">

//           <div className='mt-5 flex flex-col items-start justify-start w-[80%] bg-white drop-shadow-lg rounded-lg p-5 gap-2'>
//               <div className='font-semibold gap-3 flex items-center justify-start'>
//                   <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>1</div>
//                   <p className='text-lg md:text-xl'>Select the chapter you want to prepare</p>
//               </div>

//               <div className='flex flex-col items-start justify-start mb-3 mt-10'>
//                 <p className='font-semibold text-md md:text-lg'>Subject's <span className='text-green-500'>Syllabus</span> in current semester</p>
//                 <p className='text-xs md:text-sm text-gray-700'>Select the subject to continue with from below</p>
//               </div>

//               {context?.subjects?.map((sub: Subject, index: number) => {
//                     return (
//                         <div key={sub._id} className="flex flex-col items-start justify-start w-full">
//                             <div onClick={() => {
//                                 if (selectTempSubjectId !== sub._id) {
//                                     setSelectTempSubjectId(sub._id)
//                                     setSelectSubjectId(sub._id)

//                                     setSelectChapterId('')
//                                 }
//                                 else if (selectTempSubjectId === sub._id){
//                                     setSelectSubjectId('')
//                                     setSelectTempSubjectId('')
//                                     setSelectChapterId('')
//                                 }
//                             }} className='w-full'>
//                               <div className={`${selectSubjectId === sub._id ? 'border-green-500 bg-green-200 -translate-y-1 drop-shadow-lg' : 'border-green-100'} hover:-translate-y-1 hover:shadow-lg hover:border-green-500 border-2 transition-all duration-200 w-full flex items-center justify-between text-left px-5 py-3 rounded-md bg-green-100 hover:cursor-pointer`}>
//                                   <p className="text-xs md:text-sm font-medium">{sub.name} {sub.code}</p>
//                                   <i className="fa-solid text-gray-700 fa-arrow-right-long"></i>
//                               </div>
//                             </div>

//                             {selectTempSubjectId !== '' && selectTempSubjectId === sub._id &&
//                               <IndividualSyllabus 
//                                 setSelectChapterId={setSelectChapterId}
//                                 selectSubjectId={selectSubjectId}
//                                 />}
//                         </div>
//                     )
//                 })}

//             </div>

//             {/* show selected topics and conecpt */}
//             {selectChapterId && 
//               <SelectedTopic 
//                 selectSubjectId={selectSubjectId} 
//                 selectChapterId={selectChapterId} 
//                 selectChapterTopicId={selectChapterTopicId} 
//                 setSelectChapterTopicId={setSelectChapterTopicId}/>}
//         </div>
//     </div>
//   )
// }
