import { Point } from "geojson";

export type Friend = {
  _id: string;
  username: string;
  profilePicture: string;
  sharingState: SharingState;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
};

export type SharingState = "exact" | "city" | "country" | "none";

export type OtherUser = {
  _id: string;
  username: string;
  profilePicture: string;
};

export type LoggedInUser = {
  email: string;
  username: string;
  profilePicture: string;
  location: {
    exact?: SingleLocation;
    city?: SingleLocation;
    country?: SingleLocation;
  };
  privacySettings: {
    friendId: string;
    visibility: SharingState;
  }[];
  friends: LoggedInUser[];
  receivedFriendRequests: OtherUser[];
  sentFriendRequests: OtherUser[];
  _id: string;
};

export interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: LoggedInUser | null;
  authToken: string | null;
  storeToken: (token: string) => void;
  authenticateUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
  logOutUser: () => void;
}

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
export interface Feature<T> {
  type: "Feature";
  geometry: Point;
  properties: T;
}

export interface CityProperties {
  name: string;
  country: CountryProperties;
}

export type CityData = GeoJsonData<CityProperties>;

export type CountryData = CountriesById;

export type CityAndCountryData = {
  cityData: CityData;
  countryData: CountryData;
};
export interface GeoJsonData<T> {
  type: "FeatureCollection";
  features: Feature<T>[];
}

export interface CountryProperties {
  id: string;
  name: string;
}

export interface CountriesById {
  [id: string]: CountryProperties & { labelPoint: Point };
}
