// import "leaflet/dist/leaflet.css";
import { DivIcon, divIcon } from "leaflet";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { GestureHandling } from "leaflet-gesture-handling";
import "leaflet-gesture-handling/dist/leaflet-gesture-handling.css";
import { useMap } from "react-leaflet";

export const createAvatarMarker = (
  avatarUrl: string,
  color: string = "cyan-600"
): DivIcon => {
  return divIcon({
    html: `
      <div class="custom-pin bg-${color}">
        <div class="avatar-circle" style="background-image: url('${avatarUrl}');"></div>
      </div>
    `,
    className: "custom-avatar-marker", // Class for the custom marker
    iconAnchor: [20, 40], // Adjust this based on pin and avatar size
    popupAnchor: [0, -40], // Adjust for popup placement
    iconSize: [40, 40], // Size of the overall marker (including pin)
  });
};

type FriendLocation = {
  id: string;
  name: string;
  avatar: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
};

export const MapComponent: React.FC = () => {
  const [friends, setFriends] = useState<FriendLocation[]>([]);

  // Fetch friends' locations from API
  useEffect(() => {
    const fetchFriendsLocations = async () => {
      try {
        // const response = await fetch("/api/friends/locations"); // Example API endpoint

        // const data: FriendLocation[] = await response.json();

        // const user = await fetch("https://randomuser.me/api/");
        // const userData = await user.json();

        const data: FriendLocation[] = [
          {
            id: "string",
            name: "Sabine",
            avatar: "https://randomuser.me/api/portraits/thumb/women/40.jpg", //userData.results[0].picture.thumbnail,
            location: {
              coordinates: [52.52, 13.405], // [longitude, latitude]
            },
          },
          {
            id: "string",
            name: "Marc",
            avatar: "https://randomuser.me/api/portraits/thumb/men/40.jpg", //userData.results[0].picture.thumbnail,
            location: {
              coordinates: [30.52, 10.405], // [longitude, latitude]
            },
          },
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
      center={[0, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapController />

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

export const MapController = () => {
  const map = useMap();

  useEffect(() => {
    map.addHandler("gestureHandling", GestureHandling);
    // @ts-expect-error typescript does not see additional handler here
    map.gestureHandling.enable();
  }, [map]);

  return null;
};
