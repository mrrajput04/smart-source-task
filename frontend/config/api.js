import axios from "axios";

const baseUrl = "https://smart-source-task.onrender.com/api";

const token = localStorage.getItem("token");
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

if (token) api.defaults.headers["Authorization"] = `Bearer ${token}`;

api.interceptors.response.use(
  function (config) {
    return config;
  },
  function (error) {
    if (error.code === 'ECONNABORTED') {
      alert("Request timed out. Please try again.");
    } else if (error.response?.data?.name === "TokenExpiredError") {
      alert("Session timed out. Please log in again.");
      localStorage.removeItem("name");
      localStorage.removeItem("token");
      window.location = "/";
    }
    throw error;
  }
);

export default api;
