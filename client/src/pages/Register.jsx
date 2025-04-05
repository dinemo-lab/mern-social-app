import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearErrors } from "../store/AuthSlice";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Loader, MapPin } from "lucide-react";
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
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [useLocation, setUseLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

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

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (passwordStrength === "Weak") {
      errors.password = "Password is too weak. Please use a stronger password.";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update password strength
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    // Only validate if form has been submitted once
    if (submitted) {
      setFormErrors(validateForm());
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

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setFormErrors(validationErrors);
    setSubmitted(true);

    if (Object.keys(validationErrors).length === 0) {
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

        await dispatch(registerUser(userData));
        toast.success("Registration successful!");
      } catch (err) {
        console.error("Registration failed:", err);
        toast.error("Registration failed. Please try again.");
      }
    } else {
      toast.error("Please fix the errors in the form.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-500 p-4 text-white">
          <h2 className="text-xl font-bold">Register Account</h2>
        </div>

        <form onSubmit={handleRegister} className="p-5">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200 text-sm">
              <AlertCircle size={16} className="inline mr-2" />
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border text-gray-700 ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border text-gray-700 ${
                formErrors.email ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border text-gray-700 ${
                formErrors.password ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
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

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-3 py-2 border text-gray-700 ${
                formErrors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded`}
            />
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="useLocation"
                checked={useLocation}
                onChange={toggleLocation}
                className="mr-2"
              />
              <label
                htmlFor="useLocation"
                className="text-sm text-gray-700 cursor-pointer flex items-center"
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

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded text-white font-medium ${
              loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin inline mr-2" /> Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          <div className="mt-4 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
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