import * as turf from "@turf/turf";
import countryData from "../datasets/countryDataWithLabels.json";

const countryCentroids = countryData.features.map((feature: any) => {
  const centroid = turf.centroid(feature.geometry);
  return centroid as GeoJSON.Feature<GeoJSON.Point, GeoJSON.GeoJsonProperties>;
});

const countryCentroidsFeatureCollection =
  turf.featureCollection(countryCentroids);

// Function to find the country for a given point
const findCountryThatContainsPoint = (lat: number, lon: number) => {
  const point = turf.point([lon, lat]); // [longitude, latitude]

  for (const feature of countryData.features as any) {
    if (turf.booleanPointInPolygon(point, feature)) {
      return feature;
    }
  }

  return null;
};

export const findCountryByCoordinates = (lat: number, lon: number) => {
  const point = turf.point([lon, lat]);

  const inCountry = findCountryThatContainsPoint(lat, lon);
  if (inCountry) {
    const centroid = turf.centroid(inCountry);
    // const visualCenter = calculateVisualCenter(inCountry as PolygonFeature);
    // const labelPoint = turf.pointOnFeature(inCountry);
    // const labelPoint = turf.centerOfMass(inCountry);

    const labelPoint = inCountry.properties.labelPoint;

    const output = labelPoint || centroid;
    return {
      name: inCountry.properties.ADMIN,
      coordinates: output.geometry.coordinates as [number, number],
    };
  }

  const nearestCountry = turf.nearestPoint(
    point,
    countryCentroidsFeatureCollection
  );

  if (nearestCountry) {
    const labelPoint = nearestCountry.properties.labelPoint;
    const output = labelPoint || nearestCountry;

    return {
      name: nearestCountry.properties.name,
      coordinates: output.geometry.coordinates as [number, number],
    };
  }
};

// const calculateVisualCenter = (polygonFeature: PolygonFeature) => {
//   const coordinates = polygonFeature.geometry.coordinates;
//   const precision = 1.0; // Adjust precision as needed
//   const [lon, lat] = polylabel(coordinates, precision);
//   return turf.point([lon, lat], polygonFeature.properties);
// };
