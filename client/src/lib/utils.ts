import { SharingState } from "./types";

export const normalizeName = (name: string) => name.trim();

export const mapSharingStateToMarkerColor = (
  sharingState: SharingState
): string => {
  switch (sharingState) {
    case "exact":
      return "bg-red-400"; // return "rgb(248 113 113)";
    case "city":
      return "bg-cyan-600"; // return "rgb(8 145 178)";
    case "country":
      return "bg-green-500"; // return "rgb(34 197 94)";
    default:
      return "bg-gray-500"; // return "rgb(107 114 128)";
  }
};
