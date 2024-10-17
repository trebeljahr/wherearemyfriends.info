// AvatarPinMarker.tsx
import React from "react";

interface AvatarPinMarkerProps {
  imgSrc: string;
  pinColor: string;
}

export const AvatarPinMarker: React.FC<AvatarPinMarkerProps> = ({
  imgSrc,
  pinColor,
}) => {
  return (
    <div
      className={`border border-gray-900 relative h-14 w-14 rounded-full rounded-br-none flex justify-center items-center rotate-45 ${pinColor}`}
    >
      <div
        className="rotate-[-45deg] z-10 border border-gray-900 h-12 w-12 bg-center bg-cover rounded-full"
        style={{ backgroundImage: `url('${imgSrc}')` }}
      />
    </div>
  );
};
