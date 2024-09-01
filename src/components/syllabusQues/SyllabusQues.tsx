import { useState } from "react"
import { SUBJECTS } from '../../CONSTANTS/CONSTANTS'
import IndividualSyllabus from "../tutor/IndividualSyllabus"
import SelectedSyllabusTopic from "./SelectedSyllabusTopic"

export default function SyllabusQues() {
    const [selectSubjectIndex, setSelectSubjectIndex] = useState<number>(-1)
    const [selectTempSubjectIndex, setSelectTempSubjectIndex] = useState<number>(-1)
    const [selectSubjectTopicIndex, setSelectSubjectTopicIndex] = useState<number>(-1)

  return (
    <div className="relative w-[80vw] flex flex-col items-start p-4 justify-start rounded-lg">
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

              {SUBJECTS.map((sub, index: number) => {
                    return (
                        <div key={index} className="flex flex-col items-start justify-start w-full">
                            <div onClick={() => {
                                if (selectTempSubjectIndex !== index) {
                                    setSelectTempSubjectIndex(index)
                                    setSelectSubjectIndex(index)

                                    setSelectSubjectTopicIndex(-1)
                                }
                                else if (selectTempSubjectIndex === index){
                                    setSelectSubjectIndex(-1)
                                    setSelectTempSubjectIndex(-1)
                                }
                            }} className='w-full'>
                              <div className={`${selectSubjectIndex === index ? 'border-green-500 bg-green-200 -translate-y-1 drop-shadow-lg' : 'border-green-100'} hover:-translate-y-1 hover:shadow-lg hover:border-green-500 border-2 transition-all duration-200 w-full flex items-center justify-between text-left px-5 py-3 rounded-md bg-green-100 hover:cursor-pointer`}>
                                  <p className="text-xs md:text-sm font-medium">{sub.name} {sub.code}</p>
                                  <i className="fa-solid text-gray-700 fa-arrow-right-long"></i>
                              </div>
                            </div>

                            {selectTempSubjectIndex !== -1 && selectTempSubjectIndex === index &&
                              <IndividualSyllabus selectSubjectIndex={selectSubjectIndex} setSelectTempSubjectIndex={setSelectTempSubjectIndex} setSelectSubjectTopicIndex={setSelectSubjectTopicIndex}/>}
                        </div>
                    )
                })}

            </div>

             {/* show selected topics and conecpt */}
             {selectSubjectTopicIndex !== -1 && 
              <SelectedSyllabusTopic selectSubjectIndex={selectSubjectIndex} selectSubjectTopicIndex={selectSubjectTopicIndex} setSelectSubjectTopicIndex={setSelectSubjectTopicIndex}/>}
        </div>
    </div>
  )
}
