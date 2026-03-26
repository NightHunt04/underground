import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface FileRef {
    url: string;
    publicId: string;
}

export interface Syllabus {
    _id: string;
    field: string;
    branch: string;
    semester: string;
    file: FileRef;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface SyllabusResponse {
    success: boolean;
    count: number;
    data: Syllabus[];
}

interface GetSyllabusParams {
    field: string;
    branch: string;
    semester: string;
}

export const syllabusApi = {
    getSyllabus: async (params: GetSyllabusParams): Promise<SyllabusResponse> => {
        try {
            const config = {
                method: 'get',
                url: `${BASE_URL}/syllabus`,
                headers: {},
                params: {
                    field: params.field,
                    branch: params.branch,
                    semester: params.semester
                }
            };

            const response = await axios.request<SyllabusResponse>(config);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching syllabus:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
};