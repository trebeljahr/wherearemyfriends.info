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

  const continent = feature.properties.CONTINENT;
  const region = feature.properties.REGION_UN;
  const subregion = feature.properties.SUBREGION;

  if (
    !name ||
    !iso2 ||
    !iso3 ||
    !continent ||
    !region ||
    !subregion ||
    !label
  ) {
    console.log("Missing data for", {
      name,
      iso2,
      iso3,
      continent,
      region,
      subregion,
      label,
    });
  }

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
      continent,
      region,
      subregion,
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

// console.log(assembledData);
