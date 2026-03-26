import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// 1. Define types based on your JSON response
interface SubjectRef {
    _id: string;
    name: string;
    code: string;
}

export interface Chapter {
    _id: string;
    subject: SubjectRef;
    indexNumber: number;
    title: string;
    topics: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ChaptersResponse {
    success: boolean;
    count: number;
    data: Chapter[];
}

// 2. Define the API functions
export const chaptersApi = {
    // Get all chapters for a specific Subject ID
    getBySubjectId: async (subjectId: string): Promise<ChaptersResponse> => {
        try {
            const config = {
                method: 'get',
                url: `${BASE_URL}/chapters/${subjectId}`,
                headers: {}
            };

            const response = await axios.request<ChaptersResponse>(config);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching chapters:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
};