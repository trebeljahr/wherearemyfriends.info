import { FaCity, FaExclamationTriangle, FaMap, FaMapPin } from "react-icons/fa";
import { SharingState } from "../lib/types";

export interface PrivacyOption {
  value: SharingState;
  label: string;
  icon: JSX.Element;
}

export const generateOptions = (
  pronoun: "their" | "your" = "your"
): PrivacyOption[] => [
  {
    value: "exact",
    label: `Sharing ${pronoun} exact location`,
    icon: <FaMapPin className="w-5 h-5 text-red-400" />,
  },
  {
    value: "city",
    label: `Sharing ${pronoun} city location`,
    icon: <FaCity className="w-5 h-5 text-cyan-600" />,
  },
  {
    value: "country",
    label: `Sharing ${pronoun} country location`,
    icon: <FaMap className="w-5 h-5 text-green-500" />,
  },
  {
    value: "none",
    label: "Sharing absolutely no location",
    icon: <FaExclamationTriangle className="w-5 h-5 text-yellow-500" />,
  },
];
