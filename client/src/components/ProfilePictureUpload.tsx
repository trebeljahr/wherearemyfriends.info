import { useState, useCallback } from "react";
import { useAuth } from "../context/auth.context";
import { userService } from "../services/user.service";
import Cropper from "react-easy-crop";
import Modal from "react-modal";
import { ClipLoader } from "react-spinners";
import { getCroppedImg } from "../lib/utils";

Modal.setAppElement("#root");

export const ProfilePictureUpload = () => {
  const { user, refreshUser } = useAuth();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cropping, setCropping] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setModalIsOpen(true);

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropAndUpload = useCallback(async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        setCropping(true);

        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

        await userService.uploadProfilePicture(croppedBlob);

        await refreshUser();

        setCropping(false);
        setModalIsOpen(false);
      }
    } catch (error) {
      setCropping(false);
      console.error(error);
      alert("Failed to upload profile picture.");
    }
  }, [imageSrc, croppedAreaPixels, refreshUser]);

  return (
    <div className="mb-24">
      <h2>Update Profile Picture</h2>
      <div className="flex flex-col">
        <img
          src={user?.profilePicture || "/default-avatar.png"}
          alt="Profile"
          className="w-36 h-36 rounded-full object-cover mb-4 mt-0"
        />

        <label className="w-fit cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Select Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Crop Image"
        className="relative bg-white rounded-lg overflow-hidden w-full max-w-md mx-auto outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
      >
        {imageSrc ? (
          <div>
            <div className="relative w-full h-80 bg-gray-200">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={onCropChange}
                onCropComplete={onCropComplete}
                onZoomChange={onZoomChange}
              />
            </div>
            <div className="flex justify-end p-4 space-x-2">
              <button
                onClick={() => setModalIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCropAndUpload}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Upload
              </button>
            </div>

            {cropping && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                <ClipLoader size={50} color="#123abc" loading={cropping} />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-80">
            <ClipLoader size={50} color="#123abc" loading={true} />
          </div>
        )}
      </Modal>
    </div>
  );
};
