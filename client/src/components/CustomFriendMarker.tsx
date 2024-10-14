import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Marker } from "react-map-gl/maplibre";
import { useData } from "src/context/DataContext";
import { Feature } from "src/lib/types";
import { mapSharingStateToMarkerColor } from "src/lib/consts";
import { AvatarPinMarker } from "./AvatarPinMarker";
import { SharingInformation } from "./SharingInformation";
import { Friend } from "src/lib/types";

export const FriendMarkerPin = ({ friend }: { friend: Feature<Friend> }) => {
  const data = useData();
  const [popup, setPopup] = useState<maplibregl.Popup | null>(null);

  useEffect(() => {
    if (!friend.properties) return;

    const popupNode = document.createElement("div");
    const root = createRoot(popupNode);
    root.render(<SharingInformation friend={friend.properties} data={data} />);

    const newPopup = new maplibregl.Popup({ offset: [0, -40] }).setDOMContent(
      popupNode
    );

    setPopup(newPopup);

    return () => {
      newPopup.remove();
    };
  }, [friend, data]);

  const { id, profilePicture, sharingState } = friend.properties;
  const [longitude, latitude] = friend.geometry.coordinates;

  return (
    <Marker
      key={id}
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      popup={popup}
    >
      <AvatarPinMarker
        imgSrc={profilePicture}
        pinColor={mapSharingStateToMarkerColor(sharingState)}
      />
    </Marker>
  );
};
