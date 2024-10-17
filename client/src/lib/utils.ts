import { SharingState } from "./types";

export const normalizeName = (name: string) => name.trim();

export const mapSharingStateToMarkerColor = (
  sharingState: SharingState
): string => {
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
};

export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous"; // This enables CORS, if needed
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas is empty"));
        }
      }, "image/jpeg");
    };
    image.onerror = (error) => reject(error);
  });
};
