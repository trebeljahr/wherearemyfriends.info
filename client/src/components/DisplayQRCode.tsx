import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../context/auth.context";

export const DisplayQRCode: React.FC = () => {
  const { user } = useAuth();

  const profileUrl = `${window.location.origin}/profiles/${user?.username}`;

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">Share Your Profile</h2>
      <QRCodeSVG value={profileUrl} size={200} className="mb-4" />
      <p className="text-gray-700 mt-0 prose-a:!underline">
        Scan this QR code to <a href={profileUrl}>view my profile</a> and send
        me a friend request.
      </p>
    </div>
  );
};
