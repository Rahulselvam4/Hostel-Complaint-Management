import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      navigate("/");
    }
    else if (role === 'worker') {
      navigate('/worker');
    }
    else if (role === 'admin') {
      navigate('/admin');
    }
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin-announcement", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const announcement = Object.values(response.data);
        console.log(announcement);

        setAnnouncements(announcement);

      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };
    fetchComplaints();
  }, []);


  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to HostelMate
        </h1>
        <p className="text-gray-700">
          We're glad to have you here! This platform is designed to make it
          easier for you to submit and track hostel-related complaints, provide
          feedback, and stay informed.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-[#a80000] mb-4">
          Announcements
        </h2>
        {announcements.length > 0 ? (
          <ol className="list-disc list-inside text-gray-700 space-y-2">
            {announcements.map((announce) => (
              <li key={announce._id}>{announce.announcement}</li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500 italic">No announcements available.</p>
        )}
      </div>


      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-[#a80000] mb-4">
          Instructions
        </h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-2">
          <li>
            Use the <strong>"New Complaint"</strong> tab to register any issues
            you face in your hostel block.
          </li>
          <li>
            You can view the status of your complaints under{" "}
            <strong>"My Complaints"</strong>.
          </li>
          <li>
            Once your complaint is marked as resolved, please fill out the{" "}
            <strong>"Feedback"</strong> form.
          </li>
          <li>
            Make sure all required fields in forms are filled before submitting.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default DashboardHome;
