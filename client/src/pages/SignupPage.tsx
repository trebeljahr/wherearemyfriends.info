import { ChangeEvent, useRef, useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Altcha } from "../components/Altcha";
import {
  PasswordFieldComponent,
  usePasswordStrength,
} from "../hooks/usePasswordField";
import authService from "../services/auth.service";
import { useAuth } from "../context/auth.context";

export function SignupPage() {
  const { storeToken, authenticateUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { passwordStrength } = usePasswordStrength(password);
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [altchaValue, setAltchaValue] = useState<string | null>(null);
  const altchaRef = useRef<{ value: string | null }>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleEmailField = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!altchaValue) return;
      const requestBody = {
        email,
        password,
        username,
        altchaPayload: altchaValue,
      };
      const response = await authService.signup(requestBody);
      storeToken(response.data.authToken);

      await authenticateUser();

      const from = location.state?.from || "/location";
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error(error);

      const errorMessage = error?.response?.data?.message || error?.message;
      setErrorMessage(errorMessage);
    }
  };

  const enableSubmit = passwordStrength >= 5 && altchaValue;
  return (
    <div className="mt-16 sm:mt-10 sm:py-24 flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full sm:max-w-md p-8 space-y-6 bg-white rounded-lg sm:shadow-md">
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
          <fieldset>
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
          </fieldset>
          <fieldset>
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
          </fieldset>
          <PasswordFieldComponent
            password={password}
            setPassword={setPassword}
          />
          <fieldset>
            <Altcha
              ref={altchaRef}
              onStateChange={(ev: any) => {
                setAltchaValue(ev.detail.payload);
              }}
            />
          </fieldset>
          <button
            type="submit"
            disabled={!enableSubmit}
            className={`w-full px-4 py-2 font-semibold text-white ${
              enableSubmit ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500"
            } rounded-md transition duration-200 focus:outline-none focus:ring focus:ring-blue-300`}
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
