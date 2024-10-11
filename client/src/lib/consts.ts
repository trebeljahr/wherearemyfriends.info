export const backendURL =
  process.env.NODE_ENV === "production"
    ? ""
    : process.env.REACT_APP_SERVER_URL || "https://localhost:5005";

export const tileServerURL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

// not working tiles because of usage restrictions/pricing
// "https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png";

// not working due to tile size restrictions
// "https://tiles.openfreemap.org/natural_earth/ne2sr/{z}/{x}/{y}.png";
