import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// 1. Define Types
interface SubjectRef {
    _id: string;
    name: string;
    code: string;
}

interface FileRef {
    url: string;
    publicId: string;
}

export interface Pyq {
    _id: string;
    title: string;
    year: number;
    subject: SubjectRef;
    file: FileRef;
    field: string;
    branch: string;
    semester: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface PyqResponse {
    success: boolean;
    count: number;
    data: Pyq[];
}

// 2. API Functions
export const pyqApi = {
    getAllPyqs: async (): Promise<PyqResponse> => {
        try {
            const config = {
                method: 'get',
                url: `${BASE_URL}/pyqs`,
                headers: {}
            };

            const response = await axios.request<PyqResponse>(config);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching PYQs:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
};