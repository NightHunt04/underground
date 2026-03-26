import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '../../context/ContextProvider'
import { assignmentsApi, StudentAssignment } from '../../api/assignment'
import { useCookies } from 'react-cookie'

export default function DocEditor() {
    const { assignmentId } = useParams()
    const navigate = useNavigate()
    const context = useAppContext()
    const [cookies] = useCookies(['user'])
    const [loading, setLoading] = useState(false)
    const [assignment, setAssignment] = useState<StudentAssignment | undefined>(undefined)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
        ],
        content: '<p>Start writing your assignment here...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[500px]',
            },
        },
    })

    useEffect(() => {
        const found = context?.assignments?.find(a => a._id === assignmentId)
        setAssignment(found)
    }, [assignmentId, context?.assignments])

    const handleSubmit = async () => {
        if (!editor || !assignment || !cookies.user) return
        
        const htmlContent = editor.getHTML()
        setLoading(true)

        try {
            const response = await assignmentsApi.submitAssignment({
                studentId: cookies.user.id,
                assignmentId: assignment._id,
                submissionData: htmlContent
            })

            if (response.success) {
                alert('Assignment Submitted Successfully!')
                navigate(-1) // Go back
            }
        } catch (error) {
            console.error(error)
            alert('Failed to submit assignment')
        } finally {
            setLoading(false)
        }
    }

    if (!editor) {
        return null
    }

    return (
        <div className="w-full flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div>
                    <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 mb-1">
                        <i className="fa-solid fa-arrow-left"></i> Back
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">{assignment?.title || 'Document Editor'}</h2>
                </div>
                <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Submit Assignment'}
                </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-white sticky top-0 z-10">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200 font-bold' : ''}`}
                    title="Bold"
                >
                    <i className="fa-solid fa-bold"></i>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200 italic' : ''}`}
                    title="Italic"
                >
                    <i className="fa-solid fa-italic"></i>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200 underline' : ''}`}
                    title="Underline"
                >
                    <i className="fa-solid fa-underline"></i>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={!editor.can().chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200 line-through' : ''}`}
                    title="Strike"
                >
                    <i className="fa-solid fa-strikethrough"></i>
                </button>
                <div className="w-[1px] h-6 bg-gray-300 mx-1"></div>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
                    title="H1"
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
                    title="H2"
                >
                    H2
                </button>
                <div className="w-[1px] h-6 bg-gray-300 mx-1"></div>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                    title="Bullet List"
                >
                    <i className="fa-solid fa-list-ul"></i>
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                    title="Ordered List"
                >
                    <i className="fa-solid fa-list-ol"></i>
                </button>
            </div>

            {/* Editor Area */}
            <div className="flex-grow overflow-y-auto bg-gray-50 p-6">
                <div className="max-w-[800px] mx-auto bg-white min-h-[800px] shadow-sm border border-gray-200 rounded-sm p-10 cursor-text" onClick={() => editor.chain().focus().run()}>
                    <EditorContent editor={editor} />
                </div>
            </div>
        </div>
    )
}