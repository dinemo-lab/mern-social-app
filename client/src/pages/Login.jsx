import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((action) => {
      if (action.type === "auth/login/fulfilled") {
        toast.success("Login successful! Redirecting...");
        navigate("/"); // Redirect after successful login
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    });
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;

    try {
      const response = await axios.post("http://localhost:5000/api/auth/google-login", {
        token: googleToken,
      });

      const { _id, name, email, token } = response.data;
      const user = { _id, name, email, token };

      localStorage.setItem("user", JSON.stringify(user));

      dispatch({ type: "auth/googleLogin/fulfilled", payload: user });

      toast.success("Google login successful! Redirecting...");
      navigate("/");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Google Login Error: ${errorMessage}`);
    }
  };

  const handleGoogleLoginFailure = () => {
    toast.error("Google Login Failed. Please try again.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border text-gray-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 mt-1 border text-gray-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;