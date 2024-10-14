// AvatarPinMarker.tsx
import React from "react";
import { assembleImageUrl } from "../lib/consts";

interface AvatarPinMarkerProps {
  imgSrc: string;
  pinColor: string;
}

export const AvatarPinMarker: React.FC<AvatarPinMarkerProps> = ({
  imgSrc,
  pinColor,
}) => {
  const imageUrl = assembleImageUrl(imgSrc);

  return (
    <svg
      width="50"
      height="70"
      viewBox="0 0 50 70"
      xmlns="http://www.w3.org/2000/svg"
      stroke="black"
    >
      {/* Define the pin shape */}
      <path
        d="
          M25,0
          C11.1929,0 0,11.1929 0,25
          C0,39.641 25,70 25,70
          C25,70 50,39.641 50,25
          C50,11.1929 38.8071,0 25,0
          Z
        "
        fill={pinColor}
        stroke="black"
        strokeWidth={2}
      />
      {/* Clip the image to the circle shape */}
      <clipPath id="circleClip">
        <circle cx="25" cy="25" r="25" />
      </clipPath>
      {/* Place the profile image */}
      <image
        href={imageUrl}
        x="-20"
        y="0"
        width="100"
        height="50"
        clipPath="url(#circleClip)"
      />
      {/* Add a circle border */}
      <circle cx="25" cy="25" r="25" fill="none" />
    </svg>
  );
};
