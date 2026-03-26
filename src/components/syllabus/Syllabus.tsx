import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/ContextProvider'
import { syllabusApi } from '../../api/syllabus'
import { useCookies } from 'react-cookie'

export default function Syllabus() {
  const context = useAppContext()
  const [cookies] = useCookies(['user'])
  const [loading, setLoading] = useState<boolean>(false)

  // Constants
  const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8']
  const BRANCHES = ['CE', 'CSE', 'IT', 'ITE', 'ML/AI']
  // Assuming 'Engineering' is the default field, or you can get it from cookie if available
  const FIELD = 'Engineering' 

  // Filter States
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')

  // Initialize filters from User Cookie
  useEffect(() => {
    if (cookies.user) {
        setSelectedBranch(cookies.user.branch || 'CE')
        setSelectedSemester(cookies.user.semester ? cookies.user.semester.toString() : '5')
    }
  }, [cookies.user])

  // Fetch Syllabus when filters change
  useEffect(() => {
    const fetchSyllabus = async () => {
      // Don't fetch until we have initial values
      if (!selectedBranch || !selectedSemester) return;

      setLoading(true)
      try {
        const response = await syllabusApi.getSyllabus({
            field: FIELD, // Using fixed field or dynamic from cookie if you have it
            branch: selectedBranch,
            semester: selectedSemester
        })
        
        if (response.success) {
          context?.setSyllabus(response.data)
        } else {
            context?.setSyllabus([])
        }
      } catch (error) {
        console.error("Failed to fetch Syllabus", error)
        context?.setSyllabus([])
      } finally {
        setLoading(false)
      }
    }

    fetchSyllabus()
  }, [selectedBranch, selectedSemester])

  return (
    <div className='w-full flex flex-col relative items-start justify-start p-5'>
        <p className='text-2xl md:text-3xl font-semibold'>Course Syllabus</p>
        <p className="text-gray-600 mb-6">View and download the syllabus for your academic curriculum.</p>

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
        </div>

        {/* Loading State */}
        {loading && <div className="w-full flex justify-center py-10"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>}

        {/* Empty State */}
        {!loading && (!context?.syllabus || context.syllabus.length === 0) && (
            <div className="w-full flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-gray-500">
                <i className="fa-regular fa-file-pdf text-4xl mb-3"></i>
                <p>No syllabus found for {selectedBranch} - Semester {selectedSemester}.</p>
            </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {context?.syllabus.map((syl) => (
                <div key={syl._id} className="bg-white border-[1px] border-gray-200 rounded-lg p-5 drop-shadow-md hover:drop-shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                <i className="fa-solid fa-book-open text-xl"></i>
                            </div>
                            <div>
                                <p className="font-semibold text-lg">{FIELD}</p>
                                <p className="text-xs text-gray-500 font-medium">Updated: {new Date(syl.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                             <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">{syl.branch}</span>
                             <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">Semester {syl.semester}</span>
                        </div>
                    </div>

                    <a 
                        href={syl.file.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-4 w-full text-center py-3 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                        <i className="fa-solid fa-file-pdf"></i> View Syllabus PDF
                    </a>
                </div>
            ))}
        </div>
    </div>
  )
}