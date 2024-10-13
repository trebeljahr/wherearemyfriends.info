import React, { useState, useEffect } from "react";
import { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useAuth } from "src/context/auth.context";
import authService from "src/services/auth.service";
import { UserLocationData, userService } from "src/services/user.service";
import { createAvatarMarker } from "./MapWithFriendMarkers";
import { findCityAndCountryByCoordinates } from "../lib/findCity";
import { FaInfo, FaLocationCrosshairs } from "react-icons/fa6";
import { useData } from "src/context/DataContext";
import { tileServerURL } from "src/lib/consts";

const UserLocationMarkers = ({
  updateUserLocation,
}: {
  updateUserLocation: (newLocation: [number, number]) => void;
}) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const newCoordinates: [number, number] = [e.latlng.lng, e.latlng.lat];
        updateUserLocation(newCoordinates);
      },
    });
    return null;
  };

  return (
    <>
      <MapClickHandler />
      {user?.location?.city && (
        <Marker
          position={[user.location.city.latitude, user.location.city.longitude]}
          icon={createAvatarMarker(user.profilePicture, "bg-slate-500")}
        />
      )}
      {user?.location?.country && (
        <Marker
          position={[
            user.location.country.latitude,
            user.location.country.longitude,
          ]}
          icon={createAvatarMarker(user.profilePicture, "bg-green-500")}
        />
      )}
      {user?.location?.exact && (
        <Marker
          position={[
            user.location.exact.latitude,
            user.location.exact.longitude,
          ]}
          draggable={true}
          icon={createAvatarMarker(user.profilePicture, "bg-red-400")}
        />
      )}
    </>
  );
};

const bounds = [
  [-90, -180],
  [90, 180],
] as LatLngBoundsExpression;

export const PickLocation = () => {
  const { user, refreshUser } = useAuth();
  const data = useData();
  const defaultCenter: [number, number] = [0, 0];
  const [currentPosition, setCurrentPosition] = useState<
    [number, number] | null
  >(null);

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
      const needsCity = settings?.find((s) => s.visibility === "city");
      const needsCountry = settings?.find((s) => s.visibility === "country");
      const needsExact = settings?.find((s) => s.visibility === "exact");

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
          // Success callback
          const { latitude, longitude } = position.coords;
          const userPosition: [number, number] = [longitude, latitude];
          // Update user location
          updateUserLocation(userPosition);
          // Center map on user's current location
          setCurrentPosition([latitude, longitude]);
        },
        (error) => {
          // Error callback
          console.error("Error getting current position", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Component to center the map on the user's current location
  const SetViewOnPositionChange = ({
    position,
  }: {
    position: [number, number];
  }) => {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView(position, 13);
      }
    }, [map, position]);

    return null;
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

      <MapContainer
        center={defaultCenter}
        zoom={2}
        minZoom={2}
        maxZoom={18}
        style={{ height: "80vh" }}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        inertia={false}
      >
        <TileLayer
          url={tileServerURL}
          attribution="&copy; OpenStreetMap contributors"
        />
        {currentPosition && (
          <SetViewOnPositionChange position={currentPosition} />
        )}
        <UserLocationMarkers updateUserLocation={updateUserLocation} />
      </MapContainer>

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
