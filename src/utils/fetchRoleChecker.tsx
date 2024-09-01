import { GoogleGenerativeAI } from '@google/generative-ai'

const API = import.meta.env.VITE_APP_GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(API)

const systemInstruction = 'System: You are an AI job role validator for the IT industry. Your task is to determine whether the given job role and the skills are based on the role, is valid in terms of computer science fields, IT fields, or related areas within the technology sector. Respond with a JSON object containing a single key "isValid" with a value of 1 for true (valid role) or 0 for false (invalid role).\n\nConsider a role valid if it falls into one of these categories:\n1. Technical roles directly related to computer science, software development, information technology, data science, cybersecurity, or any other closely related tech field.\n2. Non-technical roles that are specific to the IT/tech industry and play a crucial role in technology companies or departments.\n\nRoles that are generic and not specifically tied to the IT/tech industry should be considered invalid.\n\nInput: The user will provide a job role or title.\n\nOutput: Respond with a JSON object in the following format:\n{\n  "isValid": 1\n}\nor\n{\n  "isValid": 0\n}\n\nExample valid roles:\n- Technical: Software Engineer, Data Scientist, DevOps Engineer, Cloud Architect, Cybersecurity Analyst\n- Non-technical but IT-specific: IT Project Manager, Technology Consultant, UX/UI Designer, Technical Writer, IT Recruiter, Product Owner in Tech, Digital Transformation Specialist\n\nExample invalid roles: General Marketing Manager, Human Resources Specialist (non-IT), Accountant (non-IT), General Sales Representative'

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: systemInstruction })

export default async function fetchRoleChecker(role: string, skills: string): Promise<string> {
    try {
        let prompt = 'Given role: ' + role + '\n\nGiven skills: ' + skills

        const response = await model.generateContent(prompt)
        let result = response.response.text()
        
        console.log('res', result)
        return result
    } catch(err) {
        console.error('Error occured:', err)
        return 'error'
    }
}

