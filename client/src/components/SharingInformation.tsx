import { CityAndCountryData } from "../lib/types";
import { normalizeName } from "../lib/consts";
import { findCityAndCountryByCoordinates } from "../lib/findCity";
import { Friend, SharingState } from "../lib/types";

export function getCountryAndCityNameFromFriend(
  data: CityAndCountryData,
  friend: Friend
) {
  const { country, city } = findCityAndCountryByCoordinates(
    data,
    friend.location
  );

  return {
    countryName: normalizeName(country.name),
    cityName: normalizeName(city.name),
  };
}

function resolveSharingState(sharingState: SharingState) {
  const shareCountry = sharingState !== "none";
  const shareCity = sharingState !== "country" && shareCountry;
  return { shareCountry, shareCity };
}

export const SharingInformation = ({
  friend,
  data,
}: {
  friend: Friend;
  data: CityAndCountryData;
}) => {
  if (!data.cityData || !data.countryData) {
    return null;
  }

  const { countryName, cityName } = getCountryAndCityNameFromFriend(
    data,
    friend
  );
  const { shareCountry, shareCity } = resolveSharingState(friend.sharingState);

  return (
    <div className="prose prose-p:!m-0 !text-left m-2">
      <p className="leading-snug">
        <b>{friend.name}</b> is sharing their {friend.sharingState} location.
      </p>
      <div className="mt-4">
        {shareCountry && (
          <p>
            <b>Country:</b> {countryName}
          </p>
        )}
        {shareCity && (
          <p>
            <b>City:</b> {cityName}
          </p>
        )}
        {friend.sharingState === "exact" && (
          <p>
            <b>Lat: </b>
            {friend.location.latitude.toFixed(4)}, <b>Lon:</b>{" "}
            {friend.location.longitude.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
};
