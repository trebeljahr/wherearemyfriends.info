import { ChangeEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import authService from "../services/auth.service";
import { Altcha } from "../components/Altcha";

export function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [altchaValue, setAltchaValue] = useState<string | null>(null);
  const altchaRef = useRef<{ value: string | null }>(null);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useAuth();

  const handleEmail = (e: ChangeEvent<HTMLInputElement>) =>
    setEmailOrUsername(e.target.value);
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!altchaValue) return;

      const requestBody = {
        emailOrUsername,
        password,
        altchaPayload: altchaValue,
      };

      const response = await authService.login(requestBody);
      storeToken(response.data.authToken);
      authenticateUser();
      navigate("/location");
    } catch (error: any) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

        {errorMessage && (
          <div className="p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <fieldset>
            <label className="block mb-1 text-gray-600">
              Email or Username
            </label>
            <input
              type="text"
              name="emailOrUsername"
              value={emailOrUsername}
              onChange={handleEmail}
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your email or username"
              required
            />
          </fieldset>

          <fieldset>
            <label className="block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePassword}
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter your password"
              required
            />
          </fieldset>

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
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account yet?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
