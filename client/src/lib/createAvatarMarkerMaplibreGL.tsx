import { backendURL } from "./consts";

export const createAvatarMarkerMapLibreGL = (
  imgSrc: string,
  bgColorClass: string = "bg-slate-900"
) => {
  return (
    <div
      className={`rounded-full ${bgColorClass} w-12 h-12 flex items-center justify-center`}
    >
      <img
        src={assembleImageUrl(imgSrc)}
        alt="Profile"
        className="rounded-full w-10 h-10"
      />
    </div>
  );
};

export const assembleImageUrl = (
  img: string = "/assets/no-user.webp"
): string => {
  return img?.startsWith("/") ? `${backendURL}${img}` : img;
};
