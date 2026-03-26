// src/api/auth.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface SigninData {
    email: string;
    role: string;
    password: string;
}

export const authApi = {
    signin: async (data: SigninData) => {
        try {
            const config = {
                method: 'post',
                url: `${BASE_URL}/auth/signin`,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data: data
            };

            const response = await axios.request(config);
            return response.data;
        } catch (error: any) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    },
};