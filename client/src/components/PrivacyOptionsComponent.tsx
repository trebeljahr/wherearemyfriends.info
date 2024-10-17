// PrivacyOptionsComponent.tsx
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { SharingState } from "../lib/types";
import { generateOptions, PrivacyOption } from "./PrivacyOptions";

interface PrivacyOptionComponentProps {
  value: SharingState;
  onChange: (value: SharingState) => void;
}

export const PrivacyOptionsComponent = ({
  value,
  onChange,
}: PrivacyOptionComponentProps) => {
  const options = generateOptions("your");
  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  return (
    <Listbox
      value={selectedOption}
      onChange={(option: PrivacyOption) => onChange(option.value)}
    >
      {({ open }) => (
        <div className="relative">
          <ListboxButton className="relative w-full sm:w-auto p-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <span className="flex items-center">
              {selectedOption.icon}
              <span className="ml-3 block">{selectedOption.label}</span>
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  open ? "transform rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <Transition
            as={"div"}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {open && (
              <ListboxOptions className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <ListboxOption
                    key={option.value}
                    className={({ focus }) =>
                      `${
                        focus ? "bg-blue-600" : ""
                      } cursor-default select-none relative py-2 pl-3 pr-9`
                    }
                    value={option}
                  >
                    {({ selected, focus }) => (
                      <>
                        <div className="flex items-center">
                          {option.icon}
                          <span
                            className={`ml-3 block ${
                              selected ? "font-semibold" : "font-normal"
                            } ${focus ? "text-white" : "text-gray-900"}`}
                          >
                            {option.label}
                          </span>
                        </div>
                        {selected && (
                          <span
                            className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                              focus ? "text-white" : "text-blue-600"
                            }`}
                          >
                            <FaCheck className="w-5 h-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            )}
          </Transition>
        </div>
      )}
    </Listbox>
  );
};
