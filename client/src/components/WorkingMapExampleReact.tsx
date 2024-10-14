import Map from "react-map-gl/maplibre";
import { tileServerURL } from "src/lib/consts";
import "maplibre-gl/dist/maplibre-gl.css";

export function MapComponentReact() {
  return (
    <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14,
      }}
      style={{ width: 600, height: 400 }}
      mapStyle={tileServerURL}
    />
  );
}
