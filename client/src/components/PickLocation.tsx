import { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { userService } from "src/services/user.service";
import { createAvatarMarker } from "./MapMarkerComponent";
import { findCityAndCountryByCoordinates } from "./findCity";

type LocationMarkerProps = {
  userId: string; // Current user's ID
  initialCoordinates?: [number, number]; // Optional initial coordinates for the marker
};

const LocationMarker: React.FC<LocationMarkerProps> = ({
  initialCoordinates,
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialCoordinates || null
  );

  const { cityPosition, countryPosition } = useMemo(() => {
    if (position) {
      const { city, country } = findCityAndCountryByCoordinates(
        position[1],
        position[0]
      );

      return {
        cityPosition: city?.coordinates,
        countryPosition: country?.coordinates,
      };
    }

    return { cityPosition: null, countryPosition: null };
  }, [position]);

  // Update user's location when the marker is placed or moved
  const updateUserLocation = async (position: [number, number]) => {
    try {
      const { city, country } = findCityAndCountryByCoordinates(
        position[1],
        position[0]
      );
      const newLocationObject = {
        exact: { name: "exactLocation", coordinates: position },
        city,
        country,
      };

      await userService.updateUserLocation(newLocationObject);
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  // Leaflet event handler to allow placing the marker by clicking on the map
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const newCoordinates: [number, number] = [e.latlng.lng, e.latlng.lat];
        setPosition(newCoordinates); // Update local state
        updateUserLocation(newCoordinates); // Send new location to the server
      },
    });
    return null;
  };

  return (
    <>
      <MapClickHandler />
      {cityPosition && (
        <Marker
          position={[cityPosition[1], cityPosition[0]]}
          icon={createAvatarMarker(
            "https://randomuser.me/api/portraits/men/40.jpg",
            "red-400"
          )}
        />
      )}
      {countryPosition && (
        <Marker
          position={[countryPosition[1], countryPosition[0]]}
          icon={createAvatarMarker(
            "https://randomuser.me/api/portraits/men/40.jpg",
            "slate-500"
          )}
        />
      )}
      {position && (
        <Marker
          position={[position[1], position[0]]} // Marker expects [latitude, longitude]
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const newPosition: [number, number] = [
                marker.getLatLng().lng,
                marker.getLatLng().lat,
              ];
              setPosition(newPosition); // Update marker's position
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
      <LocationMarker userId={userId} />
    </MapContainer>
  );
};
