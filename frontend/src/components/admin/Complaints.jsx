import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Complaints = () => {
    const navigate = useNavigate();
      useEffect(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token) {
          navigate("/");
      }
      else if(role === 'worker')
      {
      navigate('/worker');
      }
      else if(role === 'student')
      {
        navigate('/student');
      }
      }, []);

    const [complaints, setComplaints] = useState([]);

    useEffect(() => {

        const fetchsummary = async() =>{

        const token = localStorage.getItem("token");
        try {
        const response = await axios.get("http://localhost:5000/api/complaints/all",
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        )
        const det = Object.values(response.data)
        console.log(response.data);
        
        setComplaints(det);
        } catch (error) {
            console.log(error);
        }
    }
    fetchsummary();
    },[])


  const [filter, setFilter] = useState("StalePending");
  const calculateDaysPending = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = currentDate - createdDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

    const pendingComplaints = complaints.filter((e) => (e.status === 'Pending'));
    const resolvedComplaints = complaints.filter((e) => (e.status === 'Resolved'));
    const stalepending = pendingComplaints.filter((e)=> (calculateDaysPending(e.createdAt)>=3));



  const filterOptions = [
    { key: "StalePending", label: "Stale Pending" },
    { key: "Pending", label: "Pending" },
    { key: "Resolved", label: "Resolved" },
    { key: "All", label: "All" },
  ];


  return (
  <div className="p-6 space-y-6">
 <div className="flex flex-wrap gap-2 sm:gap-4">
  {filterOptions.map(({ key, label }) => (
    <button
      key={key}
      onClick={() => setFilter(key)}
      className={`px-4 py-2 rounded-md text-sm font-medium w-full sm:w-auto ${
        filter === key
          ? "bg-[#a80000] text-white"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {label}
    </button>
  ))}
</div>


    <div className="space-y-4 mt-4">
      {filter === "All" && (
        complaints.length > 0 ? (
          complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white p-4 rounded-lg shadow space-y-2 relative"
            >
              <div className="flex gap-4 items-center">
                {complaint.photo && (
                  <img
                    src={complaint.photo}
                    alt="Complaint"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{complaint.description}</h3>
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-medium ${
                        complaint.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Category: {complaint.issueCategory}
                  </p>
                  <p className="text-sm text-gray-600">
                    Submitted on: {complaint.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No complaints found.</p>
        )
      )}

      {filter === "Pending" && (
        pendingComplaints.length > 0 ? (
          pendingComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white p-4 rounded-lg shadow space-y-2 relative"
            >
              <div className="flex gap-4 items-center">
                {complaint.photo && (
                  <img
                    src={complaint.photo}
                    alt="Complaint"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{complaint.description}</h3>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Category: {complaint.issueCategory}
                  </p>
                  <p className="text-sm text-gray-600">
                    Submitted on: {complaint.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No pending complaints found.</p>
        )
      )}

      {filter === "StalePending" && (
        stalepending.length > 0 ? (
          stalepending.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white p-4 rounded-lg shadow space-y-2 relative"
            >
              <div className="flex gap-4 items-center">
                {complaint.photo && (
                  <img
                    src={complaint.photo}
                    alt="Complaint"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{complaint.description}</h3>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-700">
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Category: {complaint.issueCategory}
                  </p>
                  <p className="text-sm text-gray-600">
                    Submitted on: {complaint.createdAt.split("T")[0]}
                  </p>
                  <p className="text-sm text-gray-600">
                    It remained unsolved for {calculateDaysPending(complaint.createdAt)} days
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No stale pending complaints found.</p>
        )
      )}

      {filter === "Resolved" && (
        resolvedComplaints.length > 0 ? (
          resolvedComplaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white p-4 rounded-lg shadow space-y-2 relative"
            >
              <div className="flex gap-4 items-center">
                {complaint.photo && (
                  <img
                    src={complaint.photo}
                    alt="Complaint"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{complaint.description}</h3>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                      {complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Category: {complaint.issueCategory}
                  </p>
                  <p className="text-sm text-gray-600">
                    Submitted on: {complaint.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-4">No resolved complaints found.</p>
        )
      )}
    </div>
  </div>
);
};

export default Complaints;