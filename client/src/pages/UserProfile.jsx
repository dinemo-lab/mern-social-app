import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_LOCAL_URL}/api/users/${id}`); // Replace with your API endpoint
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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg font-medium">User not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-purple-600 text-white p-6">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-purple-200">{user.email}</p>
        </div>

        {/* User Details Section */}
        <div className="p-6 space-y-6">
          {/* Skills */}
          {user.skills && user.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
              <ul className="list-disc list-inside text-gray-700">
                {user.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Interests */}
          {user.interests && user.interests.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Interests</h2>
              <ul className="list-disc list-inside text-gray-700">
                {user.interests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Location */}
          {user.location && user.location.coordinates && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Location</h2>
              <p className="text-gray-700">
                Coordinates: {user.location.coordinates[0]}, {user.location.coordinates[1]}
              </p>
            </div>
          )}

          {/* Social Links */}
          {user.socialLinks && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Social Links</h2>
              <ul className="list-none space-y-2">
                {user.socialLinks.linkedin && (
                  <li>
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  </li>
                )}
                {user.socialLinks.instagram && (
                  <li>
                    <a
                      href={user.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      Instagram
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Bio */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Bio</h2>
            <p className="text-gray-700">{user.bio || "No bio available."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;