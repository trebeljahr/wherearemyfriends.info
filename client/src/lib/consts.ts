import { ViewState } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { SharingState } from "./types";

export const backendURL =
  import.meta.env.NODE_ENV === "production"
    ? ""
    : import.meta.env.VITE_SERVER_URL || "https://localhost:5005";

export const normalizeName = (name: string) => name.trim();

export const tileServerURL = "https://tiles.openfreemap.org/styles/liberty";

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
export const defaultMapSettings = {
  initialState: {
    zoom: 1.5,
  } as ViewState,
  center: [100, 20],
  minZoom: 1.5,
  mapLib: maplibregl,
  mapStyle: tileServerURL,
  style: { width: "100%", height: "80vh" },
};
export const assembleImageUrl = (
  img: string = "/assets/no-user.webp"
): string => {
  return img?.startsWith("/") ? `${backendURL}${img}` : img;
};
// old leaflet solutions:
// export const tileServerURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

// not working tiles because of usage restrictions/pricing
// export const tileServerURL = "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png";

// not working due to tile size restrictions
// export const tileServerURL = "https://tiles.openfreemap.org/natural_earth/ne2sr/{z}/{x}/{y}.png";
