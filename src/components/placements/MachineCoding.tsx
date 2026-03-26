import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Editor from '@monaco-editor/react';
import fetchRoleChecker from "../../utils/fetchRoleChecker";
import fetchMachineCoding from "../../utils/fetchMachineCoding";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box, Stack } from '@mui/material';

interface RoleCheckResponse {
    isValid: number;
}

interface QuestionData {
    title: string;
    description: string;
    constraints: string;
    examples: { input: string; output: string }[];
    boilerplate?: string;
}

interface EvaluationData {
    feedback: string;
    scores: {
        correctness: number;
        efficiency: number;
        codeStyle: number;
        overall: number;
    };
    betterApproach: string;
}

export default function MachineCoding() {
    const navigate = useNavigate();

    // Setup State
    const [role, setRole] = useState<string>('');
    const [skills, setSkills] = useState<string>('');
    const [confirmedRole, setConfirmedRole] = useState<boolean>(false);
    const [loader, setLoader] = useState<boolean>(false);
    const [roleError, setRoleError] = useState<boolean>(false);

    // Test State
    const [question, setQuestion] = useState<QuestionData | null>(null);
    const [userCode, setUserCode] = useState<string>('// Write your solution here...');
    const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
    const [history, setHistory] = useState<EvaluationData[]>([]);
    const [stopTest, setStopTest] = useState<boolean>(false);
    
    // Editor State
    const [language, setLanguage] = useState<string>('javascript');
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const editorRef = useRef<any>(null);

    const LANGUAGE_OPTIONS = ['javascript', 'python', 'java', 'cpp', 'csharp'];

    // 1. Validate Role
    const handleStart = async () => {
        if (!role || !skills) return;
        setLoader(true);
        setRoleError(false);

        try {
            const checkRes = await fetchRoleChecker(role, skills);
            const parsedCheck = JSON.parse(checkRes) as RoleCheckResponse;

            if (parsedCheck.isValid) {
                setConfirmedRole(true);
                await generateQuestion();
            } else {
                setRoleError(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoader(false);
        }
    };

    // 2. Generate Question
    const generateQuestion = async () => {
        setLoader(true);
        setEvaluation(null); // Clear previous evaluation
        
        // Scroll to top when new question loads
        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
            const response = await fetchMachineCoding('generate', { role, skills });
            const parsedQuestion = JSON.parse(response) as QuestionData;
            setQuestion(parsedQuestion);
            setUserCode(parsedQuestion.boilerplate || '// Write your solution here...');
        } catch (error) {
            console.error("Failed to gen question", error);
        } finally {
            setLoader(false);
        }
    };

    // 3. Submit Code
    const handleSubmit = async () => {
        if (!question || !userCode) return;
        setLoader(true);

        try {
            const response = await fetchMachineCoding('evaluate', { 
                question: JSON.stringify(question),
                userCode,
                language
            });
            const parsedEval = JSON.parse(response) as EvaluationData;
            
            setEvaluation(parsedEval);
            setHistory(prev => [...prev, parsedEval]);
            
            // Scroll to feedback
            setTimeout(() => {
                const feedbackElement = document.getElementById('feedback-section');
                if (feedbackElement) feedbackElement.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (error) {
            console.error("Evaluation failed", error);
        } finally {
            setLoader(false);
        }
    };

    const handleNextQuestion = () => {
        generateQuestion();
    };

    const handleStopTest = () => {
        setStopTest(true);
        setQuestion(null); // Clear view to show results
    };

    // Helper to parse Markdown-like syntax from LLM
    const parseMarkdown = (text: string) => {
        if (!text) return { __html: '' };
        
        let formatted = text
            // Bold (**text**) -> <strong>
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-blue-200">$1</strong>')
            // Italic (*text*) -> <em>
            .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
            // Code blocks with optional language (```html ... ```) -> <div>
            // We use a different shade (bg-[#111]) to contrast with the Example container (#1e1e1e)
            .replace(/```(\w+)?\s*([\s\S]*?)```/g, 
                '<div class="bg-[#111] border border-gray-700 text-gray-300 p-4 rounded-md my-3 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner relative"><span class="absolute top-1 right-2 text-[10px] uppercase text-gray-600 select-none">$1</span>$2</div>')
            // Inline code (`...`) -> <code>
            .replace(/`([^`]+)`/g, '<code class="bg-[#2d2d2d] px-1.5 py-0.5 rounded text-yellow-500 font-mono text-sm border border-gray-700">$1</code>')
            // Bullet points (- text) at start of line
            .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc marker:text-gray-500">$1</li>')
            // Numbered lists (1. text) at start of line
            .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal marker:text-gray-500">$1</li>')
            // Newlines -> <br>
            .replace(/\n/g, '<br />');

        return { __html: formatted };
    };

    // Standard markdown parser for description (Light theme context)
    const parseDescriptionMarkdown = (text: string) => {
        if (!text) return { __html: '' };
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
            .replace(/```(\w+)?\s*([\s\S]*?)```/g, '<div class="bg-gray-800 text-white p-4 rounded-md my-3 font-mono text-sm overflow-x-auto">$2</div>')
            .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-red-600 font-mono text-sm border border-gray-200">$1</code>')
            .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
            .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
            .replace(/\n/g, '<br />');
        return { __html: formatted };
    };

    return (
        <div className="w-full flex flex-col items-start justify-start gap-5 mb-20">
            
            {/* --- PHASE 1: INPUT ROLE --- */}
            {!confirmedRole && (
                <div className="relative flex flex-col items-start justify-start p-8 bg-white drop-shadow-lg rounded-lg w-full transition-all">
                    <button onClick={() => navigate('../')} className="absolute right-4 top-4 text-gray-500 hover:text-red-500 transition-colors">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>

                    <div className='font-semibold gap-3 flex items-center justify-start mb-8'>
                        <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>1</div>
                        <p className='text-lg md:text-xl'>Setup Machine Coding Environment</p>
                    </div>

                    <div className="w-full md:w-[70%] flex flex-col gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Target Job Role</label>
                            <input 
                                type="text"
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                placeholder="e.g. Frontend Developer, Data Scientist"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Technical Skills</label>
                            <input 
                                type="text"
                                value={skills}
                                onChange={e => setSkills(e.target.value)}
                                placeholder="e.g. React, Node.js, Python, Algorithms"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 bg-gray-50"
                            />
                        </div>

                        {roleError && <p className="text-red-500 text-sm font-medium">Invalid role or skills combination. Please verify.</p>}

                        <button 
                            onClick={handleStart} 
                            disabled={loader || !role || !skills}
                            className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loader ? <div className="lds-ring"><div></div><div></div><div></div><div></div></div> : 'Start Test'}
                        </button>
                    </div>
                </div>
            )}

            {/* --- PHASE 2: TEST INTERFACE (Vertical Layout) --- */}
            {confirmedRole && !stopTest && (
                <div className="w-full flex flex-col gap-8 max-w-[95%] mx-auto">
                    
                    {/* Header Controls */}
                    <div className="w-full flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200 sticky top-0 z-20">
                        <div>
                            <h2 className="font-bold text-xl text-gray-800">Machine Coding Round</h2>
                            <p className="text-xs text-gray-500">Role: {role}</p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-md border">
                                <span className="text-sm font-medium text-gray-600">Language:</span>
                                <select 
                                    value={language} 
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-transparent text-sm font-semibold text-gray-800 outline-none capitalize cursor-pointer"
                                >
                                    {LANGUAGE_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>
                            <button onClick={handleStopTest} className="px-4 py-2 bg-red-50 text-red-600 rounded-md font-semibold text-sm hover:bg-red-100 transition-colors border border-red-200">End Test</button>
                        </div>
                    </div>

                    {question ? (
                        <>
                            {/* SECTION 1: QUESTION */}
                            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{question.title}</h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Problem Statement</span>
                                </div>
                                
                                {/* Parsed Markdown Description */}
                                <div 
                                    className="text-gray-700 text-lg leading-relaxed mb-6"
                                    dangerouslySetInnerHTML={parseDescriptionMarkdown(question.description)}
                                />
                                
                                <div className="mt-8 bg-gray-50 p-5 rounded-lg border border-gray-200">
                                    <p className="font-bold text-sm uppercase text-gray-500 mb-3 tracking-wider">Constraints & Requirements</p>
                                    <div 
                                        className="text-gray-800 font-medium"
                                        dangerouslySetInnerHTML={parseDescriptionMarkdown(question.constraints)}
                                    />
                                </div>

                                {/* Full Width Examples Stack */}
                                <div className="mt-6 flex flex-col gap-6 w-full">
                                    {question.examples.map((ex, idx) => (
                                        <div key={idx} className="w-full bg-[#1e1e1e] text-white p-6 rounded-lg shadow-md border border-gray-700 font-mono text-sm">
                                            <div className="mb-4 border-b border-gray-700 pb-2 text-gray-400 text-xs uppercase tracking-wide font-bold">Example {idx + 1}</div>
                                            
                                            <div className="mb-6">
                                                <span className="text-green-400 font-bold block mb-2 uppercase text-xs tracking-wider">Input</span>
                                                <div 
                                                    className="opacity-90 leading-relaxed pl-2 border-l-2 border-green-500/30" 
                                                    dangerouslySetInnerHTML={parseMarkdown(ex.input)} 
                                                />
                                            </div>

                                            <div>
                                                <span className="text-blue-400 font-bold block mb-2 uppercase text-xs tracking-wider">Output</span>
                                                <div 
                                                    className="opacity-90 leading-relaxed pl-2 border-l-2 border-blue-500/30" 
                                                    dangerouslySetInnerHTML={parseMarkdown(ex.output)} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* SECTION 2: FEEDBACK (Only shows after submission) */}
                            {evaluation && (
                                <div id="feedback-section" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-8 border-blue-600 p-8 rounded-r-xl shadow-md animate-fade-in">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-2xl font-bold text-blue-900">Code Analysis</h3>
                                        <button 
                                            onClick={handleNextQuestion} 
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
                                        >
                                            Next Question <i className="fa-solid fa-arrow-right"></i>
                                        </button>
                                    </div>

                                    {/* Parsed Feedback */}
                                    <div 
                                        className="text-gray-800 text-lg mb-6 leading-relaxed"
                                        dangerouslySetInnerHTML={parseDescriptionMarkdown(evaluation.feedback)}
                                    />
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        {[
                                            { label: 'Correctness', val: evaluation.scores.correctness, col: 'text-green-600' },
                                            { label: 'Efficiency', val: evaluation.scores.efficiency, col: 'text-blue-600' },
                                            { label: 'Style', val: evaluation.scores.codeStyle, col: 'text-purple-600' },
                                            { label: 'Overall', val: evaluation.scores.overall, col: 'text-gray-900' }
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-4 rounded-lg shadow-sm text-center border border-gray-100">
                                                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">{item.label}</div>
                                                <div className={`text-3xl font-extrabold mt-1 ${item.col}`}>{item.val}<span className="text-lg text-gray-400">/10</span></div>
                                            </div>
                                        ))}
                                    </div>

                                    {evaluation.betterApproach && (
                                        <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm">
                                            <p className="text-blue-800 font-bold mb-2"><i className="fa-solid fa-lightbulb text-yellow-500 mr-2"></i>Suggestion for Improvement</p>
                                            <div 
                                                className="text-gray-700"
                                                dangerouslySetInnerHTML={parseDescriptionMarkdown(evaluation.betterApproach)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SECTION 3: EDITOR */}
                            <div className="flex flex-col w-full h-[85vh] rounded-xl overflow-hidden shadow-2xl border border-gray-400 bg-[#1e1e1e]">
                                <div className="bg-[#2d2d2d] px-4 py-2 flex justify-between items-center border-b border-[#404040]">
                                    <span className="text-gray-300 text-sm font-medium flex items-center gap-2">
                                        <i className="fa-solid fa-code"></i> Solution Editor ({language})
                                    </span>
                                    {loader && <span className="text-yellow-400 text-xs animate-pulse">Processing submission...</span>}
                                </div>
                                
                                <div className="flex-1 relative">
                                    <Editor
                                        height="100%"
                                        theme="vs-dark"
                                        language={language}
                                        value={userCode}
                                        onChange={(val) => setUserCode(val || '')}
                                        options={{ 
                                            minimap: { enabled: false }, 
                                            fontSize: 16,
                                            padding: { top: 20 },
                                            scrollBeyondLastLine: false,
                                            smoothScrolling: true
                                        }}
                                    />
                                    {loader && !evaluation && (
                                        <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                                            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                                            <p className="mt-4 font-semibold text-lg">Evaluating your code...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-[#2d2d2d] p-4 border-t border-[#404040] flex justify-end">
                                    <button 
                                        onClick={handleSubmit} 
                                        disabled={loader}
                                        className="px-10 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <i className="fa-solid fa-play"></i> Run & Submit
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[50vh]">
                            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                            <p className="mt-4 text-gray-500 font-medium">Generating your interview problem...</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- PHASE 3: RESULTS & ANALYSIS --- */}
            {stopTest && (
                <div className="w-full bg-white p-8 rounded-lg drop-shadow-lg animate-fade-in">
                    <div className='font-semibold gap-3 flex items-center justify-start mb-10'>
                        <div className='w-[30px] h-[30px] rounded-full flex items-center justify-center bg-green-100 border-2 border-green-500 font-semibold'>3</div>
                        <p className='text-lg md:text-xl'>Test Analysis</p>
                    </div>

                    {history.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">No questions attempted.</p>
                    ) : (
                        <div className="flex flex-col gap-16">
                            {/* Line Chart - Progress */}
                            <div className="w-full flex flex-col md:flex-row items-center justify-center gap-10">
                                <div className="w-full md:w-1/2 h-[300px]">
                                    <LineChart
                                        xAxis={[{ data: history.map((_, i) => i + 1), label: 'Question #' }]}
                                        series={[
                                            { data: history.map(h => h.scores.overall), label: 'Overall Score', color: '#16a34a' },
                                            { data: history.map(h => h.scores.correctness), label: 'Correctness', color: '#2563eb' }
                                        ]}
                                        height={300}
                                        margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                                        grid={{ vertical: true, horizontal: true }}
                                    />
                                </div>
                                <div className="w-full md:w-1/3">
                                    <h4 className="text-xl font-bold mb-3">Performance Trend</h4>
                                    <p className="text-gray-600 text-sm">
                                        Your performance across {history.length} questions.
                                        Keep practicing to improve consistency in correctness and code efficiency.
                                    </p>
                                </div>
                            </div>

                            {/* Gauges - Averages */}
                            <div className="w-full">
                                <h4 className="text-center font-bold text-xl mb-8">Average Metrics</h4>
                                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="center">
                                    <MetricGauge 
                                        value={history.reduce((a, b) => a + b.scores.correctness, 0) / history.length} 
                                        label="Avg. Correctness" 
                                        color="#2563eb"
                                    />
                                    <MetricGauge 
                                        value={history.reduce((a, b) => a + b.scores.efficiency, 0) / history.length} 
                                        label="Avg. Efficiency" 
                                        color="#9333ea"
                                    />
                                    <MetricGauge 
                                        value={history.reduce((a, b) => a + b.scores.codeStyle, 0) / history.length} 
                                        label="Avg. Code Style" 
                                        color="#ea580c"
                                    />
                                </Stack>
                            </div>

                            <button 
                                onClick={() => window.location.reload()} 
                                className="mx-auto px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-all"
                            >
                                Start New Test
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Helper Component for Gauges
const MetricGauge = ({ value, label, color }: { value: number, label: string, color: string }) => (
    <Box textAlign="center" position="relative">
        <Gauge
            width={150}
            height={150}
            value={value * 10}
            startAngle={-110}
            endAngle={110}
            innerRadius="75%"
            outerRadius="100%"
            sx={{
                [`& .${gaugeClasses.valueText}`]: { fontSize: 24, fontWeight: 'bold' },
                [`& .${gaugeClasses.valueArc}`]: { fill: color },
                [`& .${gaugeClasses.referenceArc}`]: { fill: '#e5e7eb' },
            }}
            text={({ value }) => `${(value! / 10).toFixed(1)}`}
        />
        <p className="mt-2 font-medium text-gray-700">{label}</p>
    </Box>
);