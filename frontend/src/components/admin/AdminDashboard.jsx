import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    oldPending: 0,
    totalWorkers: 0,
    totalStudents: 0,
    loading: true,
    error: null
  });

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token) {
      navigate("/");
    } else if (role === 'worker') {
      navigate('/worker');
    } else if (role === 'student') {
      navigate('/student');
    }
  }, [navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // Handle both direct data and nested data responses
        const data = response.data.data || response.data;
        
        setDashboardData({
          totalComplaints: data.totalComplaints || 0,
          pendingComplaints: data.pendingComplaints || 0,
          resolvedComplaints: data.resolvedComplaints || 0,
          oldPending: data.oldPending || 0,
          totalWorkers: data.totalWorkers || 0,
          totalStudents: data.totalStudents || 0,
          loading: false,
          error: null
        });
        
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || error.message
        }));
      }
    };

    fetchSummary();
  }, []);

  if (dashboardData.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="p-6 text-red-500">
        Error: {dashboardData.error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          title="Total Complaints" 
          value={dashboardData.totalComplaints} 
        />
        <StatCard 
          title="Pending Complaints" 
          value={dashboardData.pendingComplaints} 
        />
        <StatCard 
          title="Resolved Complaints" 
          value={dashboardData.resolvedComplaints} 
        />
        <StatCard 
          title="Pending Stale Complaints (>3 days)" 
          value={dashboardData.oldPending} 
        />
        <StatCard 
          title="Total Students Registered" 
          value={dashboardData.totalStudents} 
        />
        <StatCard 
          title="Total Workers" 
          value={dashboardData.totalWorkers} 
        />
      </div>
    </div>
  );
};

// Reusable StatCard component
const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg shadow-gray-400 border border-gray-300">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-xl mt-2">{value}</p>
  </div>
);

export default AdminDashboard;