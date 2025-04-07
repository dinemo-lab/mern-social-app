import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearErrors } from "../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    coordinates: [0, 0], // Default coordinates
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [useLocation, setUseLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [showPassword, setShowPassword] = useState(true); // Default to showing password
  const [showConfirmPassword, setShowConfirmPassword] = useState(true); // Default to showing confirm password

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Clear errors when unmounting
  useEffect(() => {
    return () => {
      if (error) dispatch(clearErrors());
    };
  }, [dispatch, error]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Registration successful! Redirecting...");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Get user location if permitted
  useEffect(() => {
    if (useLocation) {
      setLocationStatus("Getting your location...");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            coordinates: [position.coords.longitude, position.coords.latitude],
          });
          setLocationStatus("Location detected");
          toast.success("Location detected successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus("Could not get location");
          setUseLocation(false);
          toast.error("Failed to get location. Please try again.");
        }
      );
    }
  }, [useLocation]);

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 8) strength += 1; // Minimum length
    if (/[A-Z]/.test(password)) strength += 1; // Uppercase letter
    if (/[0-9]/.test(password)) strength += 1; // Number
    if (/[@$!%*?&#]/.test(password)) strength += 1; // Special character

    switch (strength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
        return "Moderate";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const toggleLocation = () => {
    setUseLocation(!useLocation);
    if (!useLocation) {
      setLocationStatus("Requesting permission...");
    } else {
      setLocationStatus("");
      setFormData({
        ...formData,
        coordinates: [0, 0],
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Valid email is required");
      return;
    }

    if (!formData.password || formData.password.length < 8 || passwordStrength === "Weak") {
      toast.error("Password must be at least 8 characters and strong enough");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      // Only include coordinates if location is being used
      if (useLocation && formData.coordinates[0] !== 0 && formData.coordinates[1] !== 0) {
        userData.coordinates = formData.coordinates;
      }

      dispatch(registerUser(userData)).then((action) => {
        if (action.type === "auth/register/fulfilled") {
          toast.success("Registration successful! Redirecting...");
          if(userData.isVerified) {
            navigate("/resend-verification", { state: { email: formData.email } });
          }
          navigate("/");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      });
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create account</h2>
          <p className="mt-2 text-sm text-gray-600">Sign up for a new account</p>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border text-gray-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border text-gray-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 border text-gray-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.password && (
                <p
                  className={`text-xs mt-1 ${
                    passwordStrength === "Weak"
                      ? "text-red-500"
                      : passwordStrength === "Moderate"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Password Strength: {passwordStrength}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 mt-1 border text-gray-900 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="useLocation"
                checked={useLocation}
                onChange={toggleLocation}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="useLocation"
                className="ml-2 block text-sm text-gray-700 cursor-pointer flex items-center"
              >
                <MapPin size={16} className="mr-1" />
                Share my location
              </label>
            </div>
            {locationStatus && (
              <p className="text-xs text-gray-500 mt-1 ml-5">
                {locationStatus}
                {useLocation && formData.coordinates[0] !== 0 && (
                  <span className="block mt-1">
                    Coordinates: [{formData.coordinates[0].toFixed(4)}, {formData.coordinates[1].toFixed(4)}]
                  </span>
                )}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Registering..." : "Create account"}
            </button>
          </div>

          <div className="text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;