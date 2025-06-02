import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Announcement = () => {
  const [announcement, setAnnouncement] = useState([]);
  const [on, setOn] = useState(false);
  const [activeTab, setActiveTab] = useState("view");
  const [addnew, setAddNew] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin-announcement", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const announcements = Object.values(response.data);
        setAnnouncement(announcements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [on]);

  const handleRemoveAnnouncement = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(`http://localhost:5000/api/admin-announcement/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOn(!on);
      toast.success('Deleted successfully!', {
        duration: 4000,
        position: 'top-right',
        style: { marginTop: '50px' }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddAnnouncement = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(`http://localhost:5000/api/admin-announcement`, { announcement: addnew }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOn(!on);
      toast.success('Added successfully!', {
        duration: 4000,
        position: 'top-right',
        style: { marginTop: '50px' }
      });
      setActiveTab("view");
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateAnnouncement = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(`http://localhost:5000/api/admin-announcement/${id}`, { announcement: editText }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOn(!on);
      setEditingId(null);
      setActiveTab("view");
      toast.success('Updated successfully!', {
        duration: 4000,
        position: 'top-right',
        style: { marginTop: '50px' }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
        <button
          onClick={() => setActiveTab("view")}
          className={`px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto ${
            activeTab === "view" ? "bg-[#a80000] text-white" : "bg-gray-100 text-gray-800"
          }`}
        >
          Announcements
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto ${
            activeTab === "add" ? "bg-[#a80000] text-white" : "bg-gray-100 text-gray-800"
          }`}
        >
          Add Announcement
        </button>
      </div>

      {/* View Announcements */}
      {activeTab === "view" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Announcements</h3>
          {announcement.length === 0 ? (
            <p className="text-center text-gray-500">No Announcement found</p>
          ) : (
            announcement.map((announce) => (
              <div
                key={announce._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow gap-4"
              >
                <div className="w-full sm:flex-1 sm:max-w-full">
                  {editingId === announce._id ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border border-gray-300 p-2 rounded w-full"
                    />
                  ) : (
                    <p className="break-words whitespace-pre-wrap text-justify">
                      {announce.announcement}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  {editingId === announce._id ? (
                    <>
                      <button
                        onClick={() => handleUpdateAnnouncement(announce._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(announce._id);
                          setEditText(announce.announcement);
                        }}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleRemoveAnnouncement(announce._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-md w-full sm:w-auto"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Announcement */}
      {activeTab === "add" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Add New Announcement</h3>
          <input
            type="text"
            name="announcement"
            placeholder="Write your announcement..."
            onChange={(e) => setAddNew(e.target.value)}
            className="w-full p-2 border border-gray-400 rounded-md"
          />
          <button
            onClick={handleAddAnnouncement}
            className="bg-red-700 text-white px-4 py-2 rounded-md w-full sm:w-auto"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default Announcement;
