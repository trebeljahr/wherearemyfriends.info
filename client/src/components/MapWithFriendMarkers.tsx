// MapWithFriendMarkers.tsx
import maplibregl, { Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, {
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl/maplibre";
import { tileServerURL } from "src/lib/consts";
import { userService } from "src/services/user.service";
import {
  assembleImageUrl,
  createAvatarMarkerMapLibreGL,
} from "../lib/createAvatarMarkerMaplibreGL";
import { SharingState } from "./FriendsharingList";

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

function mapSharingStateToMarkerColor(sharingState: SharingState): string {
  switch (sharingState) {
    case "exact":
      return "bg-red-400";
    case "city":
      return "bg-cyan-600";
    case "country":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
}

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

const CustomFriendMarker = ({ friend }: { friend: any }) => {
  const popup = useMemo(() => {
    return new maplibregl.Popup().setText("Hello world!").setOffset([0, -40]);
  }, []);

  if (!friend.properties) return null;

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
      {createAvatarMarkerMapLibreGL(
        profilePicture,
        mapSharingStateToMarkerColor(sharingState as SharingState)
      )}
    </Marker>
  );
};

export const MapWithFriendMarkers: React.FC = () => {
  const friends = useFriends();

  const friendsAsGeojsonData = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: friends
        .filter((friend) => friend.location)
        .map((friend) => ({
          type: "Feature" as const,
          properties: {
            id: friend.id,
            name: friend.name,
            profilePicture: friend.profilePicture,
            sharingState: friend.sharingState,
            locationName: friend.location.name,
          },
          geometry: {
            type: "Point" as const,
            coordinates: [friend.location.longitude, friend.location.latitude],
          },
        })),
    }),
    [friends]
  );

  return (
    <div style={{ height: "80vh", width: "100%" }}>
      <Map
        initialViewState={{
          longitude: 0,
          latitude: 0,
          zoom: 0,
        }}
        style={{ width: "100%", height: "100vh" }}
        mapStyle={tileServerURL}
      >
        <NavigationControl position="top-left" />
        <Source
          id="friends"
          type="geojson"
          data={friendsAsGeojsonData}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer
            id="clusters"
            type="circle"
            source="friends"
            filter={["has", "point_count"]}
            paint={{
              "circle-color": "#1E3A8A",
              "circle-radius": [
                "step",
                ["get", "point_count"],
                50,
                10,
                100,
                30,
                750,
              ],
              "circle-opacity": 1,
            }}
          />
          <Layer
            id="cluster-count"
            type="symbol"
            source="friends"
            filter={["has", "point_count"]}
            layout={{
              "text-field": "{point_count_abbreviated}",
              "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
              "text-size": 14,
            }}
            paint={{
              "text-color": "#FFFFFF",
            }}
          />
          <Layer
            id="unclustered-point"
            type="symbol"
            source="friends"
            filter={["!", ["has", "point_count"]]}
            layout={{
              "icon-image": "custom-marker",
              "icon-size": 1,
              "icon-allow-overlap": true,
            }}
          />
        </Source>

        {friendsAsGeojsonData.features.map((friend) => (
          <CustomFriendMarker friend={friend} />
        ))}
      </Map>
    </div>
  );
};
