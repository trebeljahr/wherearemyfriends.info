// import "leaflet/dist/leaflet.css";
import { DivIcon, divIcon } from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { useMap } from "react-leaflet";
import { userService } from "src/services/user.service";
import { backendURL } from "./FriendsharingList";

export const assembleImageUrl = (img?: string) => {
  return img?.startsWith("/") ? `${backendURL}${img}` : img;
};

export const createAvatarMarker = (
  img: string,
  color: string = "cyan-600"
): DivIcon => {
  const imgUrl = assembleImageUrl(img);

  return divIcon({
    html: `
      <div class="custom-pin bg-${color}">
        <div class="avatar-circle" style="background-image: url('${imgUrl}');"></div>
      </div>
    `,
    className: "custom-avatar-marker", // Class for the custom marker
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    iconSize: [40, 40],
  });
};

export type Friend = {
  id: string;
  name: string;
  profilePicture: string;
  sharingState: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
};

export const MapWithFriendMarkers: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);

  // Fetch friends' locations from API
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

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "80vh", width: "80vw" }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapController />

      {friends.map((friend) => {
        console.log(friend);

        if (!friend.location) {
          return null;
        }

        return (
          <Marker
            key={friend.id}
            position={[friend.location.latitude, friend.location.longitude]}
            icon={createAvatarMarker(friend.profilePicture)}
          >
            <Popup>
              <div style={{ textAlign: "center" }}>
                <p>{friend.name}</p>
                <p>{friend.sharingState}</p>
                <p>{friend.location.name}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export const MapController = () => {
  const map = useMap();

  useEffect(() => {
    map.addHandler("gestureHandling", GestureHandling);
    // @ts-expect-error typescript does not see additional handler here
    map.gestureHandling.enable();
  }, [map]);

  return null;
};
