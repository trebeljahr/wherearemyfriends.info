// import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { useMap } from "react-leaflet";
import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";

const createAvatarMarker = (avatarUrl: string) =>
  new Icon({
    iconUrl: avatarUrl,
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
    className: "avatar-marker",
  });

type FriendLocation = {
  id: string;
  name: string;
  avatar: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
};

const MapComponent: React.FC = () => {
  const [friends, setFriends] = useState<FriendLocation[]>([]);

  // Fetch friends' locations from API
  useEffect(() => {
    const fetchFriendsLocations = async () => {
      try {
        // const response = await fetch("/api/friends/locations"); // Example API endpoint

        // const data: FriendLocation[] = await response.json();

        const data = [
          {
            id: "string",
            name: "Marc",
            avatar: "https://randomuser.me/api/portraits",
            location: {
              coordinates: [52.52, 13.405], // [longitude, latitude]
            },
          } as FriendLocation,
        ];

        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends locations:", error);
      }
    };

    fetchFriendsLocations();
  }, []);

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {friends.map((friend) => (
        <Marker
          key={friend.id}
          position={[
            friend.location.coordinates[1],
            friend.location.coordinates[0],
          ]} // [latitude, longitude]
          icon={createAvatarMarker(friend.avatar)}
        >
          <Popup>
            <div style={{ textAlign: "center" }}>
              <img
                src={friend.avatar}
                alt={friend.name}
                style={{ borderRadius: "50%", width: "50px", height: "50px" }}
              />
              <p>{friend.name}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;

export const MapController = () => {
  const map = useMap();

  useEffect(() => {
    map.addHandler("gestureHandling", GestureHandling);
    // @ts-expect-error typescript does not see additional handler here
    map.gestureHandling.enable();
  }, [map]);

  return null;
};

export function Map() {
  console.log("Map is rendering");
  return (
    <div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "70vh" }}
      >
        <MapController />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
