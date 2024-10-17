import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../context/auth.context";

export const DisplayQRCode: React.FC = () => {
  const { user } = useAuth();

  const profileUrl = `${window.location.origin}/profiles/${user?.username}`;

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">Share Your Profile</h2>
      <QRCodeSVG value={profileUrl} size={200} className="mb-4" />
      <p className="text-gray-700">
        Scan this QR code to view my profile and send me friend request.
      </p>
    </div>
  );
};
