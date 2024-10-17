import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { FaCheck } from "react-icons/fa";
import { SharingState } from "../lib/types";
import { options, PrivacyOption } from "./PrivacyOptions";

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
      {({ open }) => (
        <div className="relative">
          <ListboxButton className="relative w-full p-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <span className="flex items-center">
              {selectedOption.icon}
              <span className="ml-3 block truncate">
                {selectedOption.label}
              </span>
            </span>
          </ListboxButton>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-20 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  className={({ focus }) =>
                    `${
                      focus ? "text-white bg-blue-600" : "text-gray-900"
                    } cursor-default select-none relative py-2 pl-3 pr-9`
                  }
                  value={option}
                >
                  {({ selected, focus }) => (
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
                      {selected && (
                        <span
                          className={`${
                            focus ? "text-white" : "text-blue-600"
                          } absolute inset-y-0 right-0 flex items-center pr-4`}
                        >
                          <FaCheck className="w-5 h-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};
