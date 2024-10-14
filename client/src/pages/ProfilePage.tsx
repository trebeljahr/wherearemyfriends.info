import { UpdateMyLocation } from "src/components/UpdateMyLocation";
import { ProfilePictureUpload } from "src/components/ProfilePictureUpload";

export function ProfilePage() {
  return (
    <div className="pt-24">
      <h1>Profile page</h1>
      <UpdateMyLocation />
      <ProfilePictureUpload />
    </div>
  );
}
