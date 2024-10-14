import debounce from "lodash/debounce";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import { useData } from "src/context/DataContext";
import { normalizeName } from "src/lib/consts";
import { assembleImageUrl } from "src/lib/consts";
import { Friend, useFriends } from "./MapWithFriendMarkers";
import {
  getCountryAndCityNameFromFriend,
  SharingInformation,
} from "./SharingInformation";

type OptionType = {
  value: string;
  label: string;
  type: "city" | "country";
};

export const FriendSearch = () => {
  const friends = useFriends();
  const { cityData, countryData } = useData();
  const data = { cityData, countryData };

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);

  if (!cityData || !countryData) {
    return null;
  }

  const loadOptions = (
    inputValue: string,
    callback: (options: OptionType[]) => void
  ) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    const inputLower = inputValue.toLowerCase();

    const countryOptions: OptionType[] = Object.keys(countryData)
      .filter((countryId) => {
        const countryName = countryData[countryId].name;
        return countryName.toLowerCase().includes(inputLower);
      })
      .map((countryId) => {
        const countryName = countryData[countryId].name;
        return {
          value: countryName,
          label: countryName,
          type: "country",
        };
      });

    const maxCities = 50;
    const cityOptions: OptionType[] = [];
    let cityCount = 0;

    for (
      let i = 0;
      i < cityData.features.length && cityCount < maxCities;
      i++
    ) {
      const feature = cityData.features[i];
      const cityName = feature.properties.name;
      const countryName = feature.properties.country.name;

      if (
        cityName.toLowerCase().includes(inputLower) ||
        countryName.toLowerCase().includes(inputLower)
      ) {
        cityOptions.push({
          value: cityName,
          label: `${cityName}, ${countryName}`,
          type: "city",
        });
        cityCount++;
      }
    }

    const options = [...countryOptions, ...cityOptions];
    callback(options);
  };

  const debouncedLoadOptions = debounce(loadOptions, 300);

  const handleSelect = (option: OptionType | null) => {
    setSelectedOption(option);

    if (!option) {
      setFilteredFriends([]);
      return;
    }

    const optionValueLower = normalizeName(option.value);

    const filtered =
      friends.filter((friend) => {
        if (!friend.location) {
          return false;
        }
        const { countryName, cityName } = getCountryAndCityNameFromFriend(
          data,
          friend
        );

        if (option.type === "country") {
          return countryName === optionValueLower;
        } else if (option.type === "city") {
          return cityName === optionValueLower;
        }
        return false;
      }) || [];

    setFilteredFriends(filtered);
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Search Users by Location
        </h2>
        <AsyncSelect
          cacheOptions
          loadOptions={debouncedLoadOptions}
          defaultOptions={false}
          value={selectedOption}
          openMenuOnClick={false}
          onChange={handleSelect}
          placeholder="Type a city or country name"
          isClearable={true}
          className="w-72 mb-5 relative z-[1100]"
        />
        {selectedOption && (
          <h3 className="text-xl font-medium mb-3">
            Users in {selectedOption.label}:
          </h3>
        )}

        {filteredFriends.length > 0 ? (
          <ul className="list-none p-0">
            {filteredFriends.map((friend) => {
              return (
                <li
                  key={friend.id}
                  className="flex items-center my-6 not-prose space-x-4"
                >
                  <img
                    src={assembleImageUrl(friend.profilePicture)}
                    alt={`${friend.name}'s profile`}
                    className="rounded-full w-10 h-10 object-cover"
                  />
                  <SharingInformation friend={friend} data={data} />
                </li>
              );
            })}
          </ul>
        ) : (
          selectedOption && <p>No users found in this location.</p>
        )}
      </div>
    </>
  );
};
