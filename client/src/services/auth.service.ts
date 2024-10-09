import axios, { Axios } from "axios";
import { UserType } from "src/context/auth.context";

class AuthService {
  api: Axios;
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL || "http://localhost:5005",
    });

    this.api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }

      return config;
    });
  }

  login = (requestBody: { emailOrUsername: string; password: string }) => {
    return this.api.post("/auth/login", requestBody);
  };

  signup = (requestBody: {
    email: string;
    username: string;
    password: string;
  }) => {
    return this.api.post("/auth/signup", requestBody);
  };

  verify = async () => {
    const response = await this.api.get<UserType>("/auth/verify");
    const user = response.data;
    return user;
  };
}

// Create one instance (object) of the service
const authService = new AuthService();

export default authService;
