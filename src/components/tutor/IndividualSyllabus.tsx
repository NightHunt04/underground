import { useAppContext } from '../../context/ContextProvider'

interface Props {
    // selectChapterId: string
    selectSubjectId: string
    setSelectChapterId: React.Dispatch<React.SetStateAction<string>>
}

export default function IndividualSyllabus({ 
    selectSubjectId, 
    setSelectChapterId 
}: Props) {
    const context = useAppContext()
  return (
    <div className="w-full flex flex-col items-start justify-start mt-1 mb-5">
        <div className="flex flex-col items-start justify-start gap-3 w-full p-3 rounded-lg border-[1px] border-gray-300">
            <p className='font-semibold'>Subject Syllabus</p>

            {context?.chapters?.map((item, index: number) => item.subject._id === selectSubjectId && (
                    <div onClick={() => {
                        setSelectChapterId(item._id)    
                    }} key={index} className='flex items-start justify-start p-3 w-full rounded-lg gap-3 bg-gray-100 drop-shadow-lg hover:bg-white hover:border-blue-500 border-2 border-gray-100 hover:cursor-pointer transition-all'>
                        <p className='text-sm text-gray-600'>{index + 1}</p>
                        <div className='flex flex-col items-start justify-start'>
                            <p className='font-semibold'>{item.title}</p>
                            
                            <div className='flex flex-col items-start justify-start w-full p-2'>
                                {item.topics.map((topic, index: number) => {
                                    return (
                                        <p key={index} className='text-sm text-gray-600 w-full'>- {topic}</p>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    </div>
  )
}
