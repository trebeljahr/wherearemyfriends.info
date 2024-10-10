import axios, { Axios } from "axios";
import { SharingState } from "src/components/FriendsharingList";
import { Friend } from "src/components/MapWithFriendMarkers";

export type SingleLocation = {
  name: string;
  latitude: number;
  longitude: number;
};

export interface UserLocationData {
  country?: SingleLocation;
  city?: SingleLocation;
  exact?: SingleLocation;
}

class UserService {
  api: Axios;
  constructor() {
    if (!process.env.REACT_APP_SERVER_URL) {
      throw new Error("REACT_APP_SERVER_URL is not set in the environment");
    }

    this.api = axios.create({
      baseURL: process.env.REACT_APP_SERVER_URL + "/api",
    });

    this.api.interceptors.request.use((config) => {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }

      return config;
    });
  }

  async fetchFriends() {
    const response = await this.api.get("/friends");
    return response.data as Friend[];
  }

  async makeFriendRequest(friendId: string) {
    const response = await this.api.post("/friends/requests", {
      friendId,
    });
    return response.data;
  }

  async acceptFriendRequest(requesterId: string) {
    const response = await this.api.post("/friends/requests/accept", {
      requesterId,
    });
    return response.data;
  }

  async declineFriendRequest(requesterId: string) {
    const response = await this.api.post("/friends/requests/decline", {
      requesterId,
    });
    return response.data;
  }

  async searchForUser(username: string) {
    const response = await this.api.get(`/users/search?username=${username}`);
    return response.data;
  }

  async fetchPendingRequests() {
    const response = await this.api.get("/friends/requests");
    return response.data;
  }

  async updateUserLocation(userLocation: UserLocationData) {
    const response = await this.api.put("/users/location", userLocation);
    return response.data;
  }

  async updateFriendPrivacy(friendId: string, newVisibility: SharingState) {
    const response = await this.api.put("/friends/privacy", {
      friendId,
      newVisibility,
    });

    return response.data;
  }

  async removeFriend(friendId: string) {
    const response = await this.api.delete("/friends", {
      data: { friendId },
    });
    return response.data;
  }

  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const response = await this.api.post("/users/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }
}

export const userService = new UserService();
