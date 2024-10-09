import React, { useState } from "react";
import { useAuth } from "src/context/auth.context";
import { userService } from "src/services/user.service";
import { assembleImageUrl } from "./MapWithFriendMarkers";

export const ProfilePictureUpload = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target?.files?.[0] || null);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    try {
      setUploading(true);
      const data = await userService.uploadProfilePicture(selectedFile);

      setUploading(false);
      setProfilePicture(data.profilePicture);
      alert("Profile picture uploaded successfully.");
    } catch (error) {
      setUploading(false);
      console.error(error);
      alert("Failed to upload profile picture.");
    }
  };

  return (
    <div>
      <h3>Upload New Profile Picture</h3>
      <img
        src={assembleImageUrl(profilePicture || "/assets/no-user.webp")}
        alt="Profile"
        className="w-36 h-36 rounded-full"
      />

      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

type ApplicationUser = {
  profilePicture: string;
  username: string;
  email: string;
};

export const DisplayUserAvatar = ({ user }: { user: ApplicationUser }) => {
  const profilePicUrl = assembleImageUrl(user.profilePicture);

  return (
    <img
      src={profilePicUrl}
      alt={`${user.username}'s Profile`}
      style={{ width: "150px", height: "150px", borderRadius: "50%" }}
    />
  );
};

export const CurrentUserAvatar = () => {
  const { user } = useAuth();

  return <div>{user && <DisplayUserAvatar user={user} />} </div>;
};
