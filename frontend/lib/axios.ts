import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // VERY IMPORTANT for cookie auth
});

export default API;