import { findLabelPoint, WorldGeoJSON } from "../components/findCountry";
import countryData from "../datasets/countryData.json";
import { writeFileSync } from "fs";

const typedWorldGeoJSON = countryData as unknown as WorldGeoJSON;
// const typedCountryLabelsJSON = countryLabels as unknown as CountryLabelsJSON;

// const typedCitiesGeoJSON = citiesGeoJSON as CitiesGeoJSON;

const assembledData = typedWorldGeoJSON.features.map((feature) => {
  const label = findLabelPoint(feature);

  // label?.geometry.
  // const name = label?.properties.int_name;
  const name = feature.properties.ADMIN;
  const iso2 = feature.properties.ISO_A2;
  const iso3 = feature.properties.ISO_A3;

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: feature.geometry.coordinates,
    },
    properties: {
      name,
      labelPoint: label?.geometry,
      iso2,
      iso3,
      continent: feature.properties.CONTINENT,
      region: feature.properties.REGION_UN,
      subregion: feature.properties.SUBREGION,
    },
  };
});

const jsonToWrite = {
  type: "FeatureCollection",
  features: assembledData,
};

writeFileSync(
  "countryDataWithLabels.json",
  JSON.stringify(jsonToWrite, null, 2)
);

console.log(assembledData);
