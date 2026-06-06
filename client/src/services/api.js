import axios from "axios";

const API = axios.create({
  baseURL: "https://servo-app-yp59.onrender.com/api",
});

export default API;