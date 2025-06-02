import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentLayout from "../Student/StudentLayout";
import DashboardHome from "../Student/DashboardHome";
import ComplaintForm from "../Student/ComplaintForm";
import MyComplaints from "../Student/MyComplaints";
import Signup from "../Student/Signup";
import Login from "../common/Login";
import WorkerLayout from "../workers/workerlayout";
import AdminLayout from "../admin/AdminLayout";
import AdminDashboard from "../admin/AdminDashboard";
import Complaints from "../admin/Complaints";
import WorkerInfo from "../admin/WorkerInfo";
import Announcement from "../admin/Announcement";
import UpdateProfile from "../Student/UpdateProfile";
import WorkerProfileUpdate from "../workers/WorkerProfileUpdate";
import ForgotPassword from "../common/ForgetPassword";
const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/student" element={<StudentLayout />}>
        <Route path="/student" element={<DashboardHome />} />
        <Route path="new-complaint" element={<ComplaintForm />} />
        <Route path="my-complaints" element={<MyComplaints />} />
        <Route path="updateprofile" element={<UpdateProfile/>} />
      </Route>
      <Route path="/worker" element={<WorkerLayout />}>
        <Route path="profile" element={<WorkerProfileUpdate />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="complaints" element={<Complaints/>} />
        <Route path="worker-info" element={<WorkerInfo/>} />
        <Route path="announcement" element={<Announcement/>} />
      </Route>
    </Routes>
);
};

export default Index;
