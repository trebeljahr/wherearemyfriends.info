import axios from "axios";
import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { backendURL } from "./FriendsharingList";
import { createAvatarMarker } from "./MapMarkerComponent";
import worldGeoJSON from "geojson-world-map";
import * as turf from "@turf/turf";

// Function to find the country for a given point
const findCountryByCoordinates = (lat: number, lon: number) => {
  console.log(worldGeoJSON);

  const point = turf.point([lon, lat]); // [longitude, latitude]

  for (const feature of worldGeoJSON.features) {
    if (turf.booleanPointInPolygon(point, feature)) {
      const countryName =
        feature.properties.name || feature.properties.ADMIN || "Unknown";
      return countryName;
    }
  }
  return "Unknown";
};

type LocationMarkerProps = {
  userId: string; // Current user's ID
  initialCoordinates?: [number, number]; // Optional initial coordinates for the marker
};

const LocationMarker: React.FC<LocationMarkerProps> = ({
  userId,
  initialCoordinates,
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialCoordinates || null
  );

  // Update user's location when the marker is placed or moved
  const updateUserLocation = async (newCoordinates: [number, number]) => {
    const country = findCountryByCoordinates(
      newCoordinates[1],
      newCoordinates[0]
    );

    console.log(country);

    try {
      const response = await axios.put(
        `${backendURL}/api/users/${userId}/location`,
        {
          coordinates: newCoordinates,
        }
      );
      console.log(response.data.message); // Log success message
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

export const MapWithMarker: React.FC<{ userId: string }> = ({ userId }) => {
  const defaultCenter: [number, number] = [0, 0];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={2}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker userId={userId} />
    </MapContainer>
  );
};
