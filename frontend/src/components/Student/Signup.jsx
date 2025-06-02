import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cegImage from "../../assets/ceg.jpg";
import Navbar from "../common/Navbar";
import axios from 'axios';
import toast from "react-hot-toast";

const Signup = () => {

  const [userName,setuserName] = useState('');
  const [email,setEmail] = useState('');
  const [mobile,setMobile] = useState('');
  const [password,setPassword] = useState('');
  const [cpassword,setCpassword] = useState('');
  const [hostelName,setHostelName] = useState('');
  const [roomNo,setRoomNo] = useState('');
  const [regNo,setregNo] = useState('');
  const navigate = useNavigate();



  const handleSignup = async(e) =>{
    e.preventDefault();
    if(password !== cpassword)
    {
      alert("Password and Confirm Password should be same");
    }

    await axios.post("http://localhost:5000/api/auth/signup",{
      name:userName,
      email:email,
      password:password,
      mobile:mobile,
      registerNumber:regNo,
      hostelBlock:hostelName,
      roomNumber:roomNo
    })
    .then(data => {
      toast.success('Registered successfully!', {duration: 4000,
        position: 'top-right', style: {
          marginTop: '50px',
        }
      });  
      console.log(data)})
    .catch((err) => {console.log(err);
    })
    navigate('/');

  }

  return (
    <>
      <Navbar />
      <div className="flex  pt-16">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{
            backgroundImage: `url(${cegImage})`,
          }}
        />

        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
          <div className="min-h-screen bg-white shadow-md rounded-xl p-6 border border-gray-200">

            <div className="flex justify-center mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/640px-Anna_University_Logo.svg.png"
                alt="University Logo"
                className="h-16"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Create an Account
            </h2>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                onChange={(e)=>{setuserName(e.target.value)}}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none "
                onChange={(e)=>{setEmail(e.target.value)}}
                required
              />
              <input
                type="tel"
                placeholder="Mobile"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none "
                onChange={(e)=>{setMobile(e.target.value)}}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none "
                onChange={(e)=>{setPassword(e.target.value)}}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                onChange={(e)=>{setCpassword(e.target.value)}}
                required
              />
              <input
                type="text"
                placeholder="RegisterNumber"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                onChange={(e)=>{setregNo(e.target.value)}}
                required
              />
              <input
                type="text"
                placeholder="Room No"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                onChange={(e)=>{setRoomNo(e.target.value)}}
                required
              />
              <input
                type="text"
                placeholder="Hostel Block Name"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                onChange={(e)=>{setHostelName(e.target.value)}}
                required
              />

              <div className="flex justify-center">
                <button
                  className="w-40 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-700"
                  onClick={handleSignup}
                >
                  Signup
                </button>
              </div>
            </form>

            <p className="text-sm text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/" className="text-red-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
