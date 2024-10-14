import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import { FaInfo, FaLocationCrosshairs } from "react-icons/fa6";
import Map, {
  MapLayerMouseEvent,
  NavigationControl,
} from "react-map-gl/maplibre";
import { ScaleLoader } from "react-spinners";
import { useAuth } from "../context/auth.context";
import { useData } from "../context/DataContext";
import { tileServerURL } from "../lib/consts";
import { findCityAndCountryByCoordinates } from "../lib/findCity";
import { UserLocationData, userService } from "../services/user.service";
import { UserLocationMarkers } from "./UserLocationMarkers";

const InstructionInfoBox = () => {
  return (
    <div className="mt-5 flex bg-slate-200 p-5">
      <FaInfo className="mt-[6px] inline mr-2 rounded-full bg-yellow-400 w-5 h-5 p-[3px]" />

      <p>
        <b>Click on the map to update your location.</b>
        <br />
        Your location will be calculated and shared based on your privacy
        settings, and it's easier to share your exact location when you are
        further zoomed in.
      </p>
    </div>
  );
};

const LocationInfoBox = () => {
  const { user } = useAuth();
  return (
    <div className="mt-2 flex bg-slate-200 p-5 mb-5">
      <FaLocationCrosshairs className="mt-[6px] inline mr-2 rounded-full bg-green-400 w-5 h-5 p-[3px]" />

      <div>
        {user?.location.country ? (
          <p>
            <b>Country: </b>
            {user.location.country.name}
          </p>
        ) : (
          <p>
            You are not sharing your country location with anybody at the
            moment.
          </p>
        )}

        {user?.location.city ? (
          <p>
            <b>City: </b>
            {user.location.city.name}
          </p>
        ) : (
          <p>
            You are not sharing your city location with anybody at the moment.
          </p>
        )}

        {user?.location.exact ? (
          <p>
            <b>Lat:</b> {user.location.exact.latitude}, <b>Lon:</b>{" "}
            {user.location.exact.longitude}
          </p>
        ) : (
          <p>
            You are not sharing your exact location with anybody at the moment.
          </p>
        )}
      </div>
    </div>
  );
};

const getCurrentLocationFromGPS = async () => {
  return new Promise<[number, number]>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPosition: [number, number] = [longitude, latitude];
          return resolve(userPosition);
        },
        (error) => {
          const errorMsg = "Error getting current position: " + error.message;
          reject(errorMsg);
        }
      );
    } else {
      const errorMsg = "Geolocation is not supported by this browser.";
      reject(errorMsg);
    }
  });
};

const useUpdateUserLocation = () => {
  const { user, refreshUser } = useAuth();
  const data = useData();

  if (!user || !data.cityData || !data.countryData) {
    return {};
  }

  const updateUserLocation = async (position: [number, number]) => {
    try {
      const { city, country } = findCityAndCountryByCoordinates(data, {
        name: "exactLocation",
        longitude: position[0],
        latitude: position[1],
      });

      const settings = user?.privacySettings;
      const needsCity = settings?.some((s) => s.visibility === "city");
      const needsCountry = settings?.some((s) => s.visibility === "country");
      const needsExact = settings?.some((s) => s.visibility === "exact");

      const update: UserLocationData = {};

      if (needsCity) {
        update.city = city;
      }

      if (needsCountry) {
        update.country = country;
      }

      if (needsExact) {
        update.exact = {
          name: "exactLocation",
          latitude: position[1],
          longitude: position[0],
        };
      }

      await userService.updateUserLocation(update);
      await refreshUser();
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return { updateUserLocation };
};

export const PickLocation = () => {
  const { updateUserLocation } = useUpdateUserLocation();
  const [loading, setLoading] = useState(false);

  if (!updateUserLocation) return null;

  const handleLocationfromGPS = async () => {
    try {
      setLoading(true);
      const newPosition = await getCurrentLocationFromGPS();
      await updateUserLocation(newPosition);
    } catch (error) {
      console.error("Error using GPS location:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (event: MapLayerMouseEvent) => {
    const { lng, lat } = event.lngLat;
    const newCoordinates: [number, number] = [lng, lat];
    await updateUserLocation(newCoordinates);
  };

  return (
    <div className="prose-p:m-0 mb-5">
      <LocationInfoBox />

      <button
        onClick={handleLocationfromGPS}
        className="mb-4 p-2 bg-blue-500 text-white rounded w-56"
      >
        {loading ? (
          <ScaleLoader color="white" height={15} />
        ) : (
          <p>Use My Current Location</p>
        )}
      </button>
      <Map
        style={{ width: "100%", height: "80vh" }}
        mapLib={maplibregl}
        mapStyle={tileServerURL}
        onClick={handleMapClick}
      >
        <NavigationControl position="top-left" />
        <UserLocationMarkers updateUserLocation={updateUserLocation} />
      </Map>
      <InstructionInfoBox />
    </div>
  );
};
