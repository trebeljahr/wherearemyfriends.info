import { ProfilePictureUpload } from "src/components/ProfilePictureUpload";

export function ProfileSettingsPage() {
  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 ">
      <h1>Profile Settings</h1>
      <ProfilePictureUpload />
    </div>
  );
}
