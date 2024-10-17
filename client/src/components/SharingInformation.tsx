import { CityAndCountryData, SingleLocation } from "../lib/types";
import { normalizeName } from "../lib/utils";
import { findCityAndCountryByCoordinates } from "../lib/findCity";
import { Friend, SharingState } from "../lib/types";

export function DisplayExactLocation({
  location,
}: {
  location: SingleLocation;
}) {
  return (
    <div className="flex flex-wrap">
      <span className="mr-2">
        <b>Lat:</b>
        {location.latitude.toFixed(4)}
      </span>
      <span>
        <b>Lon:</b> {location.longitude.toFixed(4)}
      </span>
    </div>
  );
}

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
        <b>{friend.username}</b> is sharing their {friend.sharingState} location
        with you.
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
          <DisplayExactLocation location={friend.location} />
        )}
      </div>
    </div>
  );
};
