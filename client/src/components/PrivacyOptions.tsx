import { FaCity, FaExclamationTriangle, FaMap, FaMapPin } from "react-icons/fa";
import { SharingState } from "../lib/types";

export interface PrivacyOption {
  value: SharingState;
  label: string;
  icon: JSX.Element;
}

export const options: PrivacyOption[] = [
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
