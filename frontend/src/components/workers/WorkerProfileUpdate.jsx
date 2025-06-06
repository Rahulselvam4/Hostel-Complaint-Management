import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const WorkerProfileUpdate = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [field, setField] = useState('');
  const [id, setId] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);

  const navigate = useNavigate();

 useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      // Parse the user data from localStorage
      const userData = JSON.parse(storedUser);
      
      // Check if the data is an object (not array)
      if (typeof userData === 'object' && !Array.isArray(userData)) {
        setName(userData.name || '');
        setEmail(userData.email || '');
        setPhone(userData.mobile || userData.module ||userData.phone || ''); // Using module as fallback
        setEmployeeNumber(userData.employeeNumber || '');
        setField(userData.field || '');
        setId(userData._id || userData.id ||'');
        setPhotoPreview(userData.photo || userData.photos || ''); // Using photos as fallback
        setUser(userData);
      } else {
        // Handle case where data might be in array format
        const [userId, userDetails] = userData;
        setName(userDetails.name || '');
        setEmail(userDetails.email || '');
        setPhone(userData.mobile || userData.module ||userData.phone || ''); // Using module as fallback
        setEmployeeNumber(userDetails.employeeNumber || '');
        setField(userDetails.field || '');
        setId(userDetails._id || userId ||userDetails.id || '');
        setPhotoPreview(userDetails.photo || userDetails.photos || '');
        setUser(userDetails);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      toast.error('Failed to load profile data');
    }
  } else {
    toast.error('User data not found');
    navigate('/worker');
  }
}, [navigate]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file)); // For preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", phone);
    formData.append("employeeNumber", employeeNumber);
    formData.append("field", field);
    if (photoFile) formData.append("photo", photoFile);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/updateprofile/worker/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      localStorage.setItem('user', JSON.stringify([id, response.data.worker]));
      toast.success('Profile updated successfully!');
      navigate('/worker');
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#a80000]">Worker Profile</h2>
        <form onSubmit={handleSubmit} className="grid gap-5">

          {/* Photo Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Photo</label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Worker"
                    className="w-24 h-24 object-cover rounded-full border border-gray-300"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-full border border-gray-300 text-sm text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              {editMode && (
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('photoInput').click()}
                    className="px-3 py-1 bg-[#a80000] text-white rounded-md text-sm hover:bg-[#800000]"
                  >
                    {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  </button>
                </div>
              )}
            </div>
            <input
              type="file"
              id="photoInput"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={!editMode}
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Full Name</label>
            <input
              type="text"
              value={name}
              readOnly={!editMode}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border ${editMode ? 'border-gray-300' : 'border-transparent bg-gray-100'} rounded-md px-4 py-2 mt-1`}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold">Mobile Number</label>
            <input
              type="tel"
              value={phone}
              readOnly={!editMode}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full border ${editMode ? 'border-gray-300' : 'border-transparent bg-gray-100'} rounded-md px-4 py-2 mt-1`}
            />
          </div>

          {/* Employee Number */}
          <div>
            <label className="block text-gray-700 font-semibold">Employee Number</label>
            <input
              type="text"
              value={employeeNumber}
              readOnly={!editMode}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              className={`w-full border ${editMode ? 'border-gray-300' : 'border-transparent bg-gray-100'} rounded-md px-4 py-2 mt-1`}
            />
          </div>

          {/* Field */}
          <div>
            <label className="block text-gray-700 font-semibold">Field</label>
            <input
              type="text"
              value={field}
              readOnly={!editMode}
              onChange={(e) => setField(e.target.value)}
              className={`w-full border ${editMode ? 'border-gray-300' : 'border-transparent bg-gray-100'} rounded-md px-4 py-2 mt-1`}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-4">
            {!editMode ? (
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="bg-[#a80000] hover:bg-[#800000] text-white px-6 py-2 rounded-md font-medium"
              >
                Update
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-md font-medium"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default WorkerProfileUpdate;