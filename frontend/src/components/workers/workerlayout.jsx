import React, { useEffect, useState } from "react";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const WorkerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const openModal = (image) => {
    setCurrentImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage('');
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      navigate("/");
    }
    else if (role === 'student') {
      navigate('/student');
    }
    else if (role === 'admin') {
      navigate('/admin');
    }
  }, []);

  const [complaints, setComplaints] = useState([]);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/complaints/worker", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const complaintsArray = Object.values(response.data);
        console.log(response.data);

        setComplaints(complaintsArray);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, [on]);

  const navigation = [{ name: "Dashboard", href: "/worker" }];

  const userNavigation = [
    { name: "Your Profile" },
    { name: "Signout" },
  ];

  const handlenav = (name) => {
    if (name === "Signout") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate('/');
    }
    else {
      navigate('/worker/profile');
    }
  }

  const handleMarkComplete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:5000/api/complaints/${id}/resolve`,
        {},
        {
          headers:
          {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log(response.data);
      setOn(!on);
      toast.success('Complaint Resolved Successfully!', {
        duration: 4000,
        position: 'top-right', style: {
          marginTop: '50px',
        }
      });
    } catch (error) {
      console.log(error);

    }
  };

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-[#a80000] fixed top-0 w-full z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Left: Logo */}
                <div className="flex items-center space-x-4">
                  <img
                    className="h-8 w-8"
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/640px-Anna_University_Logo.svg.png"
                    alt="Logo"
                  />
                  <span className="text-white font-semibold text-lg tracking-wide">
                    HostelMate
                  </span>
                </div>

                {/* Right section: Dashboard & Notification */}
                <div className="flex items-center space-x-4 ml-auto">
                  <Link
                    to="/worker"
                    className="text-gray-300 hover:bg-[#800000] hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  {/* Profile Dropdown */}
                  <Menu as="div" className="relative">
                    <MenuButton className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={
                          // First try to get photo from array format
                          (JSON.parse(localStorage.getItem("user"))?.[1]?.photo ||
                            // Then try to get photo from object format
                            JSON.parse(localStorage.getItem("user"))?.photo ||
                            // Then try alternative field name 'photos'
                            JSON.parse(localStorage.getItem("user"))?.photos ||
                            // Fallback to default image
                            'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        )}
                        alt="User Profile"
                      />
                    </MenuButton>

                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white rounded-md py-1 ring-1 ring-black/5 shadow-lg">
                      {userNavigation.map((item) => (
                        <MenuItem key={item.name}>
                          <button
                            onClick={() => handlenav(item.name)}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {item.name}
                          </button>
                        </MenuItem>
                      ))}
                    </MenuItems>
                  </Menu>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-gray-700 hover:text-white">
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* Mobile dropdown nav */}
            <DisclosurePanel className="md:hidden px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-[#800000] hover:text-white text-center w-full"
                >
                  {item.name}
                </Link>
              ))}

              <div className="flex items-center mt-4 border-t border-gray-700 pt-4">

                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center text-sm">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={
                        // First try to get photo from array format
                        (JSON.parse(localStorage.getItem("user"))?.[1]?.photo ||
                          // Then try to get photo from object format
                          JSON.parse(localStorage.getItem("user"))?.photo ||
                          // Then try alternative field name 'photos'
                          JSON.parse(localStorage.getItem("user"))?.photos ||
                          // Fallback to default image
                          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        )}
                      alt="User Profile"
                    />
                  </MenuButton>
                  <MenuItems className="absolute z-10 mt-2 w-40 origin-top-right bg-white rounded-md py-1 ring-1 ring-black/5 shadow-lg">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        <button
                          onClick={() => handlenav(item.name)}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </button>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      {/* Main content */}
      <main className="pt-20 px-4 max-w-5xl mx-auto space-y-6 relative z-0">
        {location.pathname === "/worker" && (
          <>
            <h1 className="text-2xl font-bold text-gray-800">Complaints Received</h1>

            {complaints.length === 0 ? (
              <p className="text-gray-500 text-sm">No complaints assigned yet.</p>
            ) : (
              complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Image */}
                    <div className="flex-shrink-0">
                      {complaint.photo && (
                        <img
                          src={complaint.photo}
                          alt="Complaint"
                          className="w-20 h-20 object-cover rounded-md cursor-pointer"
                          onClick={() => openModal(complaint.photo)}
                        />
                      )}
                    </div>

                    {/* Middle: Description */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {complaint.description}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted on {complaint.createdAt.split("T")[0]}
                      </p>
                    </div>

                    {/* Right: Button */}
                    {complaint.status === "Pending" && (
                      <button
                        onClick={() => handleMarkComplete(complaint._id)}
                        className="bg-[#a80000] text-white px-4 py-2 rounded hover:bg-[#800000] text-sm self-start sm:self-center"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* Renders child components */}
        <Outlet />
      </main>



      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-md bg-opacity-80 z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg">
            <img src={currentImage} alt="Larger Complaint Photo" className="w-full h-auto" />
            <button
              onClick={closeModal}
              className="mt-4 bg-[#a80000] text-white px-4 py-2 rounded hover:bg-[#870000]"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default WorkerLayout;