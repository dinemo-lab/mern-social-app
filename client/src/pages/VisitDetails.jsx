import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVisitDetails,
  updateJoinRequestStatus,
} from "../store/VisitSlice";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  User,
  ArrowLeft,
  Globe,
  ChevronLeft,
  Check,
  X,
} from "lucide-react";
import { useChat } from "../context/ChatContext";
import { joinVisit } from "../store/VisitSlice";

const VisitDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentVisit, loading, error } = useSelector((state) => state.visits);
  const { user } = useSelector((state) => state.auth);
  const { setCurrentChat } = useChat();

  useEffect(() => {
    if (id) {
      dispatch(fetchVisitDetails(id));
    }
  }, [dispatch, id]);

  console.log("Current Visit:", currentVisit); // Debugging line to check the current visit object

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await dispatch(
        updateJoinRequestStatus({
          visitId: currentVisit._id,
          requestId,
          status: newStatus,
        })
      ).unwrap();
      // Fetch the updated visit details to reflect changes in the UI
      dispatch(fetchVisitDetails(currentVisit._id));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleNavigateToChat = () => {
    const chatDetails = {
      _id: currentVisit._id, // Chat ID
      userId: user._id, // Current user's ID (organizer or approved participant)
    };
    setCurrentChat(chatDetails);
    navigate(`/chat/${currentVisit._id}`);
  };

  const handleJoinVisit = (visitId) => {
    dispatch(joinVisit(visitId));
    navigate(`/visit/${visitId}`);
  };
  // Check if current user can access chat (is organizer or has accepted request)
  const canAccessChat = () => {
    if (!currentVisit || !user) return false;

    // User is the organizer
    if (currentVisit.user?._id === user._id) return true;

    // User has an accepted join request
    return currentVisit.joinRequests?.some(
      (req) =>
        (req.user === user._id || req.user?._id === user._id) &&
        req.status === "accepted"
    );
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-purple-100 p-4 rounded-full inline-flex items-center justify-center mb-6">
            <Globe className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Sign In to View Visit Details
          </h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view and join visits.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-xl transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          <div className="absolute top-0 left-0 h-16 w-16 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-purple-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg">
            <p className="font-bold text-lg mb-2">Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-8 flex items-center justify-center w-full text-purple-600 py-3 hover:text-purple-800 transition-colors font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  if (!currentVisit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded-lg">
            <p className="font-bold text-lg mb-2">Visit Not Found</p>
            <p>
              The visit you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="mt-8 flex items-center justify-center w-full text-purple-600 py-3 hover:text-purple-800 transition-colors font-medium"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white min-h-screen p-4 md:p-6 pt-6 md:pt-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 mb-6 hover:text-purple-800 transition-all duration-300 group"
        >
          <ChevronLeft className="h-5 w-5 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Explore</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-16 -mr-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -mb-10 -ml-10"></div>

            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
                    {currentVisit.description || "Visit Details"}
                  </h1>
                  <div className="flex items-center text-purple-100 mb-4">
                    <User className="h-4 w-4 mr-2" />
                    <p>Organized by {currentVisit.user?.name || "Unknown"}</p>
                  </div>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    currentVisit.status === "open"
                      ? "bg-green-400 text-green-900"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {currentVisit.status || "status unknown"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div
                className="bg-purple-50 rounded-2xl p-5 flex items-center group hover:bg-purple-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md cursor-pointer"
                onClick={() => {
                  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    currentVisit.location
                  )}`;
                  window.open(googleMapsUrl, "_blank");
                }}
              >
                <div className="bg-white p-4 rounded-xl mr-4 shadow-sm group-hover:shadow-md transition-all duration-300 border border-purple-100">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-lg text-gray-800 font-medium">
                    {currentVisit.location}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-5 flex items-center group hover:bg-purple-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
                <div className="bg-white p-4 rounded-xl mr-4 shadow-sm group-hover:shadow-md transition-all duration-300 border border-purple-100">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium uppercase tracking-wider">
                    Date
                  </p>
                  <p className="text-lg text-gray-800 font-medium">
                    {formatDate(currentVisit.date)}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-5 flex items-center group hover:bg-purple-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
                <div className="bg-white p-4 rounded-xl mr-4 shadow-sm group-hover:shadow-md transition-all duration-300 border border-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium uppercase tracking-wider">
                    Participants
                  </p>
                  <p className="text-lg text-gray-800 font-medium">
                    <span className="text-purple-600 font-bold">
                      {currentVisit.joinRequests?.filter(
                        (r) => r.status === "accepted"
                      ).length || 0}
                    </span>
                    <span className="mx-1">/</span>
                    <span>{currentVisit.maxParticipants}</span>
                    {currentVisit.joinRequests?.filter(
                      (r) => r.status === "pending"
                    ).length > 0 && (
                      <span className="ml-2 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        +
                        {
                          currentVisit.joinRequests?.filter(
                            (r) => r.status === "pending"
                          ).length
                        }{" "}
                        pending
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-5 flex items-center group hover:bg-purple-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
                <div className="bg-white p-4 rounded-xl mr-4 shadow-sm group-hover:shadow-md transition-all duration-300 border border-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-600 font-medium uppercase tracking-wider">
                    Created
                  </p>
                  <p className="text-lg text-gray-800 font-medium">
                    {formatDate(currentVisit.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-5 flex items-start group hover:bg-purple-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md">
              <div className="bg-white p-4 rounded-xl mr-4 shadow-sm group-hover:shadow-md transition-all duration-300 border border-purple-100">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-600 font-medium uppercase tracking-wider">
                  Meeting Point
                </p>
                <p className="text-lg text-gray-800 font-medium mb-2">
                  {currentVisit.meetingPoint?.name ||
                    "No meeting point specified"}
                </p>
                <p className="text-gray-600">
                  {currentVisit.meetingPoint?.address || "No address provided"}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Globe className="h-5 w-5 text-purple-600" />
                </div>
                Description
              </h2>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {currentVisit.description || "No description provided."}
                </p>
              </div>
            </div>

            {/* Participants */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                Participants
              </h2>

              {currentVisit.joinRequests &&
              currentVisit.joinRequests.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-transparent">
                  {currentVisit.joinRequests?.map((request) => {
                    // More robust user ID extraction
                    const userId =
                      request.user &&
                      (typeof request.user === "string"
                        ? request.user
                        : request.user._id || request.user.id);

                    // More robust user name extraction
                    const userName =
                      request.user &&
                      (typeof request.user === "string"
                        ? `User #${request.user.substring(0, 6)}...`
                        : request.user.name || "Unknown User");

                    // More robust profile picture extraction
                    const profilePicture =
                      request.user &&
                      typeof request.user === "object" &&
                      request.user.profilePicture;

                    // More robust verification status extraction
                    const isVerified =
                      request.user &&
                      typeof request.user === "object" &&
                      request.user.isVerified;

                    return (
                      <div
                        key={request._id}
                        className="flex items-center justify-between bg-gray-50 p-5 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-purple-200"
                      >
                        <div className="flex items-center">
                          {profilePicture ? (
                            <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                              <img
                                src={profilePicture}
                                alt={userName}
                                className="h-full w-full object-cover rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="bg-purple-100 p-3 rounded-xl mr-4 border border-purple-200 h-12 w-12 flex items-center justify-center overflow-hidden">
                              <User className="h-5 w-5 text-purple-600" />
                            </div>
                          )}

                          <div className="flex items-center">
                            <button
                              onClick={() => navigate(`/profile/${userId}`)}
                              className="text-purple-600 font-medium hover:underline mr-2 cursor-pointer"
                            >
                              {userName}
                            </button>
                            {isVerified !== undefined &&
                              (isVerified ? (
                                <div
                                  className="bg-green-100 p-1 rounded-full"
                                  title="Verified User"
                                >
                                  <Check className="h-3 w-3 text-green-600" />
                                </div>
                              ) : (
                                <div
                                  className="bg-red-100 p-1 rounded-full"
                                  title="Not Verified"
                                >
                                  <X className="h-3 w-3 text-red-600" />
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Status with action buttons for organizer */}
                        {currentVisit.user?._id === user._id ? (
                          request.status === "pending" ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleStatusChange(request._id, "accepted")
                                }
                                className="bg-green-100 hover:bg-green-200 text-green-800 p-2 rounded-lg transition-colors"
                                title="Accept request"
                              >
                                <Check className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(request._id, "rejected")
                                }
                                className="bg-red-100 hover:bg-red-200 text-red-800 p-2 rounded-lg transition-colors"
                                title="Reject request"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                request.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status}
                            </span>
                          )
                        ) : (
                          <span
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              request.status === "accepted"
                                ? "bg-green-100 text-green-800"
                                : request.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {request.status}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-xl text-center border border-dashed border-gray-200">
                  <div className="inline-flex items-center justify-center bg-purple-100 p-4 rounded-full mb-4">
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                  <p className="text-gray-500">
                    No participants have joined yet.
                  </p>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="mt-8">
              {currentVisit.user?._id === user._id ? (
                // Show a message if the user is the organizer
                <div className="bg-purple-50 text-center p-6 rounded-xl border border-purple-200">
                  <p className="text-purple-700 font-medium">
                    You are the organizer of this visit
                  </p>
                </div>
              ) : currentVisit.joinRequests?.some(
                  (req) =>
                    (req.user === user._id || req.user?._id === user._id) &&
                    req.status === "accepted"
                ) ? (
                // Show a message if the user has already joined the visit and been accepted
                <div className="bg-green-50 text-center p-6 rounded-xl border border-green-200">
                  <p className="text-green-700 font-medium">
                    You have already joined this visit
                  </p>
                </div>
              ) : currentVisit.joinRequests?.some(
                  (req) =>
                    (req.user === user._id || req.user?._id === user._id) &&
                    req.status === "pending"
                ) ? (
                // Show a message if the user has submitted a join request but is waiting for approval
                <div className="bg-yellow-50 text-center p-6 rounded-xl border border-yellow-200">
                  <p className="text-yellow-700 font-medium">
                    You have joined the visit. Please wait for the organizer to
                    accept your request.
                  </p>
                </div>
              ) : (
                // Show the "Join Visit" button if the user is not the organizer and has not joined
                <button
                  onClick={() => handleJoinVisit(currentVisit._id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white py-4 px-6 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Join Visit
                </button>
              )}

              {/* Navigate to Group Chat Button - Only visible to organizer and accepted participants */}
              {canAccessChat() && (
                <button
                  onClick={handleNavigateToChat}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Go to Group Chat
                </button>
              )}

              {/* DEBUG: Show current user ID for debugging */}
              <div className="mt-2 text-center text-xs text-gray-400">
                Your user ID: {user._id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitDetails;
