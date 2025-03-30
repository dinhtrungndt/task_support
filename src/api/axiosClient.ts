import axios from 'axios';

const axiosClient = axios.create({
  // baseURL: 'http://192.168.2.209:8080',
  // baseURL: 'http://192.168.1.11:8080',
  baseURL: process.env.REACT_APP_API_URL,
  // baseURL: 'https://api-ithelp.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
