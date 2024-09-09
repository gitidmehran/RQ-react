import axios from "axios";
import { OpenNotification } from "./Actions/Utilities/Utilities";
const token = localStorage.getItem("token");
export const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "access-control-allow-methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS",
  },
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      OpenNotification("error", "Authentication Failed");
      localStorage.clear();
      window.location.href = "/login";
    }
  }
);
