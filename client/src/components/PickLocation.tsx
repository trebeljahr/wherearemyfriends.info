import { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { useAuth } from "src/context/auth.context";
import authService from "src/services/auth.service";
import { UserLocationData, userService } from "src/services/user.service";
import { createAvatarMarker } from "./MapWithFriendMarkers";
import { findCityAndCountryByCoordinates } from "./findCity";

const UserLocationMarkers = () => {
  const { user, authenticateUser } = useAuth();

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

      await userService.updateUserLocation(update);
      await authenticateUser();
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

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
          position={[
            user?.location.city.latitude,
            user?.location.city.longitude,
          ]}
          icon={createAvatarMarker(user.profilePicture, "red-400")}
        />
      )}
      {user?.location?.country && (
        <Marker
          position={[
            user?.location.country.latitude,
            user?.location.country.longitude,
          ]}
          icon={createAvatarMarker(user.profilePicture, "slate-500")}
        />
      )}
      {user?.location?.exact && (
        <Marker
          position={[
            user.location.exact.latitude,
            user.location.exact.longitude,
          ]}
          draggable={true}
          icon={createAvatarMarker(user.profilePicture)}
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
  const defaultCenter: [number, number] = [0, 0];

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
      <UserLocationMarkers />
    </MapContainer>
  );
};
