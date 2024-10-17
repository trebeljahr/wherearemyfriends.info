import { ChangePassword } from "../components/ChangePassword";
import { DisplayQRCode } from "../components/DisplayQRCode";
import { ProfilePictureUpload } from "../components/ProfilePictureUpload";

export function SettingsPage() {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 w-screen">
      <h1>Profile Settings</h1>

      <DisplayQRCode />
      <ProfilePictureUpload />
      <ChangePassword />
    </div>
  );
}
