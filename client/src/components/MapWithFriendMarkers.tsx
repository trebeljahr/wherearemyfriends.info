import L, { DivIcon, divIcon, MarkerCluster } from "leaflet";
import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { userService } from "src/services/user.service";
import { backendURL, SharingState } from "./FriendsharingList";
import { SharingInformation } from "./FriendSearch";

export const assembleImageUrl = (img?: string) => {
  return img?.startsWith("/") ? `${backendURL}${img}` : img;
};

export const createAvatarMarker = (
  img: string,
  color: string = "bg-slate-500"
): DivIcon => {
  const imgUrl = assembleImageUrl(img);

  return divIcon({
    html: `
      <div class="custom-pin ${color}">
        <div class="avatar-circle" style="background-image: url('${imgUrl}');"></div>
      </div>
    `,
    className: "",
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    iconSize: [40, 40],
  });
};

const createClusterCustomIcon = function (cluster: MarkerCluster) {
  const count = cluster.getChildCount();

  return L.divIcon({
    html: `
      <div class="font-bold w-10 h-10 flex items-center justify-center text-white bg-slate-900 rounded-full">
        ${count}
      </div>
    `,
    className: "custom-cluster-icon",
    iconSize: [40, 40],
  });
};

function mapSharingStateToMarkerColor(sharingState: SharingState) {
  switch (sharingState) {
    case "exact":
      return "bg-red-400";
    case "city":
      return "bg-cyan-600";
    case "country":
      return "bg-green-500";
    default:
      return undefined;
  }
}

export type Friend = {
  id: string;
  name: string;
  profilePicture: string;
  sharingState: SharingState;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
};

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const fetchFriendsLocations = async () => {
      try {
        const friendDataFromAPI = await userService.fetchFriends();
        setFriends(friendDataFromAPI);
      } catch (error) {
        console.error("Error fetching friends locations:", error);
      }
    };

    fetchFriendsLocations();
  }, []);

  return friends;
}

export const MapWithFriendMarkers = () => {
  const friends = useFriends();

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "80vh", width: "calc(100vw-10px)" }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapController />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createClusterCustomIcon}
        spiderfyOnMaxZoom={false}
        showCoverageOnHover={false}
      >
        {friends
          .filter((friend) => friend.location)
          .map((friend) => {
            return (
              <Marker
                key={friend.id}
                position={[friend.location.latitude, friend.location.longitude]}
                icon={createAvatarMarker(
                  friend.profilePicture,
                  mapSharingStateToMarkerColor(friend.sharingState)
                )}
              >
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <SharingInformation friend={friend} />
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export const MapController = () => {
  const map = useMap();

  useEffect(() => {
    map.addHandler("gestureHandling", GestureHandling);
    // @ts-expect-error
    map.gestureHandling.enable();
  }, [map]);

  return null;
};
