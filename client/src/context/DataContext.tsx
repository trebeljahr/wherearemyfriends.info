import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CityAndCountryData, CityData, CountryData } from "../lib/types";

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
