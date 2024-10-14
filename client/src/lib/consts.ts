import { ViewState } from "react-map-gl";
import maplibregl from "maplibre-gl";

export const backendURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_SERVER_URL || "https://localhost:5005";

export const normalizeName = (name: string) => name.trim();

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
// old leaflet solutions:
// export const tileServerURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

// not working tiles because of usage restrictions/pricing
// export const tileServerURL = "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png";

// not working due to tile size restrictions
// export const tileServerURL = "https://tiles.openfreemap.org/natural_earth/ne2sr/{z}/{x}/{y}.png";
