// DataContext.js
import {
  createContext,
  FC,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { Point } from "geojson";

export interface Feature<T> {
  type: "Feature";
  geometry: Point;
  properties: T;
}

export interface CityProperties {
  name: string;
  country: CountryProperties;
}

export type CityData = GeoJsonData<CityProperties>;

export type CountryData = CountriesById;

export type CityAndCountryData = {
  cityData: CityData;
  countryData: CountryData;
};

interface GeoJsonData<T> {
  type: "FeatureCollection";
  features: Feature<T>[];
}

interface CountryProperties {
  id: string;
  name: string;
}

interface CountriesById {
  [id: string]: CountryProperties & { labelPoint: Point };
}

export const DataContext = createContext<CityAndCountryData>({
  cityData: null!,
  countryData: null!,
});

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<CityAndCountryData>({
    cityData: null!,
    countryData: null!,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const cityDataResponse = await fetch("/data/cityData.json");
        const cityData = (await cityDataResponse.json()) as CityData;

        const countryDataResponse = await fetch("/data/countryData.json");
        const countryData = (await countryDataResponse.json()) as CountryData;

        setData({ cityData, countryData });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);
