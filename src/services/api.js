import axios from "axios";

export const BASE_URL = "http://ecommerce.reworkstaging.name.ng/v2";

// Create an Axios instance with your base configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  // Axios resolves data on the .data property automatically
  get: (path) => 
    axiosInstance.get(path).then((res) => res.data),

  post: (path, body) => 
    axiosInstance.post(path, body).then((res) => res.data),

  delete: (path) => 
    axiosInstance.delete(path).then((res) => res.data),
};