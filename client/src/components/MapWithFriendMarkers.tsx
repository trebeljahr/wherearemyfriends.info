import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useState } from "react";
import Map, { NavigationControl } from "react-map-gl/maplibre";
import { defaultMapSettings } from "../lib/consts";
import { Friend } from "../lib/types";
import { userService } from "../services/user.service";
import { FriendMarkerPin } from "./CustomFriendMarker";

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

export const MapWithFriendMarkers: React.FC = () => {
  const friends = useFriends();

  const friendsAsGeojsonData = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: friends
        .filter((friend) => friend.location)
        .map((friend) => ({
          type: "Feature" as const,
          properties: friend,
          geometry: {
            type: "Point" as const,
            coordinates: [friend.location.longitude, friend.location.latitude],
          },
        })),
    }),
    [friends]
  );

  return (
    <Map {...defaultMapSettings}>
      <NavigationControl position="top-left" />

      {friendsAsGeojsonData.features.map((friend) => (
        <FriendMarkerPin key={friend.properties._id} friend={friend} />
      ))}
    </Map>
  );
};
