import { useAuth } from "../context/auth.context";
import { SharingState } from "../lib/types";
import { userService } from "../services/user.service";
import { PrivacyOptionsComponent } from "./PrivacyOptionsComponent";

export const DefaultPrivacySetting = () => {
  const { user, refreshUser } = useAuth();

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

  return (
    <div className="w-full flex items-center p-4 border rounded-lg shadow-sm flex-wrap bg-white">
      <p>You are</p>
      <div className="w-full sm:w-auto sm:mx-2">
        <PrivacyOptionsComponent
          value={user.defaultPrivacy}
          onChange={updateDefaultPrivacy}
        />
      </div>
      <p>per default with new friends.</p>
    </div>
  );
};

import { OtherUser } from "../lib/types";
import { generateOptions } from "./PrivacyOptions";

export const DefaultPrivacySettingForOtherUser = ({
  otherUser,
}: {
  otherUser: OtherUser;
}) => {
  const { user } = useAuth();
  const isYou = user?._id === otherUser._id;

  const options = generateOptions(isYou ? "your" : "their");
  const privacyOption = options.find(
    (option) => option.value === otherUser.defaultPrivacy
  );

  if (!privacyOption || !user) return null;

  return (
    <div className="text-sm mt-8 w-[80vw] sm:w-[50vw] not-prose flex items-center border rounded-lg flex-wrap ">
      <p>{isYou ? "You are" : `${otherUser.username} is`}</p>
      <div className="relative w-fit p-2 mx-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm text-sm">
        <span className="flex items-center">
          {privacyOption.icon}
          <span className="ml-3 block">{privacyOption.label}</span>
        </span>
      </div>
      <p>with new friends per default.</p>
    </div>
  );
};
