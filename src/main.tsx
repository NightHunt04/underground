import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signin from './components/signin/Signin.tsx'
import { ContextProvider } from "./context/ContextProvider"
import Home from './components/home/Home.tsx'
import CodeArea from './components/code/CodeArea.tsx'
import Placements from './components/placements/Placements.tsx'
import Main from './components/home/center-bar/Main.tsx'
import QuestionPaper from './components/quesPaper/QuestionPaper.tsx'
import AiTutor from './components/tutor/AiTutor.tsx'
import Quiz from './components/quiz/Quiz.tsx'
import SyllabusQues from './components/syllabusQues/SyllabusQues.tsx'
import SuggestedCompanies from './components/placements/SuggestedCompanies.tsx'
import AllCompanies from './components/placements/AllCompanies.tsx'
import MockTest from './components/placements/MockTest.tsx'
import Preparation from './components/placements/Preparation.tsx'
import SpeechTest from './components/placements/SpeechTest.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'student/:studentId/',
        element: <Home />,
        children: [
          {
            path: 'subjects',
            element: <Main />,
          },
          {
            path: 'placements',
            element: <Placements />,
            children: [
              {
                path: 'suggested-companies',
                element: <SuggestedCompanies />
              },
              {
                path: 'all-companies',
                element: <AllCompanies />
              },
              {
                path: 'mock-test',
                element: <MockTest />
              },
              {
                path: 'preparation',
                element: <Preparation />,
                children: [
                  {
                    path: 'speech-test',
                    element: <SpeechTest />
                  }
                ]
              }
            ]
          },
          {
            path: 'question-papers',
            element: <QuestionPaper />
          },
          {
            path: 'ai-tutor',
            element: <AiTutor />
          },
          {
            path: 'gen-assignment-ques',
            element: <Quiz />
          },
          {
            path: 'gen-syllabus-ques',
            element: <SyllabusQues />
          }
        ]
      },
      {
        path: 'signin',
        element: <Signin />
      }
    ]
  }, 
  {
    path: 'student/:studentId/subjects/code/:problemId',
    element: <CodeArea />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  </StrictMode>,
)
