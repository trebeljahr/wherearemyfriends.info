import { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useContext } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { AuthContext } from "src/context/auth.context";
import authService from "src/services/auth.service";
import { UserLocationData, userService } from "src/services/user.service";
import { createAvatarMarker } from "./MapMarkerComponent";
import { findCityAndCountryByCoordinates } from "./findCity";

const LocationMarker = () => {
  const { user, authenticateUser } = useContext(AuthContext);

  // Update user's location when the marker is placed or moved
  const updateUserLocation = async (position: [number, number]) => {
    const currentUser = await authService.verify();
    try {
      const { city, country } = findCityAndCountryByCoordinates({
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

      console.log(settings.map((s) => s.visibility));
      console.log(Object.keys(update));

      // console.log("Updating location:", update);

      await userService.updateUserLocation(update);
      await authenticateUser();
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  // Leaflet event handler to allow placing the marker by clicking on the map
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const newCoordinates: [number, number] = [e.latlng.lng, e.latlng.lat];
        updateUserLocation(newCoordinates); // Send new location to the server
      },
    });
    return null;
  };

  return (
    <>
      <MapClickHandler />
      {user?.location?.city && (
        <Marker
          position={[
            user?.location.city.latitude,
            user?.location.city.longitude,
          ]}
          icon={createAvatarMarker(
            "https://randomuser.me/api/portraits/men/40.jpg",
            "red-400"
          )}
        />
      )}
      {user?.location?.country && (
        <Marker
          position={[
            user?.location.country.latitude,
            user?.location.country.longitude,
          ]}
          icon={createAvatarMarker(
            "https://randomuser.me/api/portraits/men/40.jpg",
            "slate-500"
          )}
        />
      )}
      {user?.location?.exact && (
        <Marker
          position={[
            user.location.exact.latitude,
            user.location.exact.longitude,
          ]}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const newPosition: [number, number] = [
                marker.getLatLng().lng,
                marker.getLatLng().lat,
              ];
              updateUserLocation(newPosition); // Send new location to server
            },
          }}
          icon={createAvatarMarker(
            "https://randomuser.me/api/portraits/men/40.jpg"
          )}
        />
      )}
    </>
  );
};

const bounds = [
  [-90, -180],
  [90, 180],
] as LatLngBoundsExpression;

export const MapWithMarker: React.FC<{ userId: string }> = ({ userId }) => {
  const defaultCenter: [number, number] = [0, 0];

  // const aspectRatio = 2.1167;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={2}
      minZoom={2}
      maxZoom={18}
      style={{ height: "80vh", width: "80vw" }}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
      worldCopyJump={false}
      inertia={false}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker />
    </MapContainer>
  );
};
