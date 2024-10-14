// MapWithFriendMarkers.tsx
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useMemo, useState } from "react";
import Map, {
  Layer,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl/maplibre";
import { defaultMapSettings } from "src/lib/consts";
import { userService } from "src/services/user.service";
import { AvatarPinMarker } from "./AvatarPinMarker";
import { SharingState } from "./FriendsharingList";
import { SharingInformation } from "./SharingInformation";
import { createRoot } from "react-dom/client";
import { Feature, useData } from "src/context/DataContext";

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
      return "bg-red-400"; // return "rgb(248 113 113)";
    case "city":
      return "bg-cyan-600"; // return "rgb(8 145 178)";
    case "country":
      return "bg-green-500"; // return "rgb(34 197 94)";
    default:
      return "bg-gray-500"; // return "rgb(107 114 128)";
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

const CustomFriendMarker = ({ friend }: { friend: Feature<Friend> }) => {
  const data = useData();
  const popup = useMemo(() => {
    // if (!friend.properties || !data.cityData || !data.countryData) return null;

    console.log(friend);

    let popupNode = document.createElement("div");
    const root = createRoot(popupNode);
    root.render(<SharingInformation friend={friend.properties} data={data} />);

    console.log(popupNode);
    // return new maplibregl.Popup().setDOMContent(popupNode).setOffset([0, -40]);

    // const { longitude: lon, latitude: lat } = friend.properties.location;
    return (
      new maplibregl.Popup()
        // .setLngLat({ lon, lat })
        .setDOMContent(popupNode)
        .setOffset([0, -40])
    );
    // .addTo(map.current);
  }, [friend, data]);

  // const openPopup = ({
  //   longitude,
  //   latitude,
  // }: {
  //   longitude: number;
  //   latitude: number;
  // }) => {
  //   console.log("openPopup", friend, longitude, latitude);
  //   let popupNode = document.createElement("div");
  //   const root = createRoot(popupNode);
  //   root.render(<SharingInformation friend={friend} />);

  //   // return new maplibregl.Popup().setDOMContent(popupNode).setOffset([0, -40]);

  //   new maplibregl.Popup()
  //     .setLngLat({ lon: longitude, lat: latitude })
  //     .setDOMContent(popupNode);
  //   // .addTo(map.current);
  // };

  if (!friend.properties) return null;

  const { id, profilePicture, sharingState } = friend.properties;
  const [longitude, latitude] = friend.geometry.coordinates;

  return (
    <Marker
      key={id}
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      // onClick={() => openPopup({ longitude, latitude })}
      popup={popup}
    >
      <AvatarPinMarker
        imgSrc={profilePicture}
        pinColor={mapSharingStateToMarkerColor(sharingState)}
      />
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
            location: friend.location,
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
    <Map {...defaultMapSettings}>
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
  );
};
