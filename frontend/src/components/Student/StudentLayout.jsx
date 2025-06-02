import React, { useEffect } from "react";
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
import { Link, Outlet, useNavigate } from "react-router-dom";

const StudentLayout = () => {
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

  const handlenav = (name) => {
    if (name === "Signout") {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    } else {
      navigate("/student/updateprofile");
    }
  };

  const navigation = [
    { name: "Dashboard", href: "/student" },
    { name: "New Complaint", href: "/student/new-complaint" },
    { name: "My Complaints", href: "/student/my-complaints" },
  ];

  const userNavigation = [
    { name: "Your Profile" },
    { name: "Signout" },
  ];

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-[#a80000] fixed top-0 w-full z-50">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-8 w-8"
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/640px-Anna_University_Logo.svg.png"
                    alt="University Logo"
                  />
                  <div className="hidden md:block ml-10 space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="text-gray-300 hover:bg-[#800000] hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right section */}
                <div className="hidden md:flex items-center">
                  <Menu as="div" className="relative ml-3">
                    <MenuButton className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={JSON.parse(localStorage.getItem("user"))?.photo || "default-image-url"}
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
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            {/* Mobile menu panel */}
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

              {/* Mobile view: Profile menu */}
              <div className="flex items-center justify-center mt-4 border-t border-gray-700 pt-4">
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center text-sm">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={JSON.parse(localStorage.getItem("user"))?.photo || "default-image-url"}
                      alt="User Profile"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-40 origin-top-right bg-white rounded-md py-1 ring-1 ring-black/5 shadow-lg">
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

      <main className="pt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;