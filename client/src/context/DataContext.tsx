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

export type CityAndCountryData = {
  cityData: CityData | null;
  countryData: CountriesById | null;
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
  cityData: null,
  countryData: null,
});

export const DataProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState({ cityData: null, countryData: null });

  useEffect(() => {
    async function fetchData() {
      console.log("PUBLIC_URL", process.env.PUBLIC_URL);

      try {
        const cityDataResponse = await fetch(
          `${process.env.PUBLIC_URL}/data/cityData.json`
        );
        const cityData = await cityDataResponse.json();

        const countryDataResponse = await fetch(
          `${process.env.PUBLIC_URL}/data/countryData.json`
        );
        const countryData = await countryDataResponse.json();

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
