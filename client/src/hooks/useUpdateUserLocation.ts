import "maplibre-gl/dist/maplibre-gl.css";
import { useAuth } from "../context/auth.context";
import { useData } from "../context/DataContext";
import { findCityAndCountryByCoordinates } from "../lib/findCity";
import { UserLocationData, userService } from "../services/user.service";

export const useUpdateUserLocation = () => {
  const { user, refreshUser } = useAuth();
  const data = useData();

  if (!user || !data.cityData || !data.countryData) {
    return {};
  }

  const updateUserLocation = async (position: [number, number]) => {
    try {
      const { city, country } = findCityAndCountryByCoordinates(data, {
        name: "exactLocation",
        longitude: position[0],
        latitude: position[1],
      });

      const settings = user?.privacySettings;
      const needsCity = settings?.some((s) => s.visibility === "city");
      const needsCountry = settings?.some((s) => s.visibility === "country");
      const needsExact = settings?.some((s) => s.visibility === "exact");

      const update: UserLocationData = {};

      if (needsCity) {
        update.city = city;
      }

      if (needsCountry) {
        update.country = country;
      }

      if (needsExact) {
        update.exact = {
          name: "exactLocation",
          latitude: position[1],
          longitude: position[0],
        };
      }

      await userService.updateUserLocation(update);
      await refreshUser();
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  return { updateUserLocation };
};
