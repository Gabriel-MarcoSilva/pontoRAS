import axios from "axios";

const API = axios.create(
    {
        baseURL: process.env.BASE_URL,
        headers: { 'Content-Type': 'application/json' }
    }
)

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Corrigido "Bearer"
    }
    return config;
})

export default API