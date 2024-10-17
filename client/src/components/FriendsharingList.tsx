import { useState, Fragment } from "react";
import { FaTrash, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/auth.context";
import { SharingState } from "../lib/types";
import { userService } from "../services/user.service";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { PrivacyOptionsComponent } from "./PrivacyOptionsComponent";
import { FaCog } from "react-icons/fa";
import { options } from "./PrivacyOptions";

export const FriendsPrivacySettings = () => {
  const { user, refreshUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  const handleSharingStateChange = async (
    friendId: string,
    newState: SharingState
  ) => {
    try {
      await userService.updateFriendPrivacy(friendId, newState);
      await refreshUser();
    } catch (error) {
      console.error("Error updating privacy setting:", error);
    }
  };

  const updateDefaultPrivacy = async (newState: SharingState) => {
    try {
      await userService.updateDefaultPrivacy(newState);
      await refreshUser();
    } catch (error) {
      console.error("Error updating default privacy setting:", error);
    }
  };

  if (!user) {
    return null;
  }

  const handleRemoveFriend = async (friendId: string) => {
    try {
      await userService.removeFriend(friendId);
      await refreshUser();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const openModal = (friendId: string) => {
    setSelectedFriendId(friendId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFriendId(null);
  };

  const selectedFriend = user.friends.find(
    (friend) => friend._id === selectedFriendId
  );

  return (
    <div className="space-y-6">
      {user.friends.length === 0 && (
        <p className="text-lg">You have no friends yet.</p>
      )}

      {/* Default Privacy Setting */}
      <div className="w-full flex items-center p-4 border rounded-lg shadow-sm space-x-4 flex-wrap">
        <p>You are</p>
        <PrivacyOptionsComponent
          value={user.defaultPrivacy}
          onChange={updateDefaultPrivacy}
        />
        <p>per default with new friends.</p>
      </div>

      {/* Friends List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {user.friends.map((friend) => {
          const friendPrivacySetting =
            user.privacySettings.find(
              (setting) => setting.friendId === friend._id
            )?.visibility || user.defaultPrivacy;

          const privacyOption = options.find(
            (option) => option.value === friendPrivacySetting
          );

          return (
            <div
              key={friend._id}
              className="w-full flex items-center p-4 border rounded-lg shadow-sm space-x-4"
            >
              <img
                src={friend.profilePicture}
                alt={friend.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-semibold">{friend.username}</p>
                {privacyOption && (
                  <div className="flex items-center text-sm text-gray-500">
                    {privacyOption.icon}
                    <span className="ml-2">{privacyOption.label}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => openModal(friend._id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaCog className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50" />

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full w-screen items-center justify-end p-4 text-center sm:p-0">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative bg-white text-left shadow-xl transform transition-all w-full h-[calc(100vh-32px)] rounded-lg sm:rounded-none sm:h-screen sm:max-w-md">
                  {/* Close Button */}
                  <div className="absolute top-0 right-0 pt-4 pr-4">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={closeModal}
                    >
                      <FaTimes className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="h-full flex flex-col">
                    {selectedFriend && (
                      <>
                        <div className="flex items-center space-x-4 p-6">
                          <img
                            src={selectedFriend.profilePicture}
                            alt={selectedFriend.username}
                            className="w-12 h-12 rounded-full"
                          />
                          <p className="font-semibold text-xl">
                            {selectedFriend.username}
                          </p>
                        </div>
                        <div className="p-6 flex-grow">
                          <p className="mb-2">Privacy Settings:</p>
                          <PrivacyOptionsComponent
                            value={
                              user.privacySettings.find(
                                (setting) =>
                                  setting.friendId === selectedFriend._id
                              )?.visibility || user.defaultPrivacy
                            }
                            onChange={(newState) =>
                              handleSharingStateChange(
                                selectedFriend._id,
                                newState
                              )
                            }
                          />
                        </div>
                        {/* Remove Friend Button at the Bottom */}
                        <div className="p-6 mt-auto">
                          <button
                            className="w-full bg-red-500 text-white py-2 rounded-md flex items-center justify-center"
                            onClick={() => {
                              handleRemoveFriend(selectedFriend._id);
                              closeModal();
                            }}
                          >
                            <FaTrash className="mr-2" />
                            Remove Friend
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
