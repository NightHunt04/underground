import { createContext, useContext, useState } from "react"
import { Subject } from "../api/subject"
import { StudentAssignment } from "../api/assignment"
import { Company } from "../api/placement"
import { Pyq } from "../api/pyq" 
import { Announcement } from "../api/announcement" 
import { Syllabus } from "../api/syllabus" 

interface ContextReturn {
    selectedRole: string,
    setSelectedRole: React.Dispatch<React.SetStateAction<string>>
    field: string,
    setField: React.Dispatch<React.SetStateAction<string>>
    batch: string,
    setBatch: React.Dispatch<React.SetStateAction<string>>
    mainNav: number
    setMainNav: React.Dispatch<React.SetStateAction<number>>
    showIndividualSubjectAssign: boolean
    setShowIndividualSubjectAssign: React.Dispatch<React.SetStateAction<boolean>>
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    user: Student | null
    setUser: React.Dispatch<React.SetStateAction<Student | null>>
    subjects: Subject[]
    setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>
    chapters: Chapter[]
    setChapters: React.Dispatch<React.SetStateAction<Chapter[]>>
    assignments: StudentAssignment[]
    setAssignments: React.Dispatch<React.SetStateAction<StudentAssignment[]>>
    companies: Company[]
    setCompanies: React.Dispatch<React.SetStateAction<Company[]>>    
    pyqs: Pyq[]
    setPyqs: React.Dispatch<React.SetStateAction<Pyq[]>>
    announcements: Announcement[]
    setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>
    syllabus: Syllabus[]
    setSyllabus: React.Dispatch<React.SetStateAction<Syllabus[]>>
}

interface Props {
    children: React.ReactNode
}

interface Student {
    id: string
    name: string
    email: string
    role: string
    branch: string
    enrollmentNumber: string
    semester: number
    field: string
}

interface SubjectForChap {
    _id: string
    name: string
    code: string
}

interface Chapter {
    _id: string
    subject: SubjectForChap
    indexNumber: number
    title: string
    topics: string[]
}

const Context = createContext<ContextReturn | null>(null)

export const ContextProvider = (props: Props) => {
    const [selectedRole, setSelectedRole] = useState<string>('Select Role')
    const [field, setField] = useState<string>('Select Field')
    const [batch, setBatch] = useState<string>('Select Batch')
    const [mainNav, setMainNav] = useState<number>(0)
    const [showIndividualSubjectAssign, setShowIndividualSubjectAssign] = useState<boolean>(false)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    const [user, setUser] = useState<Student | null>(null)
    const [subjects, setSubjects] = useState<Subject[]>([])
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [assignments, setAssignments] = useState<StudentAssignment[]>([])
    const [companies, setCompanies] = useState<Company[]>([])
    const [pyqs, setPyqs] = useState<Pyq[]>([])
    const [announcements, setAnnouncements] = useState<Announcement[]>([])
    const [syllabus, setSyllabus] = useState<Syllabus[]>([])


    return (
        <Context.Provider value={{ 
            selectedRole, setSelectedRole, 
            field, setField, 
            batch, setBatch, 
            mainNav, setMainNav, 
            showIndividualSubjectAssign, setShowIndividualSubjectAssign, 
            isLoggedIn, setIsLoggedIn,
            user, setUser,
            subjects, setSubjects,
            chapters, setChapters,
            assignments, setAssignments,
            companies, setCompanies,
            pyqs, setPyqs,
            announcements, setAnnouncements,
syllabus, setSyllabus
        }}>
            {props.children}
        </Context.Provider>
    )
}

export const useAppContext = () => (useContext(Context))