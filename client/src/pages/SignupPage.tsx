import { ChangeEvent, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { TbEyeClosed, TbEye } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

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
  passwordTracker,
}: {
  passwordTracker: PasswordTracker;
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center">
        {passwordTracker.uppercase ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaTimesCircle className="text-red-500 mr-2" />
        )}
        <span>Uppercase letter</span>
      </div>
      <div className="flex items-center">
        {passwordTracker.lowercase ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaTimesCircle className="text-red-500 mr-2" />
        )}
        <span>Lowercase letter</span>
      </div>
      <div className="flex items-center">
        {passwordTracker.specialChar ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaTimesCircle className="text-red-500 mr-2" />
        )}
        <span>Special character</span>
      </div>
      <div className="flex items-center">
        {passwordTracker.number ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaTimesCircle className="text-red-500 mr-2" />
        )}
        <span>Number</span>
      </div>
      <div className="flex items-center">
        {passwordTracker.twelveCharactersOrMore ? (
          <FaCheckCircle className="text-green-500 mr-2" />
        ) : (
          <FaTimesCircle className="text-red-500 mr-2" />
        )}
        <span>12 characters or more</span>
      </div>
    </div>
  );
};

type PasswordTracker = {
  uppercase: RegExpMatchArray | null;
  lowercase: RegExpMatchArray | null;
  number: RegExpMatchArray | null;
  specialChar: RegExpMatchArray | null;
  twelveCharactersOrMore: RegExpMatchArray | null;
};

export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleEmailField = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestBody = { email, password, username };

    try {
      await authService.signup(requestBody);
      navigate("/login");
    } catch (error: any) {
      console.log(error);

      const errorMessage = error?.response?.data?.message || error?.message;
      setErrorMessage(errorMessage);
    }
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const atLeastOneUppercase = /[A-Z]/g;
  const atLeastOneLowercase = /[a-z]/g;
  const atLeastOneNumeric = /[0-9]/g;
  const atLeastOneSpecialChar = /[#?!@$%^&*-]/g;
  const twelveCharactersOrMore = /.{12,}/g;

  const passwordTracker = {
    uppercase: password.match(atLeastOneUppercase),
    lowercase: password.match(atLeastOneLowercase),
    number: password.match(atLeastOneNumeric),
    specialChar: password.match(atLeastOneSpecialChar),
    twelveCharactersOrMore: password.match(twelveCharactersOrMore),
  };

  const passwordStrength = Object.values(passwordTracker).filter(
    (value) => value
  ).length;

  return (
    <div className="py-24 flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h1>

        {errorMessage && (
          <div className="flex items-center p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
            <FaExclamationCircle className="w-5 h-5 mr-2" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSignupSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailField}
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md transition duration-200 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Username</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleName}
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md transition duration-200 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-600">Password</label>

            <div className="relative w-full">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={password}
                onChange={handlePassword}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Create a password"
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

            <PasswordStrengthMeter passwordStrength={passwordStrength} />
            <PasswordCriteriaChecklist passwordTracker={passwordTracker} />
          </div>

          <button
            type="submit"
            disabled={passwordStrength < 5}
            className={`w-full px-4 py-2 font-semibold text-white ${
              passwordStrength >= 5 ? "bg-blue-600" : "bg-gray-500"
            } rounded-md ${
              passwordStrength >= 5 && "hover:bg-blue-700"
            } transition duration-200 focus:outline-none focus:ring focus:ring-blue-300`}
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
