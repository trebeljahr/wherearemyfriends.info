import "maplibre-gl/dist/maplibre-gl.css";
import { Marker } from "react-map-gl/maplibre";
import { useAuth } from "../context/auth.context";
import { AvatarPinMarker } from "./AvatarPinMarker";

type MarkerProps = {
  updateUserLocation: (newLocation: [number, number]) => void;
};

export const UserLocationMarkers = ({ updateUserLocation }: MarkerProps) => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const markers: React.ReactNode[] = [];

  if (user.location.city) {
    markers.push(
      <Marker
        key="city"
        longitude={user.location.city.longitude}
        latitude={user.location.city.latitude}
        anchor="bottom"
      >
        <AvatarPinMarker
          imgSrc={user.profilePicture}
          pinColor={"rgb(107 114 128)"}
        />
      </Marker>
    );
  }

  if (user.location.country) {
    markers.push(
      <Marker
        key="country"
        longitude={user.location.country.longitude}
        latitude={user.location.country.latitude}
        anchor="bottom"
      >
        <AvatarPinMarker
          imgSrc={user.profilePicture}
          pinColor={"rgb(34 197 94)"}
        />
      </Marker>
    );
  }

  if (user.location.exact) {
    markers.push(
      <Marker
        key="exact"
        longitude={user.location.exact.longitude}
        latitude={user.location.exact.latitude}
        anchor="bottom"
        draggable
        onDragEnd={(event: any) => {
          const { lng, lat } = event.lngLat;
          const newCoordinates: [number, number] = [lng, lat];
          updateUserLocation(newCoordinates);
        }}
      >
        <AvatarPinMarker
          imgSrc={user.profilePicture}
          pinColor={"rgb(248 113 113)"}
        />
      </Marker>
    );
  }

  return <>{markers}</>;
};
