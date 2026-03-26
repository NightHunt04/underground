import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// 1. Define Types
interface ImageRef {
    url: string;
    publicId: string;
}

export interface Announcement {
    _id: string;
    title: string;
    description: string;
    image?: ImageRef;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface AnnouncementResponse {
    success: boolean;
    data: Announcement[];
}

// 2. API Functions
export const announcementApi = {
    getAllAnnouncements: async (): Promise<AnnouncementResponse> => {
        try {
            const config = {
                method: 'get',
                url: `${BASE_URL}/announcements/`,
                headers: {}
            };

            const response = await axios.request<AnnouncementResponse>(config);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching announcements:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
};