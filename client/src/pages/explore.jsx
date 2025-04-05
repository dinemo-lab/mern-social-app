import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllVisits, joinVisit } from "../store/VisitSlice";
import { Calendar, MapPin, Users, Clock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchVisitDetails } from "../store/VisitSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Explore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visits, loading, error } = useSelector((state) => state.visits);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchAllVisits())
        .unwrap()
        .then(() => {
           
        })
        .catch((err) => {
          console.error("Failed to fetch visits:", err);
          toast.error("Failed to load visits. Please try again later.");
        });
    }
  }, [dispatch, user]);

  const goToDetails = async (visitId, e) => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
      e.preventDefault();
      return;
    }

    try {
      await dispatch(fetchVisitDetails(visitId));
      navigate(`/visit/${visitId}`);
    } catch (error) {
      console.error("Failed to fetch visit details:", error);
      toast.error("Failed to load visit details. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleJoinVisit = async (visitId, visitStatus) => {
    if (visitStatus === "locked" || visitStatus === "completed") {
      toast.error("You cannot join this visit as it is either locked or completed.");
      return;
    }

    try {
      await dispatch(joinVisit(visitId)).unwrap();
      toast.success("Successfully joined the visit!");
      navigate(`/visit/${visitId}`);
    } catch (error) {
      console.error("Failed to join visit:", error);
      toast.error("Failed to join the visit. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-purple-100">
          <h1 className="text-3xl font-bold text-purple-800 mb-4 text-center">Sign In to Explore</h1>
          <p className="text-gray-600 mb-8 text-center">
            Please sign in to view and join visits. Connect with other explorers and start your
            journey today!
          </p>
          <div className="flex flex-col space-y-4">
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition text-center font-medium shadow-md"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-white text-purple-600 border border-purple-200 px-6 py-3 rounded-lg hover:bg-purple-50 transition text-center font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        {toast.error("An error occurred while loading visits.")}
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Explore Visits</h1>
          <Link
            to="/create-visit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-md flex items-center gap-2"
          >
            <span>Create Visit</span>
          </Link>
        </div>

        {visits.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center border border-purple-100">
            <p className="text-gray-600 text-lg">No visits available at the moment.</p>
            <p className="mt-2 text-gray-500">Check back later or create a new visit!</p>
            <Link
              to="/create-visit"
              className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-md"
            >
              Create Your First Visit
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visits.map((visit) => {
              const hasJoined = visit.joinRequests.some(
                (req) => req.user === user._id || req.user?._id === user._id
              );

              return (
                <div
                  key={visit._id}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-purple-50 cursor-pointer transform hover:-translate-y-1"
                  onClick={(e) => goToDetails(visit._id, e)}
                >
                  <div className="relative h-24 bg-gradient-to-r from-indigo-600 to-purple-500 flex items-end">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                          visit.status === "open"
                            ? "bg-green-100 bg-opacity-70 text-green-800"
                            : "bg-gray-100 bg-opacity-70 text-gray-800"
                        }`}
                      >
                        {visit.status}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end p-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-purple-200 border-2 border-white flex items-center justify-center overflow-hidden">
                          <User className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-2 text-white">
                          <p className="text-sm font-medium">Organized by</p>
                          <p className="text-xs">{visit.user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-black bg-opacity-20 backdrop-blur-sm rounded-lg px-2 py-1">
                        <Users className="h-3 w-3 mr-1 text-white" />
                        <span className="text-xs text-white font-medium">
                          {visit.joinRequests.length}/{visit.maxParticipants}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors">
                      {visit.description || "Unnamed Visit"}
                    </h2>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="text-sm truncate">{visit.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="text-sm truncate">{formatDate(visit.date)}</span>
                      </div>

                      <div className="flex items-center text-gray-600 col-span-2">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        <span className="text-sm">Created {new Date(visit.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {hasJoined ? (
                      <div className="w-full mt-3 bg-green-100 text-green-700 py-2 rounded-lg text-center font-medium shadow-sm">
                        Already Joined
                      </div>
                    ) : visit.status === "locked" || visit.status === "completed" ? (
                      <div className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg text-center font-medium shadow-sm">
                        Cannot Join - {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                      </div>
                    ) : (
                      <button
                        className="w-full mt-3 bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white py-2 rounded-lg transition-all duration-300 font-medium shadow-sm group-hover:shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinVisit(visit._id, visit.status);
                        }}
                      >
                        Join Visit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;