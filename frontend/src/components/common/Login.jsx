import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cegImage from "../../assets/ceg.jpg";
import Navbar from "../common/Navbar";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    if (isBlocked) return;

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signin", {
        email,
        password
      });

      const token = res.data.token;
      const role = res.data.user.role;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success('Welcome...!', {
        duration: 4000,
        position: 'top-right',
        style: { marginTop: '50px' }
      });

      if (role === 'student') navigate('/student');
      else if (role === 'worker') navigate('/worker');
      else if (role === 'admin') navigate('/admin');
    } catch (err) {
      const isRateLimit = err?.response?.status === 429;
      const message = err?.response?.data?.message || "Invalid credentials!";

      toast.error(message, {
        duration: 4000,
        position: 'top-right',
        style: { marginTop: '50px' }
      });

      if (isRateLimit) {
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 15 * 60 * 1000); // 15 minutes
      }

      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen pt-16">
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${cegImage})` }}
        />
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            <div className="bg-white shadow-md rounded-xl p-8 border border-gray-200">
              <div className="flex justify-center mb-6">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/640px-Anna_University_Logo.svg.png"
                  alt="University Logo"
                  className="h-16"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Login to your account
              </h2>

              <form className="space-y-4" onSubmit={handleSignin}>
                <input
                  type="text"
                  placeholder="Email/Mobile"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="absolute right-3 top-2.5 cursor-pointer text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>

                <div className="text-right text-sm text-red-600 hover:underline cursor-pointer">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isBlocked}
                    className={`w-40 text-white font-semibold py-2 rounded ${isBlocked
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700'
                      }`}
                  >
                    {isBlocked ? 'Please try after 15 minutes' : 'Login'}
                  </button>
                </div>
              </form>
              <div className="mt-6 flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      const res = await axios.post("http://localhost:5000/api/auth/google-login", {
                        credential: credentialResponse.credential,
                      });

                      const token = res.data.token;
                      const role = res.data.role;

                      localStorage.setItem("token", token);
                      localStorage.setItem("role", role);
                      localStorage.setItem("user", JSON.stringify(res.data.user));

                     

                      if (role === 'student') navigate('/student');
                      else if (role === 'worker') navigate('/worker');
                      else if (role === 'admin') navigate('/admin');
                      
                      toast.success('Welcome', {
                        duration: 4000,
                        position: 'top-right',
                        style: { marginTop: '50px' }
                      });

                    } catch (err) {
                      toast.error("Google Login Failed");
                      console.error(err);
                    }
                  }}
                  onError={() => {
                    toast.error("Google Login Failed");
                  }}
                />
              </div>


              <p className="text-sm text-center text-gray-600 mt-4">
                New user?{" "}
                <Link to="/register" className="text-red-600 hover:underline ">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
