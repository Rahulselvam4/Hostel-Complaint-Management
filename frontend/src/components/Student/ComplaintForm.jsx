import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ComplaintForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      navigate("/");
    } else if (role === "worker") {
      navigate("/worker");
    } else if (role === "admin") {
      navigate("/admin");
    }
  }, []);

  const [issueCategory, setIssueCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [photo, setPhoto] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!issueCategory || !location.trim() || !description.trim()) {
      toast.error("All fields except photo are mandatory!", {
        duration: 4000,
        position: "top-right",
        style: { marginTop: "50px" },
      });
      return;
    }



    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: Please log in again.");
        navigate("/");
        return;
      }

      const formData = new FormData();
      formData.append("issueCategory", issueCategory);
      formData.append("location", location);
      formData.append("description", description);
      formData.append("priority", priority);
      if (photo) formData.append("photo", photo);

      await axios.post("http://localhost:5000/api/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Complaint submitted successfully!", {
        duration: 4000,
        position: "top-right",
        style: { marginTop: "50px" },
      });

      setIssueCategory("");
      setLocation("");
      setDescription("");
      setPriority("Low");
      setPhoto(null);
      navigate("/student/my-complaints");
    } catch (error) {
      console.error("Complaint submission error:", error.response || error);
      toast.error("Enter valid details!", {
        duration: 4000,
        position: "top-right",
        style: { marginTop: "50px" },
      });
    }
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">File a Complaint</h2>
        <p className="text-sm text-gray-500">
          Please provide the details of your complaint below.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>


          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700"
            >
              Location<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="Eg. Room 102, Block B"
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description<span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Explain the issue in detail"
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 min-h-[100px]"
            />
          </div>
          {/* Issue Category */}
          <div>
            <label
              htmlFor="issueCategory"
              className="block text-sm font-medium text-gray-700"
            >
              Issue Category<span className="text-red-500">*</span>
            </label>
            <select
              id="issueCategory"
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value)}
              required
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">Select Category</option>
              <option value="Electrical">Electrical</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Photo Upload */}
          <div>
            <label
              htmlFor="photo"
              className="block text-sm font-medium text-gray-700"
            >
              Upload a Photo <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-[#a80000] hover:bg-[#800000] text-white font-medium py-2 px-4 rounded-md"
            >
              Submit Complaint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
