import axios from 'axios';

const API_URL = 'https://todolist-api.ridhoyudiana.my.id/api';

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });

        return response.data.data; // Mengambil data dari respons API (message, username, email, token)
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};
