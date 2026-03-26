import { useNavigate, useParams } from "react-router-dom"
import Editor from '@monaco-editor/react'
import { useEffect, useRef, useState } from "react"
import fetchAlgorithm from "../../utils/fetchAlgorithm"
import './style.css'
import { StudentAssignment, assignmentsApi } from "../../api/assignment"
import { useAppContext } from "../../context/ContextProvider"
import { useCookies } from "react-cookie"
import axios from "axios"

export default function CodeArea() {
    const LANGUAGE_VERSIONS = [
        'python',
        'javascript',
        'typescript',
        'java',
        'c',
        'cpp',
        'csharp',
    ]

    const { problemId } = useParams()
    const context = useAppContext()
    const navigate = useNavigate()
    const [cookies] = useCookies(['user'])

    const [codeVal, setCodeVal] = useState<string | undefined>('')
    const editorRef = useRef<any>(null)
    const [selectLanguage, setSelectLanguage] = useState<boolean>(false)
    const [language, setLanguage] = useState<string>('python')
    const [output, setOutput] = useState<string>('')
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    // AI Algo states
    const [generatedAlgoContent, setGeneratedAlgoContent] = useState<string | undefined>()
    const [algoLoader, setAlgoLoader] = useState<boolean>(false)

    const [assignment, setAssignment] = useState<StudentAssignment | undefined>(undefined)

    useEffect(() => {
        // Try to find assignment in context, otherwise it might be empty if reloaded directly
        // Ideally we should fetch if not found, but using context for now as per flow
        const found = context?.assignments?.find((a: StudentAssignment) => a._id === problemId)
        setAssignment(found)
        if (found?.language && found.language !== 'any') {
            setLanguage(found.language)
        }
        
        // Set default boilerplate if needed and if codeVal is empty
        if (!codeVal) {
             setCodeVal(found?.language === 'python' ? '# Write your python code here\n' : '// Write your code here\n')
        }
    }, [problemId, context?.assignments])

    const onMount = (editor: any) => {
        editorRef.current = editor
        editor.focus()
    }

    const runCode = async () => {
        if (!codeVal) return
        setIsRunning(true)
        setOutput("Running...")

        const pistonLangMap: Record<string, { language: string, version: string }> = {
            'python': { language: 'python', version: '3.10.0' },
            'javascript': { language: 'javascript', version: '18.15.0' },
            'typescript': { language: 'typescript', version: '5.0.3' },
            'java': { language: 'java', version: '15.0.2' },
            'c': { language: 'c', version: '10.2.0' },
            'cpp': { language: 'c++', version: '10.2.0' },
            'csharp': { language: 'csharp', version: '6.12.0' },
        }

        const langConfig = pistonLangMap[language] || pistonLangMap['python']

        try {
            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: langConfig.language,
                version: langConfig.version,
                files: [
                    { content: codeVal }
                ]
            })

            const { run } = response.data
            setOutput(run.output || (run.stderr ? `Error: ${run.stderr}` : 'No Output'))
        } catch (error: any) {
            console.error("Execution error:", error)
            setOutput("Failed to execute code. Please check connection.")
        } finally {
            setIsRunning(false)
        }
    }

    const handleSubmit = async () => {
        if (!assignment || !cookies.user || !codeVal) return
        setIsSubmitting(true)

        try {
            const response = await assignmentsApi.submitAssignment({
                studentId: cookies.user.id,
                assignmentId: assignment._id,
                submissionData: codeVal
            })

            if (response.success) {
                alert("Code submitted successfully!")
                navigate(-1)
            }
        } catch (error) {
            console.error(error)
            alert("Failed to submit code.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const generateAlgorithm = async(): Promise<void> => {
        if(!assignment) return
        setAlgoLoader(true)
        const response = await fetchAlgorithm(assignment.title, assignment.description)
        setGeneratedAlgoContent(response)
        setAlgoLoader(false)
    }

    function formatMarkdownToHTML(input: string): string {
        input = input.replace(/^##\s+(.+)$/m, '<h2 className="text-lg md:text-2xl">$1</h2>');
        input = input.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        input = input.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
        input = input.replace(/(<li>.*<\/li>\n)+/g, '<ol>$&</ol>');
        input = input.replace(/^\*\s+(.+)$/gm, '<li>$1</li>');
        input = input.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
        input = input.replace(/^(?!<[uo]l>|<li>|<h2>)(.+)$/gm, '<p>$1</p>');
        input = input.replace(/\n+/g, '\n');
        return input.trim();
    }

  return (
    // FIX: Changed h-full to h-screen to ensure full height on standalone route
    <div className="w-full flex font-inter gap-5 items-start justify-start p-5 bg-[#f4f4f4] h-screen overflow-hidden">
        
        {/* Left Side: Details & AI */}
        <div className="flex flex-col items-start justify-start p-5 drop-shadow-lg bg-white rounded-lg w-[40%] h-full gap-5 overflow-hidden">
            <div className="flex flex-col items-start justify-start w-full h-[60%] overflow-hidden">
                    <div className="flex gap-5 items-center text-xs md:text-sm justify-start mb-5 w-full border-b-[0.5px] border-gray-300 pb-4 flex-shrink-0">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-all"><i className="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;Back</button>
                        
                        <p className="font-medium">Subject : <span className="p-1 rounded-md bg-green-100">{assignment?.subject.name}</span></p>
                        <p className="font-medium">Code : <span className="p-1 rounded-md bg-green-100">{assignment?.subject.code}</span></p>
                    </div>

                    <div className="flex flex-col items-start justify-start w-full h-full overflow-y-auto pr-2">
                        <h3 className="text-lg md:text-xl font-semibold">Problem statement</h3>
                        <h3 className="font-medium text-gray-800">{assignment?.title}</h3>

                        <p className="text-xs md:text-sm text-gray-700 mt-5">Due date : {assignment && new Date(assignment.dueDate).toLocaleDateString()}</p>

                        <p className="font-semibold mt-5">Description</p>
                        <p className="text-gray-800 whitespace-pre-wrap">{assignment?.description}</p>
                    </div>
            </div>

            <div className="flex flex-col items-start justify-start w-full h-[40%] overflow-hidden p-3 rounded-lg bg-green-50 border-2 border-green-500">
                <p className="font-semibold text-lg flex-shrink-0">AI Algorithm Helper</p>
                <p className="text-xs text-gray-600 flex-shrink-0 mb-2">Generates explanation only, no code.</p>

                <div className={`flex flex-col ${generatedAlgoContent ? 'items-start justify-start' : 'items-center justify-center'} w-full p-2 rounded-md bg-gray-900 h-full overflow-y-auto`}>
                    {!algoLoader ? <button onClick={generateAlgorithm} className={`${generatedAlgoContent ? 'hidden' : 'block'} px-4 py-2 text-xs md:text-sm bg-green-500 text-white font-semibold rounded-md`}> Generate Algorithm
                    </button> : <div className="lds-ring text-white"><div></div><div></div><div></div><div></div></div> }

                    {generatedAlgoContent && 
                        <div className="flex flex-col items-start justify-start gap-3 w-full">
                            <pre className="max-w-full whitespace-pre-wrap break-words font-medium text-gray-300 font-inter text-xs md:text-sm" dangerouslySetInnerHTML={{ __html: formatMarkdownToHTML(generatedAlgoContent)}}>    
                            </pre>
                            <button onClick={generateAlgorithm} className={`px-4 py-2 text-xs md:text-sm hover:bg-green-600 bg-green-500 text-white font-semibold rounded-md`}>
                                Re-generate
                            </button>
                        </div>}
                </div>
            </div>
        </div>

        {/* Right Side: Editor & Output */}
        <div className="flex flex-col items-start justify-start p-5 drop-shadow-lg bg-white rounded-lg w-[60%] h-full overflow-hidden">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between w-full mb-3 flex-shrink-0">
                <div className="flex items-center justify-center gap-3">
                    <p className="text-sm font-semibold">Language:</p>

                    <div className="relative">
                        <button onClick={() => setSelectLanguage(prev => !prev)} className="px-3 py-1 text-sm rounded-md bg-gray-100 border border-gray-300 min-w-[120px] text-left flex justify-between items-center">
                            {language}
                            <i className={`ml-2 fa-solid ${selectLanguage ? 'fa-caret-up' : 'fa-caret-down' }`}></i>
                        </button>

                        {selectLanguage && <div className="absolute top-10 left-0 bg-white border border-gray-300 shadow-xl z-50 rounded-md w-full max-h-[200px] overflow-y-auto">
                            {LANGUAGE_VERSIONS.map(lang => (
                                <button key={lang} onClick={() => {
                                    setSelectLanguage(false)
                                    setLanguage(lang)
                                }} className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 capitalize">{lang}</button>
                            ))}
                        </div>}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={runCode} disabled={isRunning} className="text-sm font-semibold px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all flex items-center gap-2">
                        {isRunning ? <span className="animate-spin">↻</span> : <i className="fa-solid fa-play"></i>} Run
                    </button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className="text-sm font-semibold px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-all">
                        {isSubmitting ? 'Submitting...' : 'Submit Code'}
                    </button>
                </div>
            </div>

            {/* Monaco Editor - Added height='100%' and proper containment */}
            <div className="w-full flex-grow border border-gray-300 rounded-md overflow-hidden relative">
                <Editor 
                    onMount={onMount}
                    height="100%"
                    theme="vs-dark"
                    language={language} 
                    value={codeVal}
                    onChange={val => setCodeVal(val)}
                    options={{ 
                        minimap: { enabled: false }, 
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                        automaticLayout: true 
                    }}
                />
            </div>

            {/* Output Console */}
            <div className="w-full h-[180px] mt-3 bg-[#1e1e1e] text-white p-3 rounded-md overflow-hidden flex flex-col flex-shrink-0 border-t-4 border-gray-600">
                <p className="text-gray-400 text-xs mb-1 flex-shrink-0">Console Output:</p>
                <div className="flex-grow overflow-y-auto font-mono text-sm">
                    <pre className="whitespace-pre-wrap">{output}</pre>
                </div>
            </div>
        </div>
    </div>
  )
}