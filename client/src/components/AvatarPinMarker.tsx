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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="circleView">
          <circle cx="25" cy="25" r="22" />
        </clipPath>
      </defs>
      <path
        d="M25 0C11.1929 0 0 11.1929 0 25C0 44 25 70 25 70C25 70 50 44 50 25C50 11.1929 38.8071 0 25 0Z"
        fill={pinColor}
        stroke={pinColor}
        strokeWidth="2"
      />
      <image
        href={imageUrl}
        x="3"
        y="3"
        width="44"
        height="44"
        clipPath="url(#circleView)"
      />
    </svg>
  );
};
