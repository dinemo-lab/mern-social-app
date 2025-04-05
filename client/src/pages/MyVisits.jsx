import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyVisits ,updateVisitStatus} from "../store/VisitSlice";
import { Link } from "react-router-dom";

import { MapPin, Calendar, Users, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const MyVisits = () => {
  const dispatch = useDispatch();
  const { myVisits = [], loading, error } = useSelector((state) => ({
    myVisits: state.visits.myVisits,
    loading: state.visits.loading,
    error: state.visits.error
  }));
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    console.log("Dispatching fetchMyVisits");
    dispatch(fetchMyVisits());
  }, [dispatch]);

  const handleStatusChange = (visitId, newStatus) => {
    dispatch(updateVisitStatus({ visitId, status: newStatus }));
  };

  // Debug logs
  console.log("Redux state:", useSelector(state => state.visits));
  console.log("myVisits from state:", myVisits);

  // Filter visits based on active tab
  const filteredVisits = myVisits.filter((visit) => {
    const visitDate = new Date(visit.date);
    const now = new Date();
    
    if (activeTab === "active") {
      return visitDate >= now && visit.status !== "cancelled";
    } else if (activeTab === "past") {
      return visitDate < now || visit.status === "completed";
    } else if (activeTab === "cancelled") {
      return visit.status === "cancelled";
    }
    return true;
  });

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch (error) {
      return dateString;
    }
  };

  // Status badge color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "cancelled":
        return "bg-rose-100 text-rose-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-indigo-100 text-indigo-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-rose-500 flex items-center">
          <AlertCircle className="mr-2" />
          <span>Error loading your visits: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gradient-to-b from-purple-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-purple-800 border-b pb-2 border-purple-200">My Visit Requests</h1>
      
      {/* Tabs */}
      <div className="flex mb-8 bg-white rounded-lg shadow-sm p-1 max-w-md">
        <button
          className={`py-2 px-6 rounded-md transition-all ${
            activeTab === "active"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "text-gray-600 hover:bg-purple-50"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active
        </button>
        <button
          className={`py-2 px-6 rounded-md transition-all ${
            activeTab === "past"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "text-gray-600 hover:bg-purple-50"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past
        </button>
        <button
          className={`py-2 px-6 rounded-md transition-all ${
            activeTab === "cancelled"
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "text-gray-600 hover:bg-purple-50"
          }`}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {filteredVisits.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-purple-100">
          <p className="text-gray-600">
            {activeTab === "active"
              ? "You don't have any active visit requests."
              : activeTab === "past"
              ? "You don't have any past visit requests."
              : "You don't have any cancelled visit requests."}
          </p>
          <Link
            to="/create-visit"
            className="mt-6 inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md"
          >
            Create a New Visit Request
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisits.map((visit) => (
            <div
              key={visit._id}
              className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all border border-purple-100 relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="flex justify-between items-start mb-4">
              
                <select
                  className="text-xs px-3 py-1 rounded-full bg-gray-100 border text-gray-800"
                  value={visit.status}
                  onChange={(e) => handleStatusChange(visit._id, e.target.value)}
                >
                  <option value="open">Open</option>
                  <option value="locked">Locked</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-purple-900 truncate">
                  {visit.location}
                </h3>
                <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(visit.status)}`}>
                  {visit.status || "open"}
                </span>
              </div>
              
              <div className="flex items-center text-gray-700 mb-3">
                <MapPin size={16} className="mr-2 text-purple-500" />
                <span className="text-sm truncate">{visit.location}</span>
              </div>
              
              <div className="flex items-center text-gray-700 mb-3">
                <Calendar size={16} className="mr-2 text-purple-500" />
                <span className="text-sm">{formatDate(visit.date)}</span>
              </div>
              
              <div className="flex items-center text-gray-700 mb-4">
                <Users size={16} className="mr-2 text-purple-500" />
                <span className="text-sm">
                  {visit.joinRequests.filter(req => req.status === "accepted").length} / 
                  {visit.maxParticipants || "∞"} participants
                </span>
              </div>
              
              {visit.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 bg-purple-50 p-3 rounded-lg italic">
                  "{visit.description}"
                </p>
              )}
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-purple-100">
                <div className="text-xs text-gray-500 flex items-center">
                  <Clock size={12} className="mr-1 text-purple-400" />
                  Created {formatDate(visit.createdAt)}
                </div>
                
                <Link
                  to={`/visit/${visit._id}`}
                  className="text-sm px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-sm"
                >
                  View Details
                </Link>
              </div>
              
              {/* Request count badge */}
              {visit.joinRequests.length > 0 && (
                <div className="mt-3 flex justify-end">
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 flex items-center">
                    <Users size={10} className="mr-1" />
                    {visit.joinRequests.filter(req => req.status === "pending").length} pending
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVisits;