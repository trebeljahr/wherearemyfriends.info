import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import {
  PasswordFieldComponent,
  usePasswordStrength,
} from "src/hooks/usePasswordField";
import authService from "src/services/auth.service";

export const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestBody = { oldPassword, newPassword };

    try {
      await authService.changePassword(requestBody);
      setSuccessMessage("Password changed successfully");
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data?.message || error?.message;
      setErrorMessage(errorMessage);
    }
  };

  const { passwordStrength } = usePasswordStrength(newPassword);

  return (
    <div className="mt-8 sm:mx-auto sm:w-full">
      <h1>Change Password</h1>

      {errorMessage && (
        <div className="flex items-center p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
          <FaExclamationCircle className="w-5 h-5 mr-2" />
          {errorMessage}
        </div>
      )}
      {successMessage ? (
        <div className="flex items-center p-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded-md">
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSignupSubmit} className="space-y-5">
          <PasswordFieldComponent
            password={oldPassword}
            setPassword={setOldPassword}
            label="Old Password"
            checklist={false}
            strengthMeter={false}
          />
          <PasswordFieldComponent
            password={newPassword}
            setPassword={setNewPassword}
            label="New Password"
          />

          <button
            type="submit"
            className={`w-full px-4 py-2 font-semibold text-white ${
              passwordStrength >= 5 ? "bg-blue-600" : "bg-gray-500"
            } rounded-md ${
              passwordStrength >= 5 && "hover:bg-blue-700"
            } transition duration-200 focus:outline-none focus:ring focus:ring-blue-300`}
            disabled={passwordStrength < 5}
          >
            Change Password
          </button>
        </form>
      )}
    </div>
  );
};
