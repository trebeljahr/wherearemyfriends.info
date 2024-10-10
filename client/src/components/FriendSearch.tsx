import { useState } from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { useAuth, UserType } from "../context/auth.context";
import { cityData, countryData } from "../datasets/datasets";

type OptionType = {
  value: string;
  label: string;
  type: "city" | "country";
};

export const FriendSearch = () => {
  const { user } = useAuth();

  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

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
      user?.friends.filter((user) => {
        const countryName = user.location.country?.name
          ? normalizeName(user.location.country.name)
          : "";
        const cityName = user.location.city?.name
          ? normalizeName(user.location.city.name)
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
            <li key={user._id} className="flex items-center mb-3">
              <img
                src={user.profilePicture}
                alt={`${user.username}'s profile`}
                width="50"
                height="50"
                className="rounded-full mr-3 object-cover"
              />
              <span className="text-lg">{user.username}</span>
            </li>
          ))}
        </ul>
      ) : (
        selectedOption && <p>No users found in this location.</p>
      )}
    </div>
  );
};
