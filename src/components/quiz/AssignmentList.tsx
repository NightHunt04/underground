
interface Assignment {
    id: string
    title: string
    statement: string
    receivedDate: string
}

interface SubjectAssignment {
    subject: string
    lang: string
    code: string
    assignments: Assignment[]
}

interface Props {
    assignments: SubjectAssignment,
    setSelectSubjectAssignmentIndex: React.Dispatch<React.SetStateAction<number>>
    setSelectTempSubjectIndex: React.Dispatch<React.SetStateAction<number>>
}

export default function AssignmentList({ assignments, setSelectSubjectAssignmentIndex, setSelectTempSubjectIndex }: Props) {
  return (
    <div className="w-full rounded-md drop-shadow-lg mt-2 p-2 border-2 border-gray-300 flex flex-col items-center justify-center">
        <p className="w-full mt-2 mb-5 px-2 text-gray-700">Select the assignment in which you want to take the quick quiz in</p>
        {assignments.assignments.map((assignment, index: number) => {
            return (
                <div key={index} onClick={() => {
                    setSelectSubjectAssignmentIndex(index)
                    setSelectTempSubjectIndex(-1)
                }} className="hover:cursor-pointer hover:border-blue-400 hover:bg-white border-2 border-gray-100 transition-all duration-200 bg-gray-100 mb-3 rounded-lg flex items-start justify-start w-full gap-4 p-4">
                    <p className="text-xs md:text-sm text-gray-600">{assignment.id}</p>
                    <div className="flex flex-col items-start justify-start">
                        <p className="font-medium">{assignment.title}</p>
                        <p className="text-xs md:text-sm text-gray-700">{assignment.statement}</p>
                    </div>
                </div>
            )
        })}
    </div>
  )
}
