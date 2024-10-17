import { useState } from "react";
import { useAuth } from "../context/auth.context";
import { userService } from "../services/user.service";

export const ProfilePictureUpload = () => {
  const { user, refreshUser } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
      await userService.uploadProfilePicture(selectedFile);

      setUploading(false);
      await refreshUser();
      alert("Profile picture uploaded successfully.");
    } catch (error) {
      setUploading(false);
      console.error(error);
      alert("Failed to upload profile picture.");
    }
  };

  return (
    <div>
      <h2>Upload New Profile Picture</h2>
      <img
        src={user?.profilePicture}
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
  return (
    <img
      src={user.profilePicture}
      alt={`${user.username}'s Profile`}
      style={{ width: "150px", height: "150px", borderRadius: "50%" }}
    />
  );
};

export const CurrentUserAvatar = () => {
  const { user } = useAuth();

  return <div>{user && <DisplayUserAvatar user={user} />} </div>;
};
