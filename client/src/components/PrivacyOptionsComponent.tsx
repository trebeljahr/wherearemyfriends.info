import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { FaCity, FaExclamationTriangle, FaMap, FaMapPin } from "react-icons/fa";
import { SharingState } from "../lib/types";

interface PrivacyOption {
  value: SharingState;
  label: string;
  icon: JSX.Element;
}

const options: PrivacyOption[] = [
  {
    value: "exact",
    label: "Sharing your exact location",
    icon: <FaMapPin className="w-5 h-5" />,
  },
  {
    value: "city",
    label: "Sharing your city location",
    icon: <FaCity className="w-5 h-5" />,
  },
  {
    value: "country",
    label: "Sharing your country location",
    icon: <FaMap className="w-5 h-5" />,
  },
  {
    value: "none",
    label: "Sharing absolutely no location",
    icon: <FaExclamationTriangle className="w-5 h-5" />,
  },
];

interface PrivacyOptionComponentProps {
  value: SharingState;
  onChange: (value: SharingState) => void;
}

export const PrivacyOptionsComponent = ({
  value,
  onChange,
}: PrivacyOptionComponentProps) => {
  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  return (
    <Listbox
      value={selectedOption}
      onChange={(option: PrivacyOption) => onChange(option.value)}
    >
      {({ open }: { open: boolean }) => (
        <div className="relative">
          <ListboxButton className="relative w-full p-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <span className="flex items-center">
              {selectedOption.icon}
              <span className="ml-3 block truncate">
                {selectedOption.label}
              </span>
            </span>
          </ListboxButton>
          {open && (
            <ListboxOptions className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  className={({ active }: { active: boolean }) =>
                    `${
                      active ? "text-white bg-blue-600" : "text-gray-900"
                    } cursor-default select-none relative py-2 pl-3 pr-9`
                  }
                  value={option}
                >
                  {({
                    selected,
                    active,
                  }: {
                    selected: boolean;
                    active: boolean;
                  }) => (
                    <>
                      <div className="flex items-center">
                        {option.icon}
                        <span
                          className={`${
                            selected ? "font-semibold" : "font-normal"
                          } ml-3 block truncate`}
                        >
                          {option.label}
                        </span>
                      </div>
                      {selected ? (
                        <span
                          className={`${
                            active ? "text-white" : "text-blue-600"
                          } absolute inset-y-0 right-0 flex items-center pr-4`}
                        >
                          {/* Optional: Add a checkmark icon here */}
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          )}
        </div>
      )}
    </Listbox>
  );
};
