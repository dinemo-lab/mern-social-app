import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Edit, LogOut, Briefcase, Heart } from 'lucide-react';
import EditProfileModal from './EditProfileModel';
import axios from 'axios';

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user profile from the backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_LOCAL_URL}/api/users/profile`)
        setUserProfile(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse text-purple-600 text-lg">Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-purple-50">
        <div className="text-purple-400 mb-4">
          <User size={64} strokeWidth={1} />
        </div>
        <p className="text-purple-600 text-lg">Please log in to view your profile.</p>
        <button className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-md">
          Log In
        </button>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Profile header section with purple gradient */}
          <div className="relative h-56 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <svg width="100%" height="100%" className="absolute inset-0" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#smallGrid)" />
              </svg>
            </div>
            <div className="absolute -bottom-16 left-8">
    {userProfile.profilePicture ? (
      <img
        src={userProfile.profilePicture}
        alt="Profile"
        className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg"
      />
    ) : (
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white shadow-lg">
        {getInitials(userProfile.name)}
      </div>
    )}
  </div>
          </div>

          {/* Profile content */}
          <div className="pt-20 pb-8 px-6 sm:px-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{userProfile.name}</h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2 text-purple-500" />
                  {userProfile.email}
                </p>
              </div>
              <button
                className="mt-4 sm:mt-0 flex items-center px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full text-white hover:opacity-90 transition-opacity shadow-md"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>

            {/* Profile information cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-500" />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-1/3 text-gray-500 font-medium">Full Name</div>
                    <div className="w-2/3 text-gray-900">{userProfile.name}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/3 text-gray-500 font-medium">Email</div>
                    <div className="w-2/3 text-gray-900">{userProfile.email}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/3 text-gray-500 font-medium">Member Since</div>
                    <div className="w-2/3 text-gray-900">
                      {new Date(userProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Skills section */}
                  <div className="flex">
                    <div className="w-1/3 text-gray-500 font-medium flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-purple-500" />
                      Skills
                    </div>
                    <div className="w-2/3">
                      {userProfile.skills && userProfile.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userProfile.skills.map((skill, index) => (
                            <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">No skills added</span>
                      )}
                    </div>
                  </div>

                  {/* Interests section */}
                  <div className="flex">
                    <div className="w-1/3 text-gray-500 font-medium flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-purple-500" />
                      Interests
                    </div>
                    <div className="w-2/3">
                      {userProfile.interests && userProfile.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {userProfile.interests.map((interest, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                              {interest}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">No interests added</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Social Information */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-purple-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                  Location & Social
                </h2>
                <div className="space-y-4">
                  {userProfile.location && userProfile.location.coordinates.length > 0 ? (
                    <div className="flex">
                      <div className="w-1/3 text-gray-500 font-medium">Coordinates</div>
                      <div className="w-2/3 text-gray-900 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                        <span>
                          Longitude: {userProfile.location.coordinates[0]}, Latitude: {userProfile.location.coordinates[1]}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-purple-50 rounded-xl text-purple-700 italic flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      No location information available
                    </div>
                  )}

                  {/* Social links */}
                  <div>
                    <div className="text-gray-500 font-medium mb-3">Social Links</div>
                    {userProfile.socialLinks && Object.values(userProfile.socialLinks).some((link) => link) ? (
                      <div className="space-y-3">
                        {userProfile.socialLinks.linkedin && (
                          <a
                            href={userProfile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            LinkedIn Profile
                          </a>
                        )}
                        {userProfile.socialLinks.twitter && (
                          <a
                            href={userProfile.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                          >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                            </svg>
                            Twitter Profile
                          </a>
                        )}
                        {userProfile.socialLinks.instagram && (
                          <a
                            href={userProfile.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-purple-500 hover:text-purple-700 transition-colors"
                          >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            Instagram Profile
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-purple-50 rounded-xl text-purple-700 italic flex items-center">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                        No social links available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-end">
              <button className="flex items-center px-5 py-2 bg-white border border-red-300 rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </div>
  );
};

export default Profile;