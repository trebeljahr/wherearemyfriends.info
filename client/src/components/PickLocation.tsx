// PickLocation.tsx
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import { FaInfo, FaLocationCrosshairs } from "react-icons/fa6";
import Map, {
  MapLayerMouseEvent,
  Marker,
  NavigationControl,
  ViewState,
} from "react-map-gl/maplibre";
import { useAuth } from "../context/auth.context";
import { useData } from "../context/DataContext";
import { tileServerURL } from "../lib/consts";
import { createAvatarMarkerMapLibreGL } from "../lib/createAvatarMarkerMaplibreGL";
import { findCityAndCountryByCoordinates } from "../lib/findCity";
import authService from "../services/auth.service";
import { UserLocationData, userService } from "../services/user.service";

type MarkerProps = {
  updateUserLocation: (newLocation: [number, number]) => void;
};

const UserLocationMarkers = ({ updateUserLocation }: MarkerProps) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const markers: React.ReactNode[] = [];

  if (user.location.city) {
    markers.push(
      <Marker
        key="city"
        longitude={user.location.city.longitude}
        latitude={user.location.city.latitude}
        anchor="bottom"
      >
        {createAvatarMarkerMapLibreGL(user.profilePicture, "bg-slate-500")}
      </Marker>
    );
  }

  if (user.location.country) {
    markers.push(
      <Marker
        key="country"
        longitude={user.location.country.longitude}
        latitude={user.location.country.latitude}
        anchor="bottom"
      >
        {createAvatarMarkerMapLibreGL(user.profilePicture, "bg-green-500")}
      </Marker>
    );
  }

  if (user.location.exact) {
    markers.push(
      <Marker
        key="exact"
        longitude={user.location.exact.longitude}
        latitude={user.location.exact.latitude}
        anchor="bottom"
        draggable
        onDragEnd={(event: any) => {
          const { lng, lat } = event.lngLat;
          const newCoordinates: [number, number] = [lng, lat];
          updateUserLocation(newCoordinates);
        }}
      >
        {createAvatarMarkerMapLibreGL(user.profilePicture, "bg-red-400")}
      </Marker>
    );
  }

  return <>{markers}</>;
};

export const PickLocation: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const data = useData();

  if (!user || !data.cityData || !data.countryData) {
    return null;
  }

  const updateUserLocation = async (position: [number, number]) => {
    const currentUser = await authService.verify();
    try {
      const { city, country } = findCityAndCountryByCoordinates(data, {
        name: "exactLocation",
        longitude: position[0],
        latitude: position[1],
      });

      const settings = currentUser?.privacySettings;
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

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);

          const { latitude, longitude } = position.coords;
          const userPosition: [number, number] = [longitude, latitude];
          updateUserLocation(userPosition);
        },
        (error) => {
          console.error("Error getting current position", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleMapClick = (event: MapLayerMouseEvent) => {
    console.log(event);
    const { lng, lat } = event.lngLat;
    const newCoordinates: [number, number] = [lng, lat];
    updateUserLocation(newCoordinates);
  };

  return (
    <div className="prose-p:m-0 mb-5">
      <div className="mt-2 flex bg-slate-200 p-5 mb-5">
        <FaLocationCrosshairs className="mt-[6px] inline mr-2 rounded-full bg-green-400 w-5 h-5 p-[3px]" />

        <div>
          {user?.location.country ? (
            <p>
              <b>Country: </b>
              {user.location.country.name}
            </p>
          ) : (
            "You are not sharing your country location with anybody at the moment."
          )}

          {user?.location.city ? (
            <p>
              <b>City: </b>
              {user.location.city.name}
            </p>
          ) : (
            "You are not sharing your city location with anybody at the moment."
          )}

          {user?.location.exact ? (
            <p>
              <b>Lat:</b> {user.location.exact.latitude}, <b>Lon:</b>{" "}
              {user.location.exact.longitude}
            </p>
          ) : (
            "You are not sharing your exact location with anybody at the moment."
          )}
        </div>
      </div>

      <button
        onClick={handleUseCurrentLocation}
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Use My Current Location
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
    </div>
  );
};
