import axios, { type Axios } from "axios";
import { backendURL } from "../lib/consts";
import type { LoggedInUser } from "../lib/types";

class AuthService {
  api: Axios;
  constructor() {
    this.api = axios.create({
      baseURL: backendURL + "/auth",
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
    return this.api.post("/login", requestBody);
  };

  signup = (requestBody: {
    email: string;
    username: string;
    password: string;
    altchaPayload: string;
  }) => {
    return this.api.post("/signup", requestBody);
  };

  changePassword = (requestBody: { oldPassword: string; newPassword: string }) => {
    return this.api.post("/change-password", requestBody);
  };

  verify = async () => {
    const response = await this.api.get<LoggedInUser>("/verify");
    const user = response.data;
    return user;
  };
}

const authService = new AuthService();

export default authService;
