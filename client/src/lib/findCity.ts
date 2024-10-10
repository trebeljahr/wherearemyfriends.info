import * as turf from "@turf/turf";
import {
  CityProperties,
  Feature,
  CityAndCountryData,
} from "src/context/DataContext";
import { SingleLocation } from "src/services/user.service";

export const findCityAndCountryByCoordinates = (
  data: CityAndCountryData,
  { latitude, longitude }: SingleLocation
): { city: SingleLocation; country: SingleLocation } => {
  const point = turf.point([longitude, latitude]);
  const city = turf.nearestPoint(
    point,
    cityData
  ) as unknown as Feature<CityProperties>;

  const countryId = city.properties.country.id;
  const country = countryData[countryId];

  return {
    city: {
      name: city.properties.name,
      latitude: city.geometry.coordinates[1],
      longitude: city.geometry.coordinates[0],
    },
    country: {
      name: country.name,
      latitude: country.labelPoint.coordinates[1],
      longitude: country.labelPoint.coordinates[0],
    },
  };
};
