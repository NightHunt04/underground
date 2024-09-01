import { useNavigate } from "react-router-dom"
import Editor from '@monaco-editor/react'
import { useRef, useState } from "react"
import fetchAlgorithm from "../../utils/fetchAlgorithm"
import './style.css'

export default function CodeArea() {
    const LANGUAGE_VERSIONS = [
        'javascript',
        'typescript',
        'python',
        'java',
        'csharp',
        'c',
        'cpp',
        'html',
        'css'
    ]

    const PROBLEM = {
        subject: 'Programming with Python',
        code: 'SECE1234',
        statement: 'Addtion of variable in Python',
        question: 'Write a python program to add two variables and print its output. \n\nInput 1 \n10, 20 \n\nOutput \n30 \n\nInput 2 \n5, 10 \n\nOutput 2 \n15',
        lang: 'python',
        testcases: '',
        dueDate: '12:00 PM, 13 August, 2024',
        defaultComment: '# write the code below'
    }

    const [codeVal, setCodeVal] = useState<string | undefined>('')
    const editorRef = useRef()
    const navigate = useNavigate()
    const [selectLanguage, setSelectLanguage] = useState<boolean>(false)
    const [language, setLanguage] = useState<string>(PROBLEM.lang)

    const [isGenerated, setIsGenerated] = useState<number>(0)
    const [generatedAlgoContent, setGeneratedAlgoContent] = useState<string | undefined>()
    const [loader, setLoader] = useState<boolean>(false)

    const onMount = (editor: any) => {
        console.log(editor)
        editorRef.current = editor
        editor.focus()
    }

    // take the id from params and fetch the problem from backend
    
    const generateAlgorithm = async(): Promise<void> => {
        setLoader(true)
        setIsGenerated(1)

        const response = await fetchAlgorithm(PROBLEM.statement, PROBLEM.question)

        setGeneratedAlgoContent(response)
        setLoader(false)
    }

    function formatMarkdownToHTML(input: string): string {
        // Replace header
        input = input.replace(/^##\s+(.+)$/m, '<h2 className="text-lg md:text-2xl">$1</h2>');
      
        // Replace bold text
        input = input.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      
        // Replace numbered list
        input = input.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
        input = input.replace(/(<li>.*<\/li>\n)+/g, '<ol>$&</ol>');
      
        // Replace unordered list
        input = input.replace(/^\*\s+(.+)$/gm, '<li>$1</li>');
        input = input.replace(/(<li>.*<\/li>\n)+/g, '<ul>$&</ul>');
      
        // Replace paragraphs
        input = input.replace(/^(?!<[uo]l>|<li>|<h2>)(.+)$/gm, '<p>$1</p>');
      
        // Remove extra newlines
        input = input.replace(/\n+/g, '\n');
      
        return input.trim();
      }

  return (
    <div className="w-full flex font-inter gap-5 items-start justify-start p-5 bg-[#f4f4f4]">
        <div className="flex flex-col items-start justify-start p-10 drop-shadow-lg bg-white rounded-lg w-[50%] h-[96vh] gap-5">
            <div className="flex flex-col items-start justify-start w-full h-[60%]">
                    <div className="flex gap-5 items-center text-xs md:text-sm justify-start mb-5 w-full border-b-[0.5px] border-gray-300 pb-6">
                        <button onClick={() => navigate(-1)} className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-all"><i className="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;Go back</button>
                        
                        <p className="font-medium">Subject : <span className="p-1 rounded-md bg-green-100">{PROBLEM.subject}</span></p>
                        <p className="font-medium">Code : <span className="p-1 rounded-md bg-green-100">{PROBLEM.code}</span></p>
                    </div>

                    <div className="flex flex-col items-start justify-start w-full h-full overflow-y-auto">
                        <h3 className="text-lg md:text-xl font-semibold">Problem statement</h3>
                        <h3 className="font-medium text-gray-800">{PROBLEM.statement}</h3>

                        <p className="text-xs md:text-sm text-gray-700 mt-5">Due date : {PROBLEM.dueDate}</p>

                        <p className="font-semibold mt-5">Description</p>
                        <p className="text-gray-800"><pre>{PROBLEM.question}</pre></p>
                    </div>
            </div>

            <div className="flex flex-col items-start justify-start w-full h-[40%] overflow-y-auto p-2 rounded-lg bg-green-100 border-2 border-green-500">
                <p className="font-semibold text-lg">Use AI for understanding the problem and algorithm</p>
                <p className="text-xs md:text-sm text-gray-600">It will only generate content to explain the problem and algorithm only, no code will be provided</p>

                <div className={`flex flex-col ${generatedAlgoContent ? 'items-start justify-start' : 'items-center justify-center'} w-full p-2 rounded-md bg-gray-900 h-full overflow-y-auto`}>
                    {!loader ? <button onClick={generateAlgorithm} className={`${generatedAlgoContent ? 'hidden' : 'block'} px-4 py-2 text-xs md:text-sm bg-green-500 text-white font-semibold rounded-md`}> Generate
                    </button>:                             <div className="lds-ring text-white"><div></div><div></div><div></div><div></div></div>                }

                    {generatedAlgoContent && 
                        <div className="flex flex-col items-start justify-start gap-3 w-full h-full overflow-y-auto">
                            <pre className="max-w-full whitespace-pre-wrap break-words font-medium text-gray-300 font-inter" dangerouslySetInnerHTML={{ __html: formatMarkdownToHTML(generatedAlgoContent)}}>    
                            </pre>
                            <button onClick={generateAlgorithm} className={`px-4 py-2 text-xs md:text-sm hover:bg-green-600 bg-green-500 text-white font-semibold rounded-md`}>
                                Re-generate
                                {/* {loader ? 
                                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>:
                                <p>Re-Generate</p>}  */}
                            </button>
                        </div>}

                </div>
            </div>
        </div>


        <div className="flex flex-col items-start justify-start p-10 drop-shadow-lg bg-white rounded-lg w-[50%] h-[96vh]">
            <div className="flex items-center justify-between w-full mb-5">
                <div className="flex items-center justify-center gap-3">
                    <p>Select language : </p>

                    <div className="flex flex-col items-center justify-center relative">
                        <p onClick={() => setSelectLanguage(prev => !prev)} className="px-3 py-1 rounded-md hover:bg-gray-300 transition-all duration-200 shadow-md border-2 border-gray-400 hover:cursor-pointer bg-gray-200">{language}<span><i className={`ml-2 fa-solid ${selectLanguage ? 'fa-caret-up' : 'fa-caret-down' }`}></i></span></p>

                        {selectLanguage && <div className="absolute px-4 py-3 bg-[#ececec] -bottom-[390px] flex flex-col items-start justify-start mt-1 drop-shadow-lg z-20 rounded-lg">
                            {LANGUAGE_VERSIONS.map(lang => {
                                return (
                                    <button onClick={() => {
                                        setSelectLanguage(false)
                                        setLanguage(lang)
                                    }} className="p-2 ">{lang}</button>
                                )
                            })}
                        </div>}
                    </div>
                </div>

                <button className="text-xs md:text-sm flex items-center justify-center font-semibold px-4 py-3 rounded-md bg-green-100 border-2 text-gray-700 border-green-500 gap-2 drop-shadow-lg hover:bg-green-200 transition-all duration-200"><i className="fa-solid fa-play"></i>Run</button>
            </div>
            <Editor 
                onMount={onMount}
                height='82vh'
                theme="vs-dark"
                language={language} 
                defaultValue={PROBLEM.defaultComment}
                value={codeVal}
                onChange={val => setCodeVal(val)}/>
        </div>
    </div>
  )
}
