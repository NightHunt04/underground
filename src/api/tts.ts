import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ttsApi = {
    generateAudio: async (text: string): Promise<Blob> => {
        try {
            const config = {
                method: 'post',
                url: `${BASE_URL}/tts/generate`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { text },
                responseType: 'blob' as 'blob' // Essential for handling audio data
            };

            const response = await axios.request(config);
            return response.data;
        } catch (error: any) {
            console.error("Error generating audio:", error);
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
};