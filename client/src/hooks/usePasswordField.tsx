import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { TbEye, TbEyeClosed } from "react-icons/tb";

type PasswordChecks = {
  uppercase: RegExpMatchArray | null;
  lowercase: RegExpMatchArray | null;
  number: RegExpMatchArray | null;
  specialChar: RegExpMatchArray | null;
  twelveCharactersOrMore: RegExpMatchArray | null;
};

export const PasswordFieldComponent = ({
  password,
  setPassword,
  label = "Password",
  placeholder = "Create a password",
  checklist = true,
  strengthMeter = true,
}: {
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  label?: string;
  placeholder?: string;
  strengthMeter?: boolean;
  checklist?: boolean;
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const { passwordStrength, passwordChecks } = usePasswordStrength(password);
  return (
    <div>
      <label className="block mb-1 text-gray-600">{label}</label>
      <div className="relative w-full">
        <input
          type={passwordVisible ? "text" : "password"}
          name="password"
          autoComplete="password"
          value={password}
          onChange={handlePassword}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-0 inset-y-0 flex items-center px-3 text-gray-600 focus:outline-none"
        >
          {passwordVisible ? <TbEye /> : <TbEyeClosed />}
        </button>
      </div>
      {strengthMeter && (
        <PasswordStrengthMeter passwordStrength={passwordStrength} />
      )}
      {checklist && (
        <PasswordCriteriaChecklist passwordChecks={passwordChecks} />
      )}
    </div>
  );
};

export const usePasswordStrength = (password: string) => {
  const atLeastOneUppercase = /[A-Z]/g;
  const atLeastOneLowercase = /[a-z]/g;
  const atLeastOneNumeric = /[0-9]/g;
  const atLeastOneSpecialChar = /[#?!@$%^&*-]/g;
  const twelveCharactersOrMore = /.{12,}/g;

  const passwordChecks = {
    uppercase: password.match(atLeastOneUppercase),
    lowercase: password.match(atLeastOneLowercase),
    number: password.match(atLeastOneNumeric),
    specialChar: password.match(atLeastOneSpecialChar),
    twelveCharactersOrMore: password.match(twelveCharactersOrMore),
  };

  const passwordStrength = Object.values(passwordChecks).filter(
    (value) => value
  ).length;

  return { passwordChecks, passwordStrength };
};

const PasswordStrengthMeter = ({
  passwordStrength,
}: {
  passwordStrength: number;
}) => {
  const strengthColors = ["red", "orange", "#03a2cc", "#03a2cc", "#0ce052"];
  const strengthColor = strengthColors[passwordStrength - 1] || "";
  const strengthWidth = `${(passwordStrength / 5) * 100}%`;

  return (
    <div className="h-[0.75rem] bg-gray-300 rounded-md my-2">
      <div
        className="h-full rounded-md transition-all duration-200"
        style={{ backgroundColor: strengthColor, width: strengthWidth }}
      />
    </div>
  );
};

const PasswordCriteriaChecklist = ({
  passwordChecks,
}: {
  passwordChecks: PasswordChecks;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        {passwordChecks.uppercase ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaTimesCircle className="text-red-500 mr-2" />
        )}
        <span>Uppercase letter</span>
      </div>
      <div className="flex items-center">
        {passwordChecks.lowercase ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaTimesCircle className="text-red-500 mr-2" />
        )}
        <span>Lowercase letter</span>
      </div>
      <div className="flex items-center">
        {passwordChecks.specialChar ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaTimesCircle className="text-red-500 mr-2" />
        )}
        <span>Special character</span>
      </div>
      <div className="flex items-center">
        {passwordChecks.number ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaTimesCircle className="text-red-500 mr-2" />
        )}
        <span>Number</span>
      </div>
      <div className="flex items-center">
        {passwordChecks.twelveCharactersOrMore ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaTimesCircle className="text-red-500 mr-2" />
        )}
        <span>12 characters or more</span>
      </div>
    </div>
  );
};
