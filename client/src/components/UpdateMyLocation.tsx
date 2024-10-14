import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import { FaInfo, FaLocationCrosshairs } from "react-icons/fa6";
import Map, {
  MapLayerMouseEvent,
  NavigationControl,
} from "react-map-gl/maplibre";
import { ScaleLoader } from "react-spinners";
import { useUpdateUserLocation } from "src/hooks/useUpdateUserLocation";
import { getCurrentLocationFromGps } from "src/lib/getCurrentLocationFromGps";
import { useAuth } from "../context/auth.context";
import { defaultMapSettings } from "../lib/consts";
import { UserLocationMarkers } from "./UserLocationMarkers";

export const UpdateMyLocation = () => {
  const { updateUserLocation } = useUpdateUserLocation();

  if (!updateUserLocation) return null;

  const handleMapClick = async (event: MapLayerMouseEvent) => {
    const { lng, lat } = event.lngLat;
    const newCoordinates: [number, number] = [lng, lat];
    await updateUserLocation(newCoordinates);
  };

  return (
    <div className="prose-p:m-0 mb-5">
      <LocationInfoBox />
      <UseGeolocationButton />
      <Map {...defaultMapSettings} onClick={handleMapClick}>
        <NavigationControl position="top-left" />
        <UserLocationMarkers updateUserLocation={updateUserLocation} />
      </Map>
      <InstructionInfoBox />
    </div>
  );
};

const UseGeolocationButton = () => {
  const { updateUserLocation } = useUpdateUserLocation();
  const [loading, setLoading] = useState(false);

  if (!updateUserLocation) return null;

  const handleLocationfromGPS = async () => {
    try {
      setLoading(true);
      const newPosition = await getCurrentLocationFromGps();
      await updateUserLocation(newPosition);
    } catch (error) {
      console.error("Error using GPS location:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLocationfromGPS}
      className="mb-4 p-2 bg-blue-500 text-white rounded w-56"
    >
      {loading ? (
        <ScaleLoader color="white" height={15} />
      ) : (
        <p>Use My Current Location</p>
      )}
    </button>
  );
};

const InstructionInfoBox = () => {
  return (
    <div className="mt-5 flex bg-slate-200 p-5">
      <FaInfo className="mt-[6px] inline mr-2 rounded-full bg-yellow-400 w-5 h-5 p-[3px]" />

      <p>
        <b>Click on the map to update your location.</b>
        <br />
        Your location will be calculated and shared based on your privacy
        settings, and it's easier to share your exact location when you are
        further zoomed in.
      </p>
    </div>
  );
};

const LocationInfoBox = () => {
  const { user } = useAuth();
  return (
    <div className="mt-2 flex bg-slate-200 p-5 mb-5">
      <FaLocationCrosshairs className="mt-[6px] inline mr-2 rounded-full bg-green-400 w-5 h-5 p-[3px]" />

      <div>
        {user?.location.country ? (
          <p>
            <b>Country: </b>
            {user.location.country.name}
          </p>
        ) : (
          <p>
            You are not sharing your country location with anybody at the
            moment.
          </p>
        )}

        {user?.location.city ? (
          <p>
            <b>City: </b>
            {user.location.city.name}
          </p>
        ) : (
          <p>
            You are not sharing your city location with anybody at the moment.
          </p>
        )}

        {user?.location.exact ? (
          <p>
            <b>Lat:</b> {user.location.exact.latitude}, <b>Lon:</b>{" "}
            {user.location.exact.longitude}
          </p>
        ) : (
          <p>
            You are not sharing your exact location with anybody at the moment.
          </p>
        )}
      </div>
    </div>
  );
};
