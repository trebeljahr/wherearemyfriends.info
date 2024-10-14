// import { Map } from "maplibre-gl";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (!mapContainer.current) return;

    const lng = 139.753;
    const lat = 35.6844;
    const zoom = 14;

    new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [lng, lat],
      zoom: zoom,
    });
  }, []);

  return (
    <div className=" relative w-full h-screen">
      <div ref={mapContainer} className="absolute w-full h-full" />
    </div>
  );
}
