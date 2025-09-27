import axios from "axios";

const chatAxios = axios.create({
  baseURL: "https://network-next-backend.onrender.com/api/network-next/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token (if available)
chatAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("chat-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally
chatAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default chatAxios;
