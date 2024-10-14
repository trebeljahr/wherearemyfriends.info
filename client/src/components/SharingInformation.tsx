import { CityAndCountryData, useData } from "src/context/DataContext";
import { Friend } from "./MapWithFriendMarkers";
import { SharingState } from "./FriendsharingList";
import { normalizeName } from "src/lib/consts";
import { findCityAndCountryByCoordinates } from "src/lib/findCity";

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

export const SharingInformation = ({ friend }: { friend: Friend }) => {
  const data = useData();

  const { countryName, cityName } = getCountryAndCityNameFromFriend(
    data,
    friend
  );
  const { shareCountry, shareCity } = resolveSharingState(friend.sharingState);

  return (
    <div className="prose prose-p:!m-0 !text-left">
      <p className="leading-snug">
        <b>{friend.name}</b> is sharing their {friend.sharingState} location.
      </p>
      <div className="mt-4">
        {shareCountry && <p>Country: {countryName}</p>}
        {shareCity && <p>City: {cityName}</p>}
        {friend.sharingState === "exact" && (
          <p>
            Lat: {friend.location.latitude.toFixed(4)}, Lon:{" "}
            {friend.location.longitude.toFixed(4)}
          </p>
        )}
      </div>
    </div>
  );
};
