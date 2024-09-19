import axios, { Axios } from "axios";

class ExampleService {
  api: Axios;
  constructor() {
    if (!process.env.REACT_APP_SERVER_URL) {
      throw new Error("REACT_APP_SERVER_URL is not set in the environment");
    }

    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL,
    });

    this.api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }

      return config;
    });
  }

  // POST /api/examples
  createOne = async (requestBody: any) => {
    return this.api.post("/api/examples", requestBody);
  };

  // GET /api/examples
  getAll = async () => {
    return this.api.get("/api/examples");
  };

  // GET /api/examples/:id
  getOne = async (id: string) => {
    return this.api.get(`/api/examples/${id}`);
  };

  // PUT /api/examples/:id
  updateOne = async (id: string, requestBody: any) => {
    return this.api.put(`/api/examples/${id}`, requestBody);
  };

  // DELETE /api/examples/:id
  deleteProject = async (id: string) => {
    return this.api.delete(`/api/examples/${id}`);
  };
}

const exampleService = new ExampleService();

export default exampleService;
