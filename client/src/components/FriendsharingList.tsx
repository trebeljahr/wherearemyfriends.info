// FriendsPrivacySettings.tsx
import { useState, Fragment } from "react";
import { FaTrash } from "react-icons/fa6";
import { useAuth } from "../context/auth.context";
import { SharingState } from "../lib/types";
import { userService } from "../services/user.service";
import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { PrivacyOptionsComponent } from "./PrivacyOptionsComponent";
import { FaCog } from "react-icons/fa";

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
        {user.friends.map((friend) => (
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
            </div>
            <button
              onClick={() => openModal(friend._id)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaCog className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 overflow-hidden">
            {/* <DialogOverlay className="absolute inset-0 bg-black opacity-50" /> */}
            <div className="fixed inset-y-0 right-0 max-w-full flex">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="relative w-screen max-w-md">
                  <div className="h-screen p-6 flex flex-col bg-white shadow-xl overflow-y-scroll">
                    {selectedFriend && (
                      <>
                        <div className="flex items-center space-x-4">
                          <img
                            src={selectedFriend.profilePicture}
                            alt={selectedFriend.username}
                            className="w-12 h-12 rounded-full"
                          />
                          <p className="font-semibold text-xl">
                            {selectedFriend.username}
                          </p>
                        </div>
                        <div className="mt-6">
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

                        <div className="mt-6">
                          <button
                            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md"
                            onClick={closeModal}
                          >
                            Close
                          </button>
                        </div>

                        <div className="mt-6 justify-self-end">
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
                </div>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};
