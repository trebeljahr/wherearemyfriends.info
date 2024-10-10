import { PickLocation } from "src/components/PickLocation";
import { ProfilePictureUpload } from "src/components/ProfilePictureUpload";

export function ProfilePage() {
  return (
    <div className="pt-24">
      <h1>Profile page</h1>
      <PickLocation />
      <ProfilePictureUpload />
    </div>
  );
}

export default ProfilePage;
