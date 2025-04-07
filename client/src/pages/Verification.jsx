import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const VerificationRequired = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const [sending, setSending] = useState(false);

  const resendVerification = async () => {
    if (!email) {
      toast.error("Email address not found. Please try logging in again.");
      return;
    }

    setSending(true);
    try {
      await axios.post(`${import.meta.env.VITE_LOCAL_URL}/api/auth/resend-verification`, {
        email,
      });
      toast.success("Verification email sent successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-16 w-16 text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Verification Required</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please verify your email address to access full features of the site.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                We've sent a verification email to <strong>{email || "your email address"}</strong>.
                Please check your inbox and click the verification link.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={resendVerification}
            className="flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            disabled={sending}
          >
            {sending ? "Sending..." : "Resend Verification Email"}
          </button>

          <Link
            to="/"
            className="flex justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Will do later
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default VerificationRequired;