import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-new-1-x36j.onrender.com/api',
  withCredentials: true,
});

export default api;