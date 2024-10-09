import * as turf from "@turf/turf";
import { writeFileSync } from "fs";
import { MultiPolygon, Point, Polygon } from "geojson";
import { nanoid } from "nanoid";
import path from "path";
import cities500 from "../datasets/cities500.json";
import countryData from "../datasets/countryData.json";
import countryLabels from "../datasets/countryLabels.json";

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

const findLabelPoint = (polygonFeature: PolygonFeature) => {
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

type CountryLabelsJSON = {
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

type WorldGeoJSON = {
  type: "FeatureCollection";
  features: PolygonFeature[];
};

const goodCountriesData = typedWorldGeoJSON.features
  .map((feature) => {
    const label = findLabelPoint(feature);

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
  })
  .filter(({ properties: { labelPoint } }) => labelPoint);

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

const countriesById = goodCountriesData.reduce((acc, feature) => {
  acc[feature.properties.id] = {
    name: feature.properties.name,
    labelPoint: feature.properties.labelPoint as Point,
  };
  return acc;
}, {} as Record<string, { name: string; labelPoint: Point }>);

const goodCitiesData = typedCities500.map((city) => {
  const point = turf.point([parseFloat(city.lon), parseFloat(city.lat)]);
  const withinCountry = findCountry(point.geometry);

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

const datasetPath = "./src/datasets/";

const filteredCities = goodCitiesData.filter((city) => city.country.id);

const cityFeatureCollection = turf.featureCollection(
  filteredCities.map((city) => {
    return {
      type: "Feature" as const,
      geometry: city.point.geometry,
      properties: {
        name: city.name,
        country: city.country,
      },
    };
  })
);

writeFileSync(
  path.join(datasetPath, "good-cities-data.json"),
  JSON.stringify(cityFeatureCollection, null, 2)
);

writeFileSync(
  path.join(datasetPath, "good-countries-data.json"),
  JSON.stringify(countriesById, null, 2)
);
