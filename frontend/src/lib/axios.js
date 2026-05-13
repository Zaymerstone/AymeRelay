import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "https://localhost:3000/api"
      : "/api",
  withCredentials: true, // send cookies with the request
});
// TODO: read about proxy in Nginx, Vite
