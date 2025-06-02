import React from "react";
import { Disclosure } from "@headlessui/react";

const Navbar = () => {
  return (
    <>
      <Disclosure as="nav" className="bg-[#a80000] fixed w-full z-50 top-0">
        {({ open }) => (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <img
                  className="h-8 w-8"
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Anna_University_Logo.svg/640px-Anna_University_Logo.svg.png"
                  alt="University Logo"
                />
                <span className="ml-2 text-white font-semibold text-xl">
                  HostelMate
                </span>
              </div>
            </div>
          </div>
        )}
      </Disclosure>
    </>
  );
};

export default Navbar;
