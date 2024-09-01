import { useCallback, useState } from 'react'
import { SUBJECTS_INFO } from '../../CONSTANTS/CONSTANTS'
import fetchContentForTopic from '../../utils/fetchContentForTopic'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import fetchDoubt from '../../utils/fetchDoubt';
import './style.css'
import fetchSuggestedQues from '../../utils/fetchSuggestedQues';
import fetchTranslateConntent from '../../utils/fetchTranslateContent';
import fetchScrapURL from '../../utils/fetchScrapURL';

// import { Document, Packer, Paragraph, TextRun } from 'docx';
// import { saveAs } from 'file-saver';


interface Props {
    selectSubjectIndex: number
    selectSubjectTopicIndex: number
    setSelectSubjectTopicIndex: React.Dispatch<React.SetStateAction<number>>
}

interface SuggestedQues {
    response: string[] 
}

interface TranslateResponse {
    detected: string,
    translatedTitle: string,
    translatedContent: string
}

interface URLResponse {
    description: string,
    position: number,
    title: string,
    url: string
}

export default function SelectedTopic({ selectSubjectIndex, selectSubjectTopicIndex, setSelectSubjectTopicIndex }: Props) {
    let counter = 0
    const [startToLearn, setStartToLearn] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [topicIndex, setTopicIndex] = useState<number>(0)
    
    const [contentData, setContentData] = useState<string[][] | undefined>()
    const [suggestedQues, setSuggestedQues] = useState<SuggestedQues | string>('')

    const [finished, setFinished] = useState<boolean>(false)

    const [doubt, setDoubt] = useState<string>('')
    const [doubtAnswer, setDoubtAnswer] = useState<string>('')
    const [doubtLoader, setDoubtLoader] = useState<boolean>(false)

    const [translateIndex, setTranslateIndex] = useState<number>(-1)
    const [translateLoader, setTranslateLoader] = useState<boolean>(false)

    const [urlData, setUrlData] = useState<URLResponse[] | string>('')
    const [urlLoader, setUrlLoader] = useState<boolean>(false)

    const handleStartToLearn = () => {
        setStartToLearn(true)
        setDoubt('')
        setDoubtLoader(false)
        setDoubtAnswer('')
        generateContentForTopic()
    }

    const generateSuggestedQuestions = async (title: string, content: string): Promise<void> => {
        let response
        
        while (1) {
            response = await fetchSuggestedQues(title, content)
            try {
                response = JSON.parse(response)
                break
            } catch(err) {
                continue
            }
        }
        setSuggestedQues(response)
        console.log(response)
    }

    function formatText(text: string): string {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>\n') 
            .replace(/\*/g, '').trim()              
    }

    const generateContentForTopic = useCallback(async (): Promise<void> => {
        const title = SUBJECTS_INFO[selectSubjectIndex].syllabus ? SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].title : ''
        const statement = SUBJECTS_INFO[selectSubjectIndex].syllabus ? SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].content[topicIndex] : ''

        if (!statement) {
            counter = 0
            setFinished(true)
            return
        } else {
            console.log('title', title)
            console.log('statement', statement)

            setLoader(true)
            let response = ''
            let result: { response: string[]; }

            setUrlData('')

            while (1) {
                console.log('trying')
                response = (await fetchContentForTopic(title, statement)).trim()

                try {
                    result = JSON.parse(response)

                    setContentData(prev => [...(prev || []), [ ...result.response]])
                    setTopicIndex(prev => prev + 1)
                    setLoader(false)

                    generateSuggestedQuestions(result.response[0], result.response[1])
                    counter++
                    break
                } catch(err) {
                    continue
                }
            }
        }
    }, [topicIndex])

    const handleDoubt = useCallback(async (doubt: string) => {
        const title = contentData ? contentData[contentData?.length - 1][0] : ''
        const content = contentData ? contentData[contentData.length - 1][1] : ''

        if (title && content) {
            setDoubtLoader(true)
            try {   
                const response = await fetchDoubt(title, content, doubt)
                setDoubtAnswer(response)
            } catch(err) {
                console.error(err)
                setDoubtAnswer('Something went wrong!')
            }
            setDoubtLoader(false)
        }
    }, [contentData])

    const handleSuggestedQuesCLick = async (doubt: string): Promise<void> => {
        const title = contentData ? contentData[contentData?.length - 1][0] : ''
        const content = contentData ? contentData[contentData.length - 1][1] : ''
        
        if (title && content) {
            setDoubtLoader(true)
            try {   
                const response = await fetchDoubt(title, content, doubt)
                setDoubtAnswer(response)
            } catch(err) {
                console.error(err)
                setDoubtAnswer('Something went wrong!')
            }
            setDoubt(doubt)
            setDoubtLoader(false)
        }
    } 

    const handleTranslateCLicked = (index: number): void => {
        if (translateIndex === index)
            setTranslateIndex(-1)
        else setTranslateIndex(index)
    }

    const handleTranslateContent = async (lang: string, ind: number): Promise<void> => {
        setTranslateLoader(true)
        const title = contentData && contentData[ind][0]
        const content = contentData && contentData[ind][1]

        const response: TranslateResponse | string | undefined = await fetchTranslateConntent(lang, title!, content!)
        console.log('translate', response)

        if (response && typeof response !== 'string') {
            if (lang !== response.detected) 
                setContentData(prev => prev?.map((content, index: number) => index === ind ? [response.translatedTitle, response.translatedContent, content[2]] : content))
        }

        setTranslateLoader(false)
    }

    const handleScrapURL = async (): Promise<void> => {
        setUrlLoader(true)

        const title = SUBJECTS_INFO[selectSubjectIndex].syllabus ? SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].title : ''
        const statement = SUBJECTS_INFO[selectSubjectIndex].syllabus ? SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].content[topicIndex - 1] : ''

        console.log('title', title)
        console.log('statement', statement)

        let response = await fetchScrapURL(title, statement)

        console.log('res', response)

        setUrlData(response)
        setUrlLoader(false)
    }

  return (
    <div className='relative mt-5 flex flex-col items-start justify-start w-[80%] bg-white drop-shadow-lg rounded-lg p-5 gap-2'>
        <button onClick={() => { setSelectSubjectTopicIndex(-1) }} className="px-3 py-2 text-xs md:text-sm bg-red-500 text-white font-semibold rounded-md absolute right-3 top-3 drop-shadow-md hover:opacity-80 transition-all">Cancel</button>

        <p className='font-semibold'>Selected topic</p>
        <p className='font-sm text-gray-700'>Subject name: <span className='p-1 bg-green-100 font-semibold rounded-md'>{SUBJECTS_INFO[selectSubjectIndex].name}</span></p>

        <div className='mt-10 font-semibold gap-3 flex items-center justify-start'>
            <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>2</div>
            <p className='text-lg md:text-xl'>Start to learn about the topics with the help of generative content 🎉</p>
        </div> 
        
        <p className='mt-10 font-semibold text-xl'>Title: {SUBJECTS_INFO[selectSubjectIndex].syllabus && SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].title}</p>
        <p>Topic to be covered</p>

        {/* topics of the selected chapter */}
        <div className='flex flex-col ietms-start justify-start p-2'>
            {SUBJECTS_INFO[selectSubjectIndex].syllabus && SUBJECTS_INFO[selectSubjectIndex].syllabus[selectSubjectTopicIndex].content.map((item, index: number) => {
                return (
                    <p key={index} className='text-sm text-gray-600 font-medium'>- {item}</p>
                )
            })}
        </div>

        {!startToLearn && <p className='mt-10 text-gray-600'>Start the learning flow</p>}

        {/* generated content */}
        {contentData && contentData.length > 0 && 
            <div className='p-2'>
                {contentData?.map((content, index: number) => {
                    return (
                        <div key={index} className='relative flex flex-col items-start justify-start mt-8 mb-20 w-full'>
                            <div onClick={() => handleTranslateCLicked(index)} className='flex flex-col items-center absolute right-0 text-xs md:text-sm -top-8'>
                                <div className='flex items-center justify-center gap-2 hover:bg-blue-600 transition-all font-semibold bg-blue-500 text-white px-6 py-2 drop-shadow-lg rounded-lg hover:cursor-pointer'>
                                    {!translateLoader ? 
                                        <div className='flex items-center justify-center gap-2'>
                                            <i className="text-base fa-solid fa-language"></i>
                                            <p>Translate</p>
                                        </div>:
                                        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
                                </div>

                                {translateIndex === index && 
                                    <div className='mt-3 p-3 text-gray-900 z-10 font-medium rounded-lg bg-gray-100 drop-shadow-lg flex flex-col items-start justify-start w-full'>
                                        <button onClick={() => handleTranslateContent('english', index)} className='hover:bg-gray-200 border-[1px] border-gray-400 w-full rounded-md p-2'>English</button>
                                        <button onClick={() => handleTranslateContent('gujarati', index)} className='hover:bg-gray-200 border-[1px] border-gray-400 w-full rounded-md p-2 mt-2'>Gujarati</button>
                                        <button onClick={() => handleTranslateContent('hindi', index)} className='hover:bg-gray-200 border-[1px] border-gray-400 w-full rounded-md p-2 mt-2'>Hindi</button>
                                    </div>}
                            </div>

                            <p className='font-semibold text-xl md:text-2xl'>{content[0]}</p>
                            <pre className="max-w-full whitespace-pre-wrap break-words font-medium text-gray-700  font-inter overflow-x-auto"
                                dangerouslySetInnerHTML={{ __html: formatText(content[1]) }}>
                            </pre>
                            
                            {content[2] && content[2] !== '' && content[2].length !== 0 && <div className='mt-5 w-full'>
                                    <SyntaxHighlighter className="rounded-md" language={SUBJECTS_INFO[selectSubjectIndex].lang} style={vscDarkPlus}>
                                        { content[2] }
                                    </SyntaxHighlighter>
                                </div>}
                        </div>
                    )
                })}
            </div>}

        {/* refernce urls */}
        {startToLearn && !loader && !finished && 
            <div className='relative p-5 rounded-lg bg-[#f3f3f3] drop-shadow-lg mt-5 mb-8 w-full border-2 border-blue-600'>
                {urlData && <button onClick={() => setUrlData('')} className='p-3 text-xs md:text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all absolute right-2 top-2 rounded-lg z-20 drop-shadow-lg'>Clear</button>}
                
                <p className='font-semibold md:text-lg text-sm'><i className="fa-solid fa-link"></i>&nbsp;Do you want some reference links for this topic? (Ignore if don't want)</p>
                <p className='text-xs md:text-sm text-gray-600 font-medium'>Will return lists of URLs having similar type of content</p>

                {typeof urlData !== 'string' && urlData &&
                        <div className='flex flex-col items-start justify-start w-full mt-5'>
                            {urlData.map((item, index: number) => {
                                return (
                                    <a href={item.url} target='_blank' className='w-full hover:bg-white hover:border-blue-500 bg-gray-100 transition-all drop-shadow-lg border-2 border-gray-400 rounded-lg mt-5'>
                                        <div key={index} className='font-semibold text-gray-700 flex flex-col items-start justify-start w-full p-5'>
                                            <div className='flex items-start justify-start w-full gap-3'>
                                                <p className='text-xs md:text-sm text-gray-600 font-medium'>{item.position}</p>
                                                <div className='flex flex-col items-start justify-start w-full'>
                                                    <p>{item.description}</p>
                                                    <p className='text-xs md:text-sm mt-3'>Title: {item.title}</p>
                                                    <p className='text-xs md:text-sm mt-3 p-3 rounded-md bg-blue-100 border-2 w-full border-blue-500 overflow-hidden'>URL : {item.url}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                )
                            })}
                        </div>}

                {!urlData && <button disabled={urlLoader} onClick={handleScrapURL} className='mt-10 p-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-all drop-shadow-lg'>Yes, I need some reference links</button>}

                {urlLoader && <div className='flex items-center justify-center w-full mt-8'><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>}
            </div>}

        {/* doubt solver */}
        {startToLearn && !loader && !finished && 
            <div className='p-5 rounded-lg bg-[#f3f3f3] drop-shadow-lg mt-5 mb-8 w-full border-2 border-blue-600'>
                <p className='font-semibold md:text-lg text-sm'><i className="fa-solid fa-circle-question"></i>&nbsp;&nbsp;Do you have any <span className='text-blue-500'>doubts</span> in the above topic ?</p>
                <p className='text-xs md:text-sm text-gray-600 font-medium'>If you have any doubts then ask your doubt in below text field in formal manner</p>
                <p className='text-xs md:text-sm text-gray-600 mt-5'><span className='text-red-500 font-medium'>Note:</span> The doubt must be a doubt, not other than a doubt</p>

                {suggestedQues && 
                    <div>
                        <p className='font-semibold mt-8'>AI Suggested questions</p>
                        {typeof suggestedQues !== 'string' && suggestedQues.response.map((ques: string, index: number) => <button onClick={() => handleSuggestedQuesCLick(ques)} key={index} className='hover:bg-green-200 transition-all w-full text-left dont-medium mt-4 p-2 rounded-lg bg-green-100 border-2 border-green-500'>{ques}</button>)}
                    </div>}

                {doubtAnswer && doubtAnswer !== '' && 
                    <div className='flex flex-col items-start font-medium justify-start w-full my-5'>
                        <p>Q. {doubt}</p>
                        <pre className='max-w-full whitespace-pre-wrap break-words font-inter text-xs mt-1 text-gray-800 bg-green-100 p-2 rounded-md border-2 border-green-500 md:text-sm' dangerouslySetInnerHTML={{__html : formatText(doubtAnswer)}}></pre>
                    </div>}

                <div className='flex items-center justify-center gap-2 w-full mt-5'>
                    <input 
                        type="text" 
                        value={doubt}
                        onChange={e => setDoubt(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter')
                                handleDoubt(doubt)
                        }}
                        placeholder='Write your doubts here'
                        className='w-full px-5 py-3 rounded-md border-2 border-gray-300 outline-none focus:border-blue-500'/>
                    <button onClick={() => handleDoubt(doubt)} className='px-5 py-3 font-semibold rounded-md w-[10%] bg-green-500 text-white'>
                        {!doubtLoader ? 
                            <p>Ask</p>:
                            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
                    </button>
                </div>
            </div>}

        {/* next or continue button */}
        <button onClick={handleStartToLearn} className={`${loader || finished ? 'hidden' : 'flex'} items-center justify-center px-10 py-3 text-sm rounded-lg bg-green-500 text-white font-semibold drop-shadow-lg hover:bg-green-600 transition-all`}>
            {contentData && contentData.length > 0 ? <p>Continue &nbsp;</p> : <p>Start &nbsp;</p>}
            <i className="fa-solid fa-play"></i>
        </button>

        {finished && <p className='text-green-500'>You completed this topic!</p>}
        
        {loader && <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
    </div>
  )
}
