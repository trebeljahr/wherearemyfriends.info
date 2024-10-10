import { useState, useEffect } from "react";
import Select, {
  CSSObjectWithLabel,
  GroupBase,
  OptionsOrGroups,
} from "react-select";
import { useAuth, UserType } from "../context/auth.context";
import { cityData, countryData } from "../datasets/datasets";

type OptionType = {
  value: string;
  label: string;
  type: "city" | "country";
};

// type OptionGroup = {
//   label: string;
//   options: OptionType[];
// };

export const FriendSearch = () => {
  const { user } = useAuth();

  const [options, setOptions] = useState<
    OptionsOrGroups<OptionType, GroupBase<OptionType>>
  >([]);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

  const normalizeName = (name: string) => name.trim().toLowerCase();

  useEffect(() => {
    const processDatasets = () => {
      const cityOptions: OptionType[] = cityData.features.map((feature) => ({
        value: feature.properties.name,
        label: `${feature.properties.name}, ${feature.properties.country.name}`,
        type: "city",
      }));

      const countryOptions: OptionType[] = [];

      Object.keys(countryData).forEach((countryId) => {
        const countryObj = countryData[countryId];
        countryOptions.push({
          value: countryObj.name,
          label: countryObj.name,
          type: "country",
        });
      });

      return [
        { label: "Cities", options: cityOptions },
        { label: "Countries", options: countryOptions },
      ];
    };

    const groupedOptions = processDatasets();
    setOptions(groupedOptions);
  }, []);

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
      <h2>Search Users by Location</h2>
      <Select
        options={options}
        value={selectedOption}
        onChange={handleSelect}
        placeholder="Type a city or country name"
        isClearable={true}
        styles={{
          container: (provided: CSSObjectWithLabel) => ({
            ...provided,
            width: "300px",
            marginBottom: "20px",
          }),
        }}
      />
      {selectedOption && <h3>Users in {selectedOption.label}:</h3>}
      {filteredUsers.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {filteredUsers.map((user) => (
            <li
              key={user._id}
              style={{
                margin: "10px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={user.profilePicture}
                alt={`${user.username}'s profile`}
                width="50"
                height="50"
                style={{
                  borderRadius: "50%",
                  marginRight: "10px",
                  objectFit: "cover",
                }}
              />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      ) : (
        selectedOption && <p>No users found in this location.</p>
      )}
    </div>
  );
};
