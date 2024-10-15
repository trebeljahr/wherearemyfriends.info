import axios, { Axios } from "axios";
import { LoggedInUser } from "../lib/types";
import { backendURL } from "../lib/consts";

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

  login = (requestBody: {
    emailOrUsername: string;
    password: string;
    altchaPayload: string;
  }) => {
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

  changePassword = (requestBody: {
    oldPassword: string;
    newPassword: string;
  }) => {
    return this.api.post("/change-password", requestBody);
  };

  verify = async () => {
    const response = await this.api.get<LoggedInUser>("/verify");
    const user = response.data;
    return user;
  };
}

// Create one instance (object) of the service
const authService = new AuthService();

export default authService;
