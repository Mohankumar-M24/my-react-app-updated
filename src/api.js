import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-new-2-6l36.onrender.com',
  withCredentials: true,
});

export default api;