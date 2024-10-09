import countryData from "../datasets/countryData.json";
import countryLabels from "../datasets/countryLabels.json";
import cities500 from "../datasets/cities500.json";
import cityData from "../datasets/citiesData.json";
import * as turf from "@turf/turf";
import { Polygon, MultiPolygon, Point } from "geojson";
import { nanoid } from "nanoid";
import { writeFileSync } from "fs";
// const jsonToWrite = {
//   type: "FeatureCollection",
//   features: assembledData,
// };

// writeFileSync(
//   "countryDataWithLabels.json",
//   JSON.stringify(jsonToWrite, null, 2)
// );

// console.log(assembledData);

const typedCountryLabelsJSON = countryLabels as unknown as CountryLabelsJSON;

type PolygonFeature = {
  type: "Feature";
  geometry: Polygon | MultiPolygon;
  properties: {
    ADMIN: string;
    ISO_A2: string;
    FIPS_10_: string;
    ISO_A3: string;
    CONTINENT: string;
    REGION_UN: string;
    SUBREGION: string;
  };
};

export const findLabelPoint = (polygonFeature: PolygonFeature) => {
  const foundLabel = typedCountryLabelsJSON.features.find((feature) => {
    return (
      polygonFeature.properties.ADMIN === feature.properties.int_name ||
      polygonFeature.properties.ISO_A2 === feature.properties["ISO3166-1"] ||
      polygonFeature.properties.ADMIN === feature.properties.name ||
      polygonFeature.properties.ISO_A2 ===
        feature.properties.country_code_iso3166_1_alpha_2 ||
      polygonFeature.properties.FIPS_10_ ===
        feature.properties.country_code_fips ||
      polygonFeature.properties.ISO_A2 ===
        feature.properties["ISO3166-1:alpha2"] ||
      polygonFeature.properties.ADMIN === feature.properties["name:en"]
    );
  });

  if (!foundLabel) {
    return null;
  }

  return foundLabel;
};

const typedWorldGeoJSON = countryData as unknown as WorldGeoJSON;

export type CountryLabelsJSON = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    geometry: Point;
    properties: {
      name: string;
      "ISO3166-1": string;
      int_name: string;
      country_code_iso3166_1_alpha_2: string;
      country_code_fips: string;
      "ISO3166-1:alpha2": string;
      "name:en": string;
    };
  }[];
};

export type WorldGeoJSON = {
  type: "FeatureCollection";
  features: PolygonFeature[];
};

// const typedCountryLabelsJSON = countryLabels as unknown as CountryLabelsJSON;

// const typedCitiesGeoJSON = citiesGeoJSON as CitiesGeoJSON;

const goodCountriesData = typedWorldGeoJSON.features.map((feature) => {
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
    type: "Feature" as const,
    geometry: feature.geometry,
    properties: {
      id: nanoid(),
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

const typedCities1000 = cityData as CityData;

export type CityData = {
  type: "FeatureCollection";
  features: [
    {
      type: "Feature";
      properties: { name: string };
      geometry: Polygon | MultiPolygon;
    }
  ];
};

function findCountry(point: Point) {
  for (const feature of goodCountriesData) {
    if (turf.booleanPointInPolygon(point, feature)) {
      return feature;
    }
  }
}

type City = {
  name: string;
  country: string;
  lat: string;
  lon: string;
  pop: string;
  id: string;
  admin: string;
};

const countriesByISO2 = typedWorldGeoJSON.features.reduce((acc, feature) => {
  acc[feature.properties.ISO_A2] = feature;
  return acc;
}, {} as Record<string, PolygonFeature>);

const countriesByFIPS_10_ = typedWorldGeoJSON.features.reduce(
  (acc, feature) => {
    acc[feature.properties.FIPS_10_] = feature;
    return acc;
  },
  {} as Record<string, PolygonFeature>
);

// console.log(countriesByISO2);

function findInCountryLabels(country: string) {
  const foundCountry = typedCountryLabelsJSON.features.find((feature) => {
    return (
      country === feature.properties["ISO3166-1"] ||
      country === feature.properties.country_code_iso3166_1_alpha_2 ||
      country === feature.properties.country_code_fips ||
      country === feature.properties["ISO3166-1:alpha2"]
    );
  });
  return foundCountry;
}

const typedCities500 = cities500 as City[];
console.log(typedCities1000.features.length);
console.log(typedCities500.length);

// const cityCentroids = typedCities1000.features.map((feature) => {
//   const centroid = turf.centroid(feature);
//   if (centroid.properties) {
//     centroid.properties.name = feature.properties.name;
//   }
//   return centroid;
// });

// const cityCentroidsFeatureCollection = turf.featureCollection(cityCentroids);

export const countriesById = goodCountriesData.reduce((acc, feature) => {
  acc[feature.properties.id] = feature;
  return acc;
}, {} as Record<string, (typeof goodCountriesData)[0]>);

const goodCitiesData = typedCities500.map((city) => {
  const point = turf.point([parseFloat(city.lon), parseFloat(city.lat)]);
  const withinCountry = findCountry(point.geometry);

  // const nearestCity = turf.nearestPoint(
  //   point,
  //   cityCentroidsFeatureCollection
  // );

  const otherWaysToFindCountry =
    countriesByISO2[city.country] ||
    countriesByFIPS_10_[city.country] ||
    findInCountryLabels(city.country);

  const country =
    withinCountry ||
    goodCountriesData.find((feature) => {
      return (
        feature.properties.iso2 === city.country ||
        feature.properties.iso3 === city.country ||
        feature.properties.name === city.country ||
        otherWaysToFindCountry?.properties.ADMIN === city.country
      );
    });

  const cityData = {
    name: city.name,
    country: { id: country?.properties.id, name: country?.properties.name },
    point,
  };
  return cityData;
});

// console.log(goodCitiesData);
// console.log(goodCitiesData.length);
// console.log(goodCitiesData.filter((city) => !city.country.id).length);

writeFileSync(
  "good-cities-data.json",
  JSON.stringify(
    goodCitiesData.filter((city) => city.country.id),
    null,
    2
  )
);

writeFileSync(
  "good-countries-data.json",
  JSON.stringify(goodCountriesData, null, 2)
);

// const codes = moreCities.reduce((acc, city) => {
//   acc.add(city[3]);
//   return acc;
// }, new Set());

// console.log([...codes]);

// const countries = typedCities1000.features.map((feature) => {
//   const centroid = turf.centroid(feature);

//   const country = findCountry(centroid.geometry);
//   return [country?.properties.ADMIN, feature.properties.name];
// });

// console.log(countries);
