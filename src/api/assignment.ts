import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ... (Previous interfaces remain the same) ...
// 1. Define Types based on the JSON Response
interface SubjectRef {
    _id: string;
    name: string;
    code: string;
}

interface UserRef {
    _id: string;
    name: string;
}

export interface Assignment {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    subject: SubjectRef;
    field: string;
    branch: string;
    semester: string;
    createdBy: UserRef;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface AssignmentsResponse {
    success: boolean;
    data: Assignment[];
}

interface GetAssignmentsParams {
    field: string;
    branch: string;
    semester: string | number;
}

export interface StudentAssignment {
    _id: string
    title: string
    description: string
    dueDate: string
    subject: {
        _id: string
        name: string
        code: string
    }
    field: string
    branch: string
    semester: string
    createdBy: {
        _id: string
        name: string
    }
    language: string
    isCompleted: boolean
    completedAt: string | null
    createdAt: string
}

interface GetAssignmentBySubjectIdParamsForStudent {
    success: boolean;
    data: StudentAssignment[];
}

interface SubmitAssignmentParams {
    studentId: string;
    assignmentId: string;
    submissionData: string;
}

// NEW: Interface for Submission Response
export interface SubmissionData {
    _id: string;
    student: string;
    assignment: string;
    status: string;
    submissionData: string;
    submittedAt: string;
}

interface GetSubmissionResponse {
    success: boolean;
    data: SubmissionData;
}

// 2. Define the API functions
export const assignmentsApi = {
    getAssignments: async (params: GetAssignmentsParams): Promise<AssignmentsResponse> => {
        try {
            const config = {
                method: 'get',
                url: `${BASE_URL}/assignments/list`,
                headers: { 'Content-Type': 'application/json' },
                params: {
                    field: params.field,
                    branch: params.branch,
                    semester: params.semester
                }
            };
            const response = await axios.request<AssignmentsResponse>(config);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching assignments:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    },

    getAssignmentBySubjectIdForStudent: async (params: { studentId: string, subjectId: string }): Promise<GetAssignmentBySubjectIdParamsForStudent> => {
        try {
            const config = {
                method: 'get',
                url: `${BASE_URL}/assignments/${params.studentId}/${params.subjectId}`,
                headers: { 'Content-Type': 'application/json' }
            };
            const response = await axios.request<GetAssignmentBySubjectIdParamsForStudent>(config);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching assignments:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    },

    submitAssignment: async (data: SubmitAssignmentParams) => {
        try {
            const config = {
                method: 'post',
                url: `${BASE_URL}/assignments/submit`,
                headers: { 'Content-Type': 'application/json' },
                data: data
            };
            const response = await axios.request(config);
            return response.data;
        } catch (error: any) {
            console.error("Error submitting assignment:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    },

    // NEW: Get My Submission
    getSubmission: async (studentId: string, assignmentId: string): Promise<GetSubmissionResponse> => {
        try {
            const config = {
                method: 'get',
                url: `${BASE_URL}/assignments/my-submission/${studentId}/${assignmentId}`,
                headers: { 'Content-Type': 'application/json' }
            };
            const response = await axios.request<GetSubmissionResponse>(config);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching submission:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
};