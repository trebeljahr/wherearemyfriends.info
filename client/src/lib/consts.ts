import { ViewState } from "react-map-gl";
import maplibregl from "maplibre-gl";

export const backendURL = import.meta.env.PROD
  ? ""
  : import.meta.env.VITE_SERVER_URL || "https://localhost:5005";

export const tileServerURL = "https://tiles.openfreemap.org/styles/liberty";

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
