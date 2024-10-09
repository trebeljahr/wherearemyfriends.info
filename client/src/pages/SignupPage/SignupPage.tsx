import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";

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
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Sign Up
        </h1>

        {errorMessage && (
          <div className="flex items-center p-4 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.366-.446.927-.598 1.433-.457a1.502 1.502 0 011.23 1.23c.141.506-.011 1.067-.457 1.433L10 5.414l-3 3V11h2.586l3-3 .293-.293c.366-.366.927-.598 1.433-.457a1.502 1.502 0 011.23 1.23c.141.506-.011 1.067-.457 1.433l-.293.293-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414l7-7z"
                clipRule="evenodd"
              />
            </svg>
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
            <label className="block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePassword}
              className="w-full px-4 py-2 text-gray-700 bg-white border rounded-md transition duration-200 focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Create a password"
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

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring focus:ring-blue-300"
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

export default SignupPage;
