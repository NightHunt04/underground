import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// 1. Define Types based on the JSON Response
export interface PlacementRole {
    _id: string;
    jobProfile: string;
    salary: string;
    minCGPA: number;
    skills: string[];
}

export interface Company {
    _id: string;
    companyName: string;
    location: string;
    employeesCount: string;
    workMode: string;
    description: string;
    roles: PlacementRole[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    // Optional: Add profileImage if you plan to add it to backend later, 
    // otherwise we will use a placeholder in frontend
    profileImage?: string; 
}

export interface PlacementResponse {
    success: boolean;
    count: number;
    data: Company[];
}

// 2. Define the API functions
export const placementApi = {
    getAllPlacements: async (): Promise<PlacementResponse> => {
        try {
            const config = {
                method: 'get',
                url: `${BASE_URL}/placements`,
                headers: { 
                    'Content-Type': 'application/json' 
                }
            };

            const response = await axios.request<PlacementResponse>(config);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching placements:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
};