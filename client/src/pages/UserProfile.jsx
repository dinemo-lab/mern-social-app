import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_LOCAL_URL}/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-purple-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-purple-700 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-purple-50">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-5xl text-purple-300 mb-4">😕</div>
          <h2 className="text-2xl font-bold text-purple-800">User Not Found</h2>
          <p className="text-purple-600 mt-2">We couldn't find the user you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Background Pattern */}
          <div className="relative bg-purple-700 h-48">
            <div className="absolute inset-0 bg-opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-purple-700 to-transparent"></div>
            <div className="absolute bottom-0 transform translate-y-1/2 left-8">
              <div className="bg-white rounded-full p-1 shadow-lg">
                <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 text-4xl font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
          
          {/* User Info */}
          <div className="pt-16 pb-6 px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-purple-900">{user.name}</h1>
                <p className="text-purple-500">{user.email}</p>
              </div>
              {user.socialLinks && (
                <div className="flex space-x-3 mt-4 md:mt-0">
                  {user.socialLinks.linkedin && (
                    <a 
                      href={user.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  )}
                  {user.socialLinks.instagram && (
                    <a 
                      href={user.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors duration-300"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
            
            {/* Bio Section */}
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">About Me</h2>
              <p className="text-gray-700">{user.bio || "No bio available."}</p>
            </div>
            
            {/* Skills & Interests Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div className="p-4 bg-white border border-purple-100 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                    <span className="mr-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </span>
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Interests */}
              {user.interests && user.interests.length > 0 && (
                <div className="p-4 bg-white border border-purple-100 rounded-lg shadow-sm">
                  <h2 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
                    <span className="mr-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </span>
                    Interests
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Location */}
            {user.location && user.location.coordinates && (
              <div className="mt-8 p-4 bg-white border border-purple-100 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-purple-800 mb-2 flex items-center">
                  <span className="mr-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </span>
                  Location
                </h2>
                <p className="text-gray-700 ml-7">
                  Coordinates: {user.location.coordinates[0]}, {user.location.coordinates[1]}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;