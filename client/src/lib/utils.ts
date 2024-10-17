import { SharingState } from "./types";

export const normalizeName = (name: string) => name.trim();

export const mapSharingStateToMarkerColor = (
  sharingState: SharingState
): string => {
  switch (sharingState) {
    case "exact":
      return "bg-red-400";
    case "city":
      return "bg-cyan-600";
    case "country":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};
