import { useEffect, useState } from 'react'
import { useAppContext } from '../../context/ContextProvider'
import { announcementApi } from '../../api/announcement'

export default function Announcements() {
  const context = useAppContext()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true)
      try {
        const response = await announcementApi.getAllAnnouncements()
        if (response.success) {
          context?.setAnnouncements(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch announcements", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  return (
    // <div className='w-[80vw] flex flex-col relative items-start justify-start p-5 h-screen overflow-y-auto'>
        <div className='w-full flex flex-col relative items-start justify-start p-5'>

        <p className='text-2xl md:text-3xl font-semibold'>Announcements</p>
        <p className="text-gray-600 mb-8">Stay updated with the latest news and events.</p>

        {loading && <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}

        {!loading && context?.announcements.length === 0 && <p className="text-gray-500">No announcements yet.</p>}

        <div className="w-full flex flex-col gap-6">
            {context?.announcements.map((announce) => (
                <div key={announce._id} className="bg-white rounded-lg border-[1px] border-gray-200 drop-shadow-md overflow-hidden flex flex-col md:flex-row w-full hover:drop-shadow-lg transition-all">
                    {announce.image && (
                        <div className="w-full md:w-[300px] h-[200px] md:h-auto flex-shrink-0 bg-gray-100">
                            <img 
                                src={announce.image.url} 
                                alt={announce.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    
                    <div className="p-6 flex flex-col justify-start items-start w-full">
                        <div className="flex w-full justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-800">{announce.title}</h3>
                            <p className="text-xs text-gray-500 whitespace-nowrap">{formatDate(announce.createdAt)}</p>
                        </div>
                        
                        <p className="mt-3 text-gray-600 text-sm md:text-base leading-relaxed">
                            {announce.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}