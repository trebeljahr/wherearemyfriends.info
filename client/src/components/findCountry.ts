// import worldGeoJSON from "geojson-world-map";
import * as turf from "@turf/turf";
// import polylabel from "polylabel";
import countryLabels from "./countryLabels.json";
import countryData from "./countryData.json";

type PolygonFeature = {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
  properties: {
    ADMIN: string;
    ISO_A2: string;
    FIPS_10_: string;
  };
};

const typedWorldGeoJSON = countryData as unknown as WorldGeoJSON;
const typedCountryLabelsJSON = countryLabels as unknown as CountryLabelsJSON;

type CountryLabelsJSON = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    properties: {
      name: string;
      "ISO3166-1": string;
      int_name: string;
      country_code_iso3166_1_alpha_2: string;
      country_code_fips: string;
    };
  }[];
};

type WorldGeoJSON = {
  type: "FeatureCollection";
  features: PolygonFeature[];
};

const countryCentroids = typedWorldGeoJSON.features.map((feature) => {
  const centroid = turf.centroid(feature);
  if (centroid.properties) {
    centroid.properties.ADMIN = feature.properties.ADMIN;
    centroid.properties.ISO_A2 = feature.properties.ISO_A2;
    centroid.properties.FIPS_10_ = feature.properties.FIPS_10_;
  }
  return centroid;
});

const countryCentroidsFeatureCollection =
  turf.featureCollection(countryCentroids);

// Function to find the country for a given point
const findCountryThatContainsPoint = (lat: number, lon: number) => {
  const point = turf.point([lon, lat]); // [longitude, latitude]

  for (const feature of typedWorldGeoJSON.features) {
    if (turf.booleanPointInPolygon(point, feature)) {
      return feature;
    }
  }

  return null;
};

const findLabelPoint = (polygonFeature: PolygonFeature) => {
  const foundLabel = typedCountryLabelsJSON.features.find((feature) => {
    return (
      polygonFeature.properties.ADMIN === feature.properties.int_name ||
      polygonFeature.properties.ISO_A2 === feature.properties["ISO3166-1"] ||
      polygonFeature.properties.ADMIN === feature.properties.name ||
      polygonFeature.properties.ISO_A2 ===
        feature.properties.country_code_iso3166_1_alpha_2 ||
      polygonFeature.properties.FIPS_10_ ===
        feature.properties.country_code_fips
    );
  });

  console.log(polygonFeature.properties.ADMIN);
  console.log(foundLabel?.properties.name);

  if (!foundLabel) {
    console.log("No label found");
    return null;
  }

  return foundLabel;
};

export const findCountryByCoordinates = (lat: number, lon: number) => {
  const point = turf.point([lon, lat]);

  const inCountry = findCountryThatContainsPoint(lat, lon);
  if (inCountry) {
    const centroid = turf.centroid(inCountry);
    // const visualCenter = calculateVisualCenter(inCountry as PolygonFeature);
    // const labelPoint = turf.pointOnFeature(inCountry);
    // const labelPoint = turf.centerOfMass(inCountry);

    const labelPoint = findLabelPoint(inCountry as PolygonFeature);

    const output = labelPoint || centroid;
    return [inCountry.properties.ADMIN, output.geometry.coordinates];
  }

  const nearestCountry = turf.nearestPoint(
    point,
    countryCentroidsFeatureCollection
  );

  if (nearestCountry) {
    const labelPoint = findLabelPoint(
      nearestCountry as unknown as PolygonFeature
    );

    const output = labelPoint || nearestCountry;

    return [nearestCountry.properties.name, output.geometry.coordinates];
  }

  return null;
};

// const calculateVisualCenter = (polygonFeature: PolygonFeature) => {
//   const coordinates = polygonFeature.geometry.coordinates;
//   const precision = 1.0; // Adjust precision as needed
//   const [lon, lat] = polylabel(coordinates, precision);
//   return turf.point([lon, lat], polygonFeature.properties);
// };