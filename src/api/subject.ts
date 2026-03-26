import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface GetSubjectsParams {
    field: string;
    branch: string;
    semester: string | number;
}

export interface Subject {
    _id: string;
    name: string;
    code: string;
    field: string;
    branch: string;
    semester: string | number;
}

interface Response {
    success: boolean
    data: Subject[]
}

export const subjectsApi = {
    // API to fetch subjects based on field, branch, and semester
    getSubjects: async (params: GetSubjectsParams): Promise<Response> => {
        try {
            const config = {
                method: 'get',
                url: `${BASE_URL}/subjects?field=${params.field}&branch=${params.branch}&semester=${params.semester}`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                // In Axios, 'params' are automatically converted to Query Strings
                // e.g., ?field=Engineering&branch=CE&semester=5
                // params: {
                //     field: params.field,
                //     branch: params.branch,
                //     semester: params.semester
                // }
            };

            const response = await axios.request(config);
            return response.data as Response;
        } catch (error: any) {
            console.error("Error fetching subjects:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
};