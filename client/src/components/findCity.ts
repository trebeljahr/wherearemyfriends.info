import * as turf from "@turf/turf";
import citiesGeoJSON from "../datasets/citiesData.json";

const typedCitiesGeoJSON = citiesGeoJSON as CitiesGeoJSON;

const cityCentroids = typedCitiesGeoJSON.features.map((feature) => {
  const centroid = turf.centroid(feature);
  if (centroid.properties) {
    centroid.properties.name = feature.properties.name;
  }
  return centroid;
});

const cityCentroidsFeatureCollection = turf.featureCollection(cityCentroids);

export type CitiesGeoJSON = {
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

export const findCityByCoordinates = (lat: number, lon: number) => {
  const point = turf.point([lon, lat]);

  const inCity = findCityThatContainsPoint(lat, lon);
  if (inCity) {
    const centroid = turf.centroid(inCity);

    return {
      name: inCity?.properties.name,
      coordinates: centroid.geometry.coordinates as [number, number],
    };
  }

  const nearestCity = turf.nearestPoint(point, cityCentroidsFeatureCollection);

  if (nearestCity) {
    const cityName = nearestCity.properties.name || "Unknown City";
    return {
      name: cityName,
      coordinates: nearestCity.geometry.coordinates as [number, number],
    };
  }

  return;
};
