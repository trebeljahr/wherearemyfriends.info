import { ProfilePictureUpload } from "src/components/ProfilePictureUpload";
import { ChangePassword } from "src/components/ChangePassword";

export function SettingsPage() {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 ">
      <h1>Profile Settings</h1>

      <ProfilePictureUpload />
      <ChangePassword />
    </div>
  );
}
