import * as turf from "@turf/turf";
import { Point } from "geojson";
import goodCityData from "../datasets/good-cities-data.json";
import goodCountryData from "../datasets/good-countries-data.json";
import { SingleLocation } from "src/services/user.service";

interface GeoJsonData<T> {
  type: "FeatureCollection";
  features: Feature<T>[];
}

interface Feature<T> {
  type: "Feature";
  geometry: Point;
  properties: T;
}

interface CountryProperties {
  id: string;
  name: string;
}

interface CityProperties {
  name: string;
  country: CountryProperties;
}

interface CountriesById {
  [id: string]: CountryProperties & { labelPoint: Point };
}

const typedGoodCityData = goodCityData as GeoJsonData<CityProperties>;
const typedGoodCountryData = goodCountryData as unknown as CountriesById;

export const findCityAndCountryByCoordinates = (
  lat: number,
  lon: number
): { city: SingleLocation; country: SingleLocation } => {
  const point = turf.point([lon, lat]);
  const city = turf.nearestPoint(
    point,
    typedGoodCityData
  ) as unknown as Feature<CityProperties>;

  const countryId = city.properties.country.id;
  const country = typedGoodCountryData[countryId];
  console.log(city, country);

  return {
    city: {
      name: city.properties.name,
      coordinates: city.geometry.coordinates as [number, number],
    },
    country: {
      name: country.name,
      coordinates: country.labelPoint.coordinates as [number, number],
    },
  };
};
