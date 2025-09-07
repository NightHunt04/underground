import { SUBJECTS_INFO } from '../../CONSTANTS/CONSTANTS'

interface Props {
    selectSubjectIndex: number
    setSelectSubjectTopicIndex: React.Dispatch<React.SetStateAction<number>>
    setSelectTempSubjectIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function IndividualSyllabus({ selectSubjectIndex, setSelectSubjectTopicIndex, setSelectTempSubjectIndex }: Props) {
  return (
    <div className="w-full flex flex-col items-start justify-start mt-1 mb-5">
        <div className="flex flex-col items-start justify-start gap-3 w-full p-3 rounded-lg border-[1px] border-gray-300">
            <p className='font-semibold'>Subject Syllabus</p>

            {SUBJECTS_INFO[selectSubjectIndex].syllabus?.map((item, index: number) => {
                return (
                    <div onClick={() => {
                        setSelectSubjectTopicIndex(index)
                        setSelectTempSubjectIndex(-1)
                    }} key={index} className='flex items-start justify-start p-3 w-full rounded-lg gap-3 bg-gray-100 drop-shadow-lg hover:bg-white hover:border-blue-500 border-2 border-gray-100 hover:cursor-pointer transition-all'>
                        <p className='text-sm text-gray-600'>{index + 1}</p>
                        <div className='flex flex-col items-start justify-start'>
                            <p className='font-semibold'>{item.title}</p>
                            
                            <div className='flex flex-col items-start justify-start w-full p-2'>
                                {item.content.map((item, index: number) => {
                                    return (
                                        <p key={index} className='text-sm text-gray-600 w-full'>- {item}</p>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}
