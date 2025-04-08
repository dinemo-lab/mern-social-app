import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useJsApiLoader } from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

const libraries = ["places"];

const CreateVisit = () => {
  // Form state
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [meetingPointName, setMeetingPointName] = useState("");
  const [meetingPointAddress, setMeetingPointAddress] = useState("");
  const [date, setDate] = useState(null);
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(5);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Refs and hooks
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const locationInputRef = useRef(null);
  const meetingPointInputRef = useRef(null);

  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [showPlacesSuggestions, setShowPlacesSuggestions] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

   
  const fetchNearbyPlaces = (lat, lng) => {
    if (!isLoaded || !window.google) return;

    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: new window.google.maps.LatLng(lat, lng),
      radius: "1500", // 1.5km radius
      type: ["tourist_attraction", "restaurant", "museum", "park"],
    };

    placesService.nearbySearch(request, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        setNearbyPlaces(results.slice(0, 5)); // Take top 5 results
        setShowPlacesSuggestions(true);
      }
    });
  };
  // Setup location autocomplete
  useEffect(() => {
    if (!isLoaded || !locationInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      locationInputRef.current,
      { fields: ["formatted_address", "geometry"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address && place.geometry) {
        setLocation(place.formatted_address);
        setCoordinates({
          type: "Point",
          coordinates: [
            place.geometry.location.lng(),
            place.geometry.location.lat(),
          ],
        });

        // Fetch nearby places when a location is selected
        fetchNearbyPlaces(
          place.geometry.location.lat(),
          place.geometry.location.lng()
        );
      }
    });

    return () => {
      // Clean up listeners if needed
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded]);

  // Setup meeting point autocomplete
  useEffect(() => {
    if (!isLoaded || !meetingPointInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      meetingPointInputRef.current,
      { fields: ["formatted_address", "geometry"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        setMeetingPointAddress(place.formatted_address);
      }
    });

    return () => {
      // Clean up listeners if needed
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded]);

  // Form validation
  const validateForm = () => {
    if (!location) {
      setError("Please enter a location");
      return false;
    }
    if (!meetingPointName) {
      setError("Please enter a meeting point name");
      return false;
    }
    if (!meetingPointAddress) {
      setError("Please enter a meeting point address");
      return false;
    }
    if (!date) {
      setError("Please select a date");
      return false;
    }
    if (!description) {
      setError("Please enter a description");
      return false;
    }
    return true;
  };

  const handleCreateVisit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form before submitting
    if (!validateForm()) {
      toast.error(error);
      return;
    }

    setIsLoading(true);

    try {
      const formattedDate = date ? date.toISOString().split("T")[0] : "";

      const { data } = await axios.post(
        `${import.meta.env.VITE_LOCAL_URL}/api/visit`,
        {
          location,
          coordinates,
          meetingPoint: {
            name: meetingPointName,
            address: meetingPointAddress,
          },
          date: formattedDate,
          description,
          maxParticipants: Number(maxParticipants),
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setSuccess(true);
      toast.success("Visit created successfully!");
      setTimeout(() => navigate("/explore"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom DatePicker input for consistent styling
  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <input
        type="text"
        className="appearance-none block w-full pl-10 px-4 py-3 border text-gray-700 border-purple-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-80"
        value={value}
        onClick={onClick}
        placeholder="Select a date"
        readOnly
        ref={ref}
      />
    </div>
  ));

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="animate-pulse text-white text-xl font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 py-8 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mx-auto flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
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
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              Visit Created Successfully!
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Redirecting you to the explore page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 py-8 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto">
        <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Left column: Image/Graphic Area */}
          <div className="lg:w-2/5 bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold">Create a Visit</h1>
              <p className="mt-4 text-purple-100">
                Share your adventure and find travel companions who share your
                passion for exploration.
              </p>

              <div className="mt-12">
                <div className="flex items-start space-x-3 mb-8">
                  <div className="bg-black bg-opacity-20 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Choose Location</h3>
                    <p className="text-sm text-purple-100">
                      Select any place in the world you want to visit
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 mb-8">
                  <div className="bg-black bg-opacity-20 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Set the Date</h3>
                    <p className="text-sm text-purple-100">
                      Plan ahead and set when you'll be there
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="bg-black bg-opacity-20 p-2 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Travel Together</h3>
                    <p className="text-sm text-purple-100">
                      Find like-minded travelers to join your adventure
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white border-opacity-20">
              <p className="text-sm text-purple-100 italic">
                "The world is a book and those who do not travel read only one
                page."
              </p>
              <p className="text-sm text-purple-100 mt-1">— Saint Augustine</p>
            </div>
          </div>

          {/* Right column: Form */}
          <div className="lg:w-3/5 p-8 lg:p-10">
            <form onSubmit={handleCreateVisit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Where are you going?
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="location"
                    type="text"
                    required
                    ref={locationInputRef}
                    className="appearance-none block w-full pl-10 px-4 py-3 border text-gray-900 border-purple-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-80"
                    placeholder="City, Country or Landmark"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              {showPlacesSuggestions && nearbyPlaces.length > 0 && (
                <div className="mt-3 p-3 bg-white border border-purple-200 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-indigo-800 mb-2">
                    Popular places nearby:
                  </h4>
                  <div className="space-y-2">
                    {nearbyPlaces.map((place, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 hover:bg-purple-50 rounded-md cursor-pointer"
                        onClick={() => {
                          setMeetingPointName(place.name);
                          setMeetingPointAddress(place.vicinity);
                          setShowPlacesSuggestions(false);
                        }}
                      >
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {place.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {place.vicinity}
                          </div>
                          {place.rating && (
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[...Array(Math.round(place.rating))].map(
                                  (_, i) => (
                                    <svg
                                      key={i}
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-3 w-3 text-yellow-400"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  )
                                )}
                              </div>
                              <span className="text-xs ml-1">
                                {place.rating}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label
                  htmlFor="meetingPointName"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Meeting Point Name
                </label>
                <input
                  id="meetingPointName"
                  type="text"
                  required
                  className="appearance-none block w-full px-4 py-3 border text-gray-900 border-purple-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-80"
                  placeholder="E.g., Central Park Entrance"
                  value={meetingPointName}
                  onChange={(e) => setMeetingPointName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="meetingPointAddress"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Meeting Point Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="meetingPointAddress"
                    type="text"
                    required
                    ref={meetingPointInputRef}
                    className="appearance-none block w-full pl-10 px-4 py-3 border text-gray-900 border-purple-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-80"
                    placeholder="Specific address or location"
                    value={meetingPointAddress}
                    onChange={(e) => setMeetingPointAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-indigo-800 mb-1"
                  >
                    When will you be there?
                  </label>
                  <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    customInput={<CustomDateInput />}
                    minDate={new Date()}
                    required
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select a date"
                    className="react-datepicker-wrapper"
                    wrapperClassName="w-full"
                    popperClassName="react-datepicker-purple"
                    popperPlacement="bottom-start"
                  />
                </div>

                <div>
                  <label
                    htmlFor="participants"
                    className="block text-sm font-medium text-indigo-800 mb-1"
                  >
                    How many can join?
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <input
                      id="participants"
                      name="participants"
                      type="number"
                      min="1"
                      max="50"
                      required
                      className="appearance-none block w-full pl-10 px-4 py-3 border text-gray-700 border-purple-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-80"
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-indigo-800 mb-1"
                >
                  Tell us about this visit
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    required
                    className="appearance-none block w-full pl-10 px-4 py-3 border text-gray-700 border-purple-200 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white bg-opacity-80"
                    placeholder="Share details about your trip, what you plan to do, and what kind of travel companions you're looking for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-md text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating Visit...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Create Visit
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add DatePicker styles properly */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .react-datepicker {
            font-family: inherit;
            border-radius: 0.5rem;
            border: 1px solid #e2d4f0;
            box-shadow: 0 4px 6px rgba(124, 58, 237, 0.1);
          }
          .react-datepicker__header {
            background: linear-gradient(to right, #9333ea, #6366f1);
            border-bottom: none;
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            padding-top: 0.8rem;
          }
          .react-datepicker__current-month {
            color: white;
            font-weight: 600;
          }
          .react-datepicker__day-name {
            color: white;
          }
          .react-datepicker__day--selected,
          .react-datepicker__day--keyboard-selected {
            background: linear-gradient(to right, #9333ea, #6366f1);
            border-radius: 50%;
          }
          .react-datepicker__day:hover {
            border-radius: 50%;
            background-color: #e2d4f0;
          }
          .react-datepicker__triangle {
            display: none;
          }
          .react-datepicker__navigation-icon::before {
            border-color: white;
          }
          .react-datepicker-popper {
            z-index: 10;
          }
        `,
        }}
      />
    </div>
  );
};

export default CreateVisit;
