import { createContext, useContext, useState } from "react"

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
}

interface Props {
    children: React.ReactNode
}

const Context = createContext<ContextReturn | null>(null)

export const ContextProvider = (props: Props) => {
    const [selectedRole, setSelectedRole] = useState<string>('Select Role')
    const [field, setField] = useState<string>('Select Field')
    const [batch, setBatch] = useState<string>('Select Batch')
    const [mainNav, setMainNav] = useState<number>(0)
    const [showIndividualSubjectAssign, setShowIndividualSubjectAssign] = useState<boolean>(false)

    return (
        <Context.Provider value={{ selectedRole, setSelectedRole, field, setField, batch, setBatch, mainNav, setMainNav, showIndividualSubjectAssign, setShowIndividualSubjectAssign }}>
            {props.children}
        </Context.Provider>
    )
}

export const useAppContext = () => (useContext(Context))
