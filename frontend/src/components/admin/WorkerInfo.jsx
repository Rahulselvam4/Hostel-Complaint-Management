import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const WorkerInfo = () => {
  const [activeTab, setActiveTab] = useState("workerList");
  const [workers, setWorkers] = useState([]);
  const [newWorker, setNewWorker] = useState({
    name: "",
    email: "",
    mobile: "",
    field: "",
    employeeNumber: "",
    photo: null,
  });
  const [on, setOn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      navigate("/");
    }
    else if (role === 'worker') {
      navigate('/worker');
    }
    else if (role === 'student') {
      navigate('/student');
    }
  }, []);

  useEffect(() => {
    const fetchsummary = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/api/admin/workers",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        const det = Object.values(response.data)
        console.log(response.data);
        setWorkers(det);
      } catch (error) {
        console.log(error);
      }
    }
    fetchsummary();
  }, [on])

  // Handle input changes for new worker form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorker((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setNewWorker((prev) => ({
      ...prev,
      photo: file,
    }));
  };

  // Add new worker
  const handleAddWorker = async() => {
    try {
      const token = localStorage.getItem("token");
      
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('name', newWorker.name);
      formData.append('email', newWorker.email);
      formData.append('password', 'password123');
      formData.append('mobile', newWorker.mobile);
      formData.append('employeeNumber', newWorker.employeeNumber);
      formData.append('field', newWorker.field);
      if (newWorker.photo) {
        formData.append('photo', newWorker.photo);
      }
          
      const response = await axios.post("http://localhost:5000/api/admin/workers/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log(response.data);
      toast.success('Added successfully!', {
        duration: 4000,
        position: 'top-right', 
        style: {
          marginTop: '50px',
        }
      }); 
      setOn(!on);
      setNewWorker({
        name: "",
        email: "",
        mobile: "",
        field: "",
        employeeNumber: "",
        photo: null,
      });
      setActiveTab("workerList");
    } catch (error) {
      console.log(error);
      toast.error('Failed to add worker', {
        duration: 4000,
        position: 'top-right',
        style: {
          marginTop: '50px',
        }
      });
    }
  };

  // Remove worker
  const handleRemoveWorker = (id) => {
    const deleteWorker = async () => {
      console.log(id);
      
      const token = localStorage.getItem("token");
      try {
        const response = await axios.delete(`http://localhost:5000/api/admin/workers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        const det = Object.values(response.data)
        console.log(response.data);
        setOn(!on);
        toast.success('Deleted successfully!', {
          duration: 4000,
          position: 'top-right', 
          style: {
            marginTop: '50px',
          }
        }); 
      } catch (error) {
        console.log(error);
        toast.error('Failed to delete worker', {
          duration: 4000,
          position: 'top-right',
          style: {
            marginTop: '50px',
          }
        });
      }
    }
    deleteWorker();
  };

  return (
  <div className="p-6 space-y-6">
    <div className="flex space-x-4 mb-6">
      <button
        onClick={() => setActiveTab("workerList")}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          activeTab === "workerList"
            ? "bg-[#a80000] text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        Workers List
      </button>
      <button
        onClick={() => setActiveTab("addWorker")}
        className={`px-4 py-2 rounded-md text-sm font-medium ${
          activeTab === "addWorker"
            ? "bg-[#a80000] text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        Add New Worker
      </button>
    </div>

    {/* Workers List */}
    {activeTab === "workerList" && (
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold">Workers List</h3>
        {workers.length === 0 ? (
          <p className="text-center text-gray-500">No workers found.</p>
        ) : (
          workers.map((worker) => (
            <div
              key={worker.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                {worker.photo && (
                  <img 
                    src={worker.photo} 
                    alt={worker.name}
                    className="w-16 h-16 rounded-md object-cover"
                  />
                )}
                <div>
                  <p>
                    <span className="font-semibold">Name:</span> {worker.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {worker.email}
                  </p>
                  <p>
                    <span className="font-semibold">Mobile:</span> {worker.mobile}
                  </p>
                  <p>
                    <span className="font-semibold">Field:</span> {worker.field}
                  </p>
                  <p>
                    <span className="font-semibold">Employee Number:</span> {worker.employeeNumber}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleRemoveWorker(worker._id)}
                className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    )}

    {/* Add New Worker Form */}
    {activeTab === "addWorker" && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add New Worker</h3>
        <input
          type="text"
          name="name"
          placeholder="Name *"
          value={newWorker.name}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-400 rounded-md"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email *"
          value={newWorker.email}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-400 rounded-md"
          required
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile *"
          value={newWorker.mobile}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-400 rounded-md"
          required
        />
       
        <input
          type="text"
          name="employeeNumber"
          placeholder="Employee Number *"
          value={newWorker.employeeNumber}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-400 rounded-md"
          required
        />
        <div className="grid gap-2">
          
          <select
            id="field"
            name="field"
            value={newWorker.field}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Select Field</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Carpentry">Carpentry</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full p-2 border border-gray-400 rounded-md"
          />
        </div>
        <button
          onClick={() => {
            if (!newWorker.name) {
              toast.error("Name is required");
              return;
            }
            if (!newWorker.email) {
              toast.error("Email is required");
              return;
            }
            if (!newWorker.mobile) {
              toast.error("Mobile is required");
              return;
            }
            if (!newWorker.field) {
              toast.error("Field is required");
              return;
            }
            if (!newWorker.employeeNumber) {
              toast.error("Employee Number is required");
              return;
            }
            if(!newWorker.photo) {
              toast.error("Photo is required");
              return;
            }
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newWorker.email)) {
              toast.error("Invalid email format");
              return;
            }
            if (!/^\d{10}$/.test(newWorker.mobile)) {
              toast.error("Mobile number must be 10 digits");
              return;
            }
            if (newWorker.photo && newWorker.photo.size > 2 * 1024 * 1024) {
              toast.error("Photo size should be less than 2MB");
              return;
            }
            handleAddWorker();
          }}
          className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Add Worker
        </button>
      </div>
    )}
  </div>
);
};
export default WorkerInfo