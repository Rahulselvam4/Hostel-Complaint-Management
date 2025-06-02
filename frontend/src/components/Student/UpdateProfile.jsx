import axios from 'axios';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hostelblock, setHostelBlock] = useState('');
  const [roomno, setRoomNO] = useState('');
  const [id, setId] = useState('');
  const [photo, setPhoto] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || userData.mobile || '');
      setHostelBlock(userData.hostelblock || userData.hostelBlock || '');
      setRoomNO(userData.roomno || userData.roomNumber || userData.roomnumber || '');
      setId(userData._id || userData.id || '');
      setPhoto(userData.photo || '');
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('name', name);
    formData.append('email', email);
    formData.append('mobile', phone);
    formData.append('hostelBlock', hostelblock);
    formData.append('roomNumber', roomno);
    if (selectedImage) {
      formData.append('photo', selectedImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/updateprofile/student/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const updatedUser = {
        ...user,
        name,
        phone,
        email,
        hostelblock,
        roomno,
        id,
        photo: response.data?.student?.photo || photo,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Profile Updated!', {
        duration: 4000,
        position: 'top-right',
        style: {
          marginTop: '50px',
        },
      });

      navigate('/student');
    } catch (error) {
      console.log('Error updating profile:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#a80000]">PROFILE</h2>
        <form onSubmit={handleSubmit} className="grid gap-5" encType="multipart/form-data">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : photo || 'https://via.placeholder.com/100x100.png?text=No+Photo'
              }
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full border mb-2"
            />

            {editMode && (
              <label className="bg-red-700 hover:bg-red-600 text-white text-sm px-4 py-1 rounded cursor-pointer">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}
          </div>


          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold">Full Name</label>
            <input
              type="text"
              value={name}
              readOnly={!editMode}
              onChange={(e) => setName(e.target.value)}
              className={`w-full border ${editMode ? 'border-gray-300' : 'border-transparent bg-gray-100'
                } rounded-md px-4 py-2 mt-1`}
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
              className={`w-full border ${editMode ? 'border-gray-300' : 'border-transparent bg-gray-100'
                } rounded-md px-4 py-2 mt-1`}
            />
          </div>

          {/* Hostel Block */}
          <div>
            <label className="block text-gray-700 font-semibold">Hostel Block</label>
            <input
              type="text"
              value={hostelblock}
              readOnly={!editMode}
              onChange={(e) => setHostelBlock(e.target.value)}
              className={`w-full border ${editMode ? 'border-gray-300' : 'border-transparent bg-gray-100'
                } rounded-md px-4 py-2 mt-1`}
            />
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-gray-700 font-semibold">Room number</label>
            <input
              type="text"
              value={roomno}
              readOnly={!editMode}
              onChange={(e) => setRoomNO(e.target.value)}
              className={`w-full border ${editMode ? 'border-gray-300' : 'border-transparent bg-gray-100'
                } rounded-md px-4 py-2 mt-1`}
            />
          </div>

          {/* Button Section */}
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

export default UpdateProfile;
