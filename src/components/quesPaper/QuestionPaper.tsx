import { useEffect, useState, useMemo } from 'react'
import { useAppContext } from '../../context/ContextProvider'
import { pyqApi } from '../../api/pyq'
import { useCookies } from 'react-cookie'

export default function QuestionPaper() {
  const context = useAppContext()
  const [cookies] = useCookies(['user'])
  const [loading, setLoading] = useState<boolean>(false)

  // Filter States
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('All')

  // Constants for dropdowns (You can also derive these dynamically if preferred)
  const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8']
  const BRANCHES = ['CE', 'CSE', 'IT', 'ITE', 'ML/AI']

  useEffect(() => {
    const fetchPyqs = async () => {
      setLoading(true)
      try {
        const response = await pyqApi.getAllPyqs()
        if (response.success) {
          context?.setPyqs(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch PYQs", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPyqs()
  }, [])

  // Set default filters based on logged-in user info
  useEffect(() => {
    if (cookies.user) {
        // Convert to string to match value types in select inputs
        setSelectedSemester(cookies.user.semester ? cookies.user.semester.toString() : '1')
        setSelectedBranch(cookies.user.branch || 'CE')
    }
  }, [cookies.user])

  // Reset subject filter when semester or branch changes
  useEffect(() => {
    setSelectedSubject('All')
  }, [selectedSemester, selectedBranch])

  // Derive available subjects based on current Branch and Semester selection
  const availableSubjects = useMemo(() => {
    if (!context?.pyqs) return []
    
    const filtered = context.pyqs.filter(pyq => {
        const matchBranch = selectedBranch ? pyq.branch === selectedBranch : true
        const matchSem = selectedSemester ? pyq.semester.toString() === selectedSemester : true
        return matchBranch && matchSem
    })

    // Extract unique subject names
    const subjects = Array.from(new Set(filtered.map(p => p.subject.name)))
    return subjects
  }, [context?.pyqs, selectedBranch, selectedSemester])

  // Final Filtered List
  const filteredPyqs = useMemo(() => {
    if (!context?.pyqs) return []

    return context.pyqs.filter(pyq => {
        const matchBranch = selectedBranch ? pyq.branch === selectedBranch : true
        const matchSem = selectedSemester ? pyq.semester.toString() === selectedSemester : true
        const matchSubject = selectedSubject !== 'All' ? pyq.subject.name === selectedSubject : true
        
        return matchBranch && matchSem && matchSubject
    })
  }, [context?.pyqs, selectedBranch, selectedSemester, selectedSubject])

  return (
    // <div className='w-[80vw] flex flex-col relative items-start justify-start p-5 h-screen overflow-y-auto'>
    <div className='w-full flex flex-col relative items-start justify-start p-5'>

        <p className='text-2xl md:text-3xl font-semibold'>Question Papers (Previous year's)</p>
        <p className="text-gray-600 mb-6">Access previous year question papers for better preparation.</p>

        {/* Filters Section */}
        <div className="w-full bg-white border-[1px] border-gray-200 p-4 rounded-lg drop-shadow-sm mb-8 flex flex-wrap gap-4 items-end">
            
            {/* Branch Filter */}
            <div className="flex flex-col gap-1 w-full md:w-auto">
                <label className="text-xs font-semibold text-gray-500 uppercase">Branch</label>
                <select 
                    value={selectedBranch} 
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="px-4 py-2 border-[1px] border-gray-300 rounded-md outline-none focus:border-green-500 bg-gray-50 min-w-[150px]"
                >
                    {BRANCHES.map(branch => (
                        <option key={branch} value={branch}>{branch}</option>
                    ))}
                </select>
            </div>

            {/* Semester Filter */}
            <div className="flex flex-col gap-1 w-full md:w-auto">
                <label className="text-xs font-semibold text-gray-500 uppercase">Semester</label>
                <select 
                    value={selectedSemester} 
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="px-4 py-2 border-[1px] border-gray-300 rounded-md outline-none focus:border-green-500 bg-gray-50 min-w-[100px]"
                >
                    {SEMESTERS.map(sem => (
                        <option key={sem} value={sem}>Sem {sem}</option>
                    ))}
                </select>
            </div>

            {/* Subject Filter */}
            <div className="flex flex-col gap-1 w-full md:w-auto flex-grow">
                <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="px-4 py-2 border-[1px] border-gray-300 rounded-md outline-none focus:border-green-500 bg-gray-50 w-full"
                    disabled={availableSubjects.length === 0}
                >
                    <option value="All">All Subjects</option>
                    {availableSubjects.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
            </div>
            
            {/* Result Count */}
            <div className="pb-2 text-sm font-medium text-gray-500 ml-auto">
                Found: {filteredPyqs.length}
            </div>
        </div>

        {/* Loading State */}
        {loading && <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}

        {/* Empty State */}
        {!loading && filteredPyqs.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
                <i className="fa-regular fa-folder-open text-4xl mb-3"></i>
                <p>No question papers found for the selected filters.</p>
            </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredPyqs.map((pyq) => (
                <div key={pyq._id} className="bg-white border-[1px] border-gray-200 rounded-lg p-5 drop-shadow-md hover:drop-shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                                <i className="fa-solid fa-file-pdf text-xl"></i>
                            </div>
                            <div>
                                <p className="font-semibold text-lg line-clamp-1" title={pyq.subject.name}>{pyq.subject.name}</p>
                                <p className="text-xs text-gray-500">{pyq.subject.code}</p>
                            </div>
                        </div>
                        
                        <h3 className="font-medium text-gray-800 mb-1">{pyq.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                             <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">Year: {pyq.year}</span>
                             <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">Sem: {pyq.semester}</span>
                             <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md font-medium">{pyq.branch}</span>
                        </div>
                    </div>

                    <a 
                        href={pyq.file.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-6 w-full text-center py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-download"></i> View / Download
                    </a>
                </div>
            ))}
        </div>
    </div>
  )
}