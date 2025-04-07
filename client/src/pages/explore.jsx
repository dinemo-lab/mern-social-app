import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllVisits, joinVisit } from "../store/VisitSlice";
import { Calendar, MapPin, Users, Clock, User, Search, Filter, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchVisitDetails } from "../store/VisitSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Explore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visits, loading, error } = useSelector((state) => state.visits);
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchAllVisits())
        .unwrap()
        .then(() => {
          // Trigger animation after data loads
          setTimeout(() => setAnimateCards(true), 100);
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
      toast.error(
        "You cannot join this visit as it is either locked or completed."
      );
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

  const filteredVisits = visits.filter(visit => {
    // Search filter
    const matchesSearch = visit.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         visit.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    if (activeFilter === "all") return matchesSearch;
    return visit.status === activeFilter && matchesSearch;
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-purple-100 animate-fade-in-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
            <MapPin className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-purple-800 mb-4 text-center">
            Sign In to Explore
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Join amazing visits with fellow explorers and create memorable experiences together!
          </p>
          <div className="flex flex-col space-y-4">
            <Link
              to="/login"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition text-center font-medium shadow-md transform hover:scale-105 duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-white text-purple-600 border border-purple-200 px-6 py-3 rounded-lg hover:bg-purple-50 transition text-center font-medium transform hover:scale-105 duration-300"
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
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mb-4"></div>
        <p className="text-purple-800 font-medium text-lg">Loading amazing visits for you...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="bg-white p-8 rounded-xl shadow-lg border-l-4 border-red-500 max-w-md w-full">
          <p className="font-bold text-red-700 text-xl mb-2">Oops! Something went wrong</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => dispatch(fetchAllVisits())}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow-md w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  console.log("Visits:", visits); // Debugging line to check the visits data

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-purple-800">Explore Visits</h1>
          </div>
          
          <Link
            to="/create-visit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-md flex items-center gap-2 transform hover:scale-105 duration-300"
          >
            <span>Create New Visit</span>
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-black bg-opacity-30">+</span>
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Search by description or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setActiveFilter("all")}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeFilter === "all" 
                  ? "bg-purple-100 text-purple-700 border border-purple-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setActiveFilter("open")}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeFilter === "open" 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Open
            </button>
            <button 
              onClick={() => setActiveFilter("locked")}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                activeFilter === "locked" 
                  ? "bg-orange-100 text-orange-700 border border-orange-200" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Locked
            </button>
          </div>
        </div>

        {filteredVisits.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center border border-purple-100 animate-fade-in">
            {searchTerm || activeFilter !== "all" ? (
              <>
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-600 text-lg">No visits match your filters.</p>
                <p className="mt-2 text-gray-500">
                  Try changing your search terms or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("all");
                  }}
                  className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-md"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-10 w-10 text-purple-500" />
                </div>
                <p className="text-gray-600 text-lg">
                  No visits available at the moment.
                </p>
                <p className="mt-2 text-gray-500">
                  Be the first to create an exciting visit!
                </p>
                <Link
                  to="/create-visit"
                  className="mt-6 inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-md transform hover:scale-105 duration-300"
                >
                  Create Your First Visit
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Featured Visit */}
            {filteredVisits.length > 0 && activeFilter === "all" && !searchTerm && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
                  <h2 className="text-xl font-semibold text-purple-800">Featured Visit</h2>
                </div>
                <div 
                  className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-500 border-2 border-purple-200 hover:border-purple-400 ${
                    animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  }`}
                  onClick={(e) => goToDetails(filteredVisits[0]._id, e)}
                >
                  <div className="relative h-36 bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                        filteredVisits[0].status === "open"
                          ? "bg-green-100 bg-opacity-80 text-green-800"
                          : filteredVisits[0].status === "locked"
                          ? "bg-orange-100 bg-opacity-80 text-orange-800"
                          : "bg-gray-100 bg-opacity-80 text-gray-800"
                      }`}>
                        {filteredVisits[0].status}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end p-4">
                      <div className="flex items-center">
                        <div className="h-14 w-14 rounded-full bg-white shadow-md border-2 border-white flex items-center justify-center overflow-hidden">
                          <User className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="ml-3 text-white">
                          <p className="font-medium">Organized by</p>
                          <p className="text-sm">{filteredVisits[0].user.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-black bg-opacity-30 backdrop-blur-sm rounded-lg px-3 py-1.5">
                        <Users className="h-4 w-4 mr-2 text-white" />
                        <span className="text-sm text-white font-medium">
                          {filteredVisits[0].joinRequests.length}/{filteredVisits[0].maxParticipants}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors">
                      {filteredVisits[0].description || "Unnamed Visit"}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                        <span className="text-base truncate">
                          {filteredVisits[0].location}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                        <span className="text-base truncate">
                          {formatDate(filteredVisits[0].date)}
                        </span>
                      </div>
                    </div>
                    
                    {filteredVisits[0].user._id === user._id ? (
                      <div className="w-full bg-blue-100 text-blue-700 py-2.5 rounded-lg text-center font-medium shadow-sm">
                        You are the Organizer
                      </div>
                    ) : filteredVisits[0].joinRequests.some(
                        (req) => req.user === user._id || req.user?._id === user._id
                      ) ? (
                      <div className="w-full bg-green-100 text-green-700 py-2.5 rounded-lg text-center font-medium shadow-sm">
                        Already Joined
                      </div>
                    ) : filteredVisits[0].status === "locked" ||
                      filteredVisits[0].status === "completed" ? (
                      <div className="w-full bg-gray-100 text-gray-700 py-2.5 rounded-lg text-center font-medium shadow-sm">
                        Cannot Join - {filteredVisits[0].status.charAt(0).toUpperCase() +
                          filteredVisits[0].status.slice(1)}
                      </div>
                    ) : (
                      <button
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2.5 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-md transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinVisit(filteredVisits[0]._id, filteredVisits[0].status);
                        }}
                      >
                        Join This Visit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* All Visits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVisits.map((visit, index) => {
                // Skip the first visit if we're showing it as featured and we're not filtering
                if (index === 0 && activeFilter === "all" && !searchTerm) return null;
                
                const hasJoined = visit.joinRequests.some(
                  (req) => req.user === user._id || req.user?._id === user._id
                );
                
                const delay = index * 100; // Staggered animation delay
                
                return (
                  <div
                    key={visit._id}
                    className={`group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 border border-purple-50 cursor-pointer transform hover:-translate-y-2 ${
                      animateCards ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${delay}ms` }}
                    onClick={(e) => goToDetails(visit._id, e)}
                  >
                    <div className="relative h-28 bg-gradient-to-r from-indigo-600 to-purple-500 flex items-end">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30"></div>
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                            visit.status === "open"
                              ? "bg-green-100 bg-opacity-70 text-green-800"
                              : visit.status === "locked"
                              ? "bg-orange-100 bg-opacity-70 text-orange-800"
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
                      <h2 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors line-clamp-2">
                        {visit.description || "Unnamed Visit"}
                      </h2>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="text-sm truncate">
                            {visit.location}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="text-sm truncate">
                            {formatDate(visit.date)}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600 col-span-2">
                          <Clock className="h-4 w-4 mr-2 text-purple-500" />
                          <span className="text-sm">
                            Created {new Date(visit.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {visit.user._id === user._id ? (
                        <div className="w-full mt-3 bg-blue-100 text-blue-700 py-2 rounded-lg text-center font-medium shadow-sm">
                          You are the Organizer
                        </div>
                      ) : hasJoined ? (
                        <div className="w-full mt-3 bg-green-100 text-green-700 py-2 rounded-lg text-center font-medium shadow-sm">
                          Already Joined
                        </div>
                      ) : visit.status === "locked" ||
                        visit.status === "completed" ? (
                        <div className="w-full mt-3 bg-gray-100 text-gray-700 py-2 rounded-lg text-center font-medium shadow-sm">
                          Cannot Join -{" "}
                          {visit.status.charAt(0).toUpperCase() +
                            visit.status.slice(1)}
                        </div>
                      ) : (
                        <button
                          className="w-full mt-3 cursor-pointer bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white py-2 rounded-lg transition-all duration-300 font-medium shadow-sm group-hover:shadow-md"
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
          </>
        )}
      </div>
    </div>
  );
};

export default Explore;