import debounce from "lodash.debounce";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import { cityData, countryData } from "../datasets/datasets";
import { assembleImageUrl, Friend, useFriends } from "./MapWithFriendMarkers";

type OptionType = {
  value: string;
  label: string;
  type: "city" | "country";
};

export const FriendSearch = () => {
  const friends = useFriends();
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<Friend[]>([]);

  const normalizeName = (name: string) => name.trim().toLowerCase();

  // Function to load options asynchronously
  const loadOptions = (
    inputValue: string,
    callback: (options: OptionType[]) => void
  ) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    const inputLower = inputValue.toLowerCase();

    // Filter country options
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

    // Filter city options with a limit
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

  // Debounce the loadOptions function
  const debouncedLoadOptions = debounce(loadOptions, 300);

  const handleSelect = (option: OptionType | null) => {
    setSelectedOption(option);

    if (!option) {
      setFilteredUsers([]);
      return;
    }

    const optionValueLower = normalizeName(option.value);

    const filtered =
      friends.filter((friend) => {
        if (!friend.location) {
          return false;
        }

        const countryName = friend.location.name
          ? normalizeName(friend.location.name)
          : "";
        const cityName = friend.location.name
          ? normalizeName(friend.location.name)
          : "";

        if (option.type === "country") {
          return countryName === optionValueLower;
        } else if (option.type === "city") {
          return cityName === optionValueLower;
        }
        return false;
      }) || [];

    setFilteredUsers(filtered);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Search Users by Location</h2>
      <AsyncSelect
        cacheOptions
        loadOptions={debouncedLoadOptions}
        defaultOptions={false}
        value={selectedOption}
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
      {filteredUsers.length > 0 ? (
        <ul className="list-none p-0">
          {filteredUsers.map((user) => (
            <li key={user.id} className="flex items-center mb-3">
              <img
                src={assembleImageUrl(user.profilePicture)}
                alt={`${user.name}'s profile`}
                className="rounded-full w-10 h-10 mr-3 object-cover"
              />
              <span className="text-lg">{user.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        selectedOption && <p>No users found in this location.</p>
      )}
    </div>
  );
};
