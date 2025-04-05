import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, MapPin } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../store/VisitSlice'; // Adjust path as needed
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const EditProfileModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || "", // Add profilePicture field
    location: {
      type: "Point",
      coordinates: user?.location?.coordinates || [0, 0]
    },
    address: user?.address || '',
    socialLinks: {
      linkedin: user?.socialLinks?.linkedin || '',
      twitter: user?.socialLinks?.twitter || '',
      instagram: user?.socialLinks?.instagram || ''
    },
    skills: user?.skills || [],
    interests: user?.interests || []
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [locationError, setLocationError] = useState('');
  const [uploading, setUploading] = useState(false); // State for upload status

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationError('');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              coordinates: [
                position.coords.longitude,
                position.coords.latitude
              ]
            }
          });
        },
        (error) => {
          setLocationError(`Error getting location: ${error.message}`);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    setUploading(true);
  
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "ai_picture"); // Make sure this is an unsigned upload preset
  
    try {
      // Use fetch instead of axios
     // https://api.cloudinary.com/v1_1//image/upload
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: uploadData
        }
      );
      
      const data = await response.json();
      const imageUrl = data.secure_url;
      
      setFormData(prevData => ({ ...prevData, profilePicture: imageUrl }));
      toast.success("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => {
        onClose();
        toast.success("Profile updated successfully!");
      })
      .catch(error => {
        console.error('Failed to update profile:', error);
        toast.error("Failed to update profile. Please try again.");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-100"
      >
        <div className="flex justify-between items-center p-8 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-3xl font-bold text-gray-800">Edit Your Profile</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={28} />
          </button>
        </div>

        <div
          className="overflow-y-auto p-8"
          style={{
            maxHeight: "calc(90vh - 220px)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Profile Picture</h3>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                  {formData.profilePicture ? (
                    <img
                      src={formData.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <MapPin size={32} />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                  />
                  {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 bg-gray-50"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 bg-gray-50"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Location</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 bg-gray-50"
                />
              </div>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center px-5 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors border border-blue-200 font-medium"
                >
                  <MapPin size={18} className="mr-2" />
                  Use My Current Location
                </button>
                {locationError && (
                  <p className="text-red-500 text-sm mt-2">{locationError}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.location.coordinates[0]}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                  <input
                    type="text"
                    readOnly
                    value={formData.location.coordinates[1]}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Social Links</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                  <input
                    type="url"
                    name="socialLinks.linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                  <input
                    type="url"
                    name="socialLinks.twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/username"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                  <input
                    type="url"
                    name="socialLinks.instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/username"
                    className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                  />
                </div>
              </div>
            </div>
            
            {/* Skills */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Skills</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center transition-all hover:bg-blue-200 shadow-sm">
                    <span className="font-medium">{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="flex-1 px-5 py-4 border border-gray-200 rounded-xl rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-blue-500 text-white px-5 py-4 rounded-xl rounded-l-none hover:bg-blue-600 flex items-center justify-center transition-colors w-16"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            {/* Interests */}
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Interests</h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {formData.interests.map((interest, index) => (
                  <div key={index} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full flex items-center transition-all hover:bg-purple-200 shadow-sm">
                    <span className="font-medium">{interest}</span>
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-2 text-purple-500 hover:text-purple-700 p-1 hover:bg-purple-50 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest..."
                  className="flex-1 px-5 py-4 border border-gray-200 rounded-xl rounded-r-none focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-800"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="bg-purple-500 text-white px-5 py-4 rounded-xl rounded-l-none hover:bg-purple-600 flex items-center justify-center transition-colors w-16"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="p-8 border-t flex justify-end space-x-6 bg-gray-50">
          <button
            onClick={onClose}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center transition-colors font-medium text-lg shadow-md hover:shadow-lg"
          >
            <Save size={18} className="mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;