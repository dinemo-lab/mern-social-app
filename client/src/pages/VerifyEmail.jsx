import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_LOCAL_URL}/api/auth/verify-email/${token}`);
        setVerificationStatus("success");
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        setVerificationStatus("error");
        setErrorMessage(error.response?.data?.message || "Verification failed. Please try again.");
      }
    };

    if (token) {
      verifyToken();
    } else {
      setVerificationStatus("error");
      setErrorMessage("Invalid verification link. Token is missing.");
    }
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          {verificationStatus === "verifying" && (
            <>
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Verifying Email</h2>
              <p className="mt-2 text-sm text-gray-600">Please wait while we verify your email...</p>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-16 w-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Verification Successful!</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your email has been verified successfully. Redirecting to login...
              </p>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Verification Failed</h2>
              <p className="mt-2 text-sm text-gray-600">{errorMessage}</p>
            </>
          )}
        </div>

        {verificationStatus === "error" && (
          <div className="flex flex-col space-y-4">
            <Link
              to="/resend-verification"
              className="flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Resend Verification Email
            </Link>
            <Link
              to="/login"
              className="flex justify-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Login
            </Link>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="flex justify-center">
            <Link
              to="/login"
              className="flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;