import axios from "axios";
import "leaflet/dist/leaflet.css";
import React, { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { backendURL } from "./FriendsharingList";
import { createAvatarMarker } from "./MapMarkerComponent";
import worldGeoJSON from "geojson-world-map";
import citiesGeoJSON from "./citiesData.json";
import * as turf from "@turf/turf";
import { LatLngBoundsExpression } from "leaflet";

console.log(worldGeoJSON);

const typedCitiesGeoJSON = citiesGeoJSON as CitiesGeoJSON;
const typedWorldGeoJSON = worldGeoJSON as WorldGeoJSON;

type CitiesGeoJSON = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    geometry: {
      type: "Polygon";
      coordinates: [number, number][][];
    };
    properties: {
      name: string;
    };
  }[];
};

type WorldGeoJSON = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    geometry: {
      type: "Polygon";
      coordinates: [number, number][][];
    };
    properties: {
      name?: string;
      ADMIN?: string;
    };
  }[];
};

const findCityThatContainsPoint = (lat: number, lon: number) => {
  const point = turf.point([lon, lat]);

  for (const feature of typedCitiesGeoJSON.features) {
    if (feature.geometry) {
      const inside = turf.booleanPointInPolygon(point, feature);
      if (inside) {
        return feature;
      }
    }
  }
  return null;
};

// Function to find the country for a given point
const findCountryThatContainsPoint = (lat: number, lon: number) => {
  console.log(typedWorldGeoJSON);

  const point = turf.point([lon, lat]); // [longitude, latitude]

  for (const feature of typedWorldGeoJSON.features) {
    if (turf.booleanPointInPolygon(point, feature)) {
      return feature;
    }
  }

  return null;
};

const findCountryByCoordinates = (lat: number, lon: number) => {
  const point = turf.point([lon, lat]);

  const inCountry = findCountryThatContainsPoint(lat, lon);
  if (inCountry) {
    console.log(`Inside country: ${inCountry}`);

    const centroid = turf.centroid(inCountry);
    return [inCountry.properties.name, centroid.geometry.coordinates];
  }

  const nearestCountry = turf.nearestPoint(
    point,
    countryCentroidsFeatureCollection
  );

  if (nearestCountry) {
    console.log(nearestCountry);

    const countryName = nearestCountry.properties.name || "Unknown Country";
    console.log(`Nearest Country: ${countryName}`);
    return [
      nearestCountry.properties.name,
      nearestCountry.geometry.coordinates,
    ];
  }

  return null;
};

const cityCentroids = typedCitiesGeoJSON.features.map((feature) => {
  const centroid = turf.centroid(feature);
  if (centroid.properties) {
    centroid.properties.name = feature.properties.name;
  }
  return centroid;
});

const countryCentroids = typedWorldGeoJSON.features.map((feature) => {
  const centroid = turf.centroid(feature);
  if (centroid.properties) {
    centroid.properties.name = feature.properties.name;
  }
  return centroid;
});

const cityCentroidsFeatureCollection = turf.featureCollection(cityCentroids);

const countryCentroidsFeatureCollection =
  turf.featureCollection(countryCentroids);

const findCityByCoordinates = (lat: number, lon: number) => {
  console.log(citiesGeoJSON);
  console.log(lat, lon);
  const point = turf.point([lon, lat]);

  const inCity = findCityThatContainsPoint(lat, lon);
  if (inCity) {
    const centroid = turf.centroid(inCity);

    console.log(`Inside city: ${inCity}`);
    return [inCity.properties.name, centroid.geometry.coordinates];
  }

  const nearestCity = turf.nearestPoint(point, cityCentroidsFeatureCollection);

  if (nearestCity) {
    console.log(nearestCity);

    const cityName = nearestCity.properties.name || "Unknown City";
    const { name } = nearestCity.properties;
    console.log(`Nearest City: ${name}`);
    return [cityName, nearestCity.geometry.coordinates];
  }

  return null;
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

  const cityPosition = useMemo(() => {
    if (position) {
      return findCityByCoordinates(position[1], position[0]);
    }
    return null;
  }, [position]);

  const countryPosition = useMemo(() => {
    if (position) {
      return findCountryByCoordinates(position[1], position[0]);
    }
    return null;
  }, [position]);

  // Update user's location when the marker is placed or moved
  const updateUserLocation = async (coords: [number, number]) => {
    console.log(coords);

    const country = findCountryByCoordinates(coords[1], coords[0]);
    const city = findCityByCoordinates(coords[1], coords[0]);

    console.log(country, city);

    try {
      const response = await axios.put(
        `${backendURL}/api/users/${userId}/location`,
        {
          coordinates: coords,
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
      {cityPosition && (
        <div>
          <p>
            City: {cityPosition[0]} <br />
            Coordinates: {cityPosition[1].join(", ")}
          </p>
        </div>
      )}
      {countryPosition && (
        <div>
          <p>
            Country: {countryPosition[0]} <br />
            Coordinates: {countryPosition[1].join(", ")}
          </p>
        </div>
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
