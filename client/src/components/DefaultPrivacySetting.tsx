import { useAuth } from "../context/auth.context";
import { OtherUser, SharingState } from "../lib/types";
import { userService } from "../services/user.service";
import { generateOptions } from "./PrivacyOptions";
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
    <div className="w-full flex items-center p-4 border rounded-lg shadow-sm space-x-4 flex-wrap">
      <p>You are</p>
      <PrivacyOptionsComponent
        value={user.defaultPrivacy}
        onChange={updateDefaultPrivacy}
      />
      <p>per default with new friends.</p>
    </div>
  );
};

const options = generateOptions("their");

export const DefaultPrivacySettingForOtherUser = ({
  otherUser,
}: {
  otherUser: OtherUser;
}) => {
  const privacyOption = options.find(
    (option) => option.value === otherUser.defaultPrivacy
  );
  if (!privacyOption) return null;

  return (
    <span className="w-full flex items-center p-4 border rounded-lg shadow-sm space-x-4 flex-wrap">
      <p>{otherUser.username} is</p>
      <div className="relative w-full p-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg shadow-sm cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        <span className="flex items-center">
          {privacyOption.icon}
          <span className="ml-3 block truncate">{privacyOption.label}</span>
        </span>
      </div>
      <p>per default with new friends.</p>
    </span>
  );
};
