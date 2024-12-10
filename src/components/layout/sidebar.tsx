import { ChevronDown, MessageCircleMore, PowerIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/providers/CoginitoAuthProvider";

import Logo from "../common/logo";

export const Sidebar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const { logout, usersession } = useAuth(); // Assuming `user` contains name, email, and avatar.
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (usersession) {
      setUser(usersession.getIdToken().payload);
    }
  }, [usersession]);
  const getActiveItem = () => {
    const pathToLabelMap: { [key: string]: string } = {
      "/": "Chat",
      "/settings": "Settings",
      "/my-file-requests": "myRequests"
    };
    return pathToLabelMap[location.pathname] || "Chat";
  };

  const activeItem = getActiveItem();

  return (
    <div className="min-h-screen bg-navbackground text-navforeground shadow-lg flex flex-col">
      {/* Logo Section */}
      <div className="px-7 py-3 text-2xl font-bold border-b border-gray-700">
        <Logo height={48} width={200} />
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col justify-between">
        <ul className="mt-8">
          <li className="group px-6">
            <Link
              to="/"
              className={`block text-start text-base px-6 py-3 transform transition-all duration-300 ease-in-out rounded-full group-hover:bg-gray-800 group-hover:pl-10 group-hover:text-yellow-400 ${
                activeItem === "Chat" ? "bg-gray-800 pl-10 text-yellow-400" : ""
              }`}
            >
              <div className="flex items-center">
                <MessageCircleMore className="mr-2" size={16} /> Chat
              </div>
            </Link>
          </li>
          <li className="group px-6 mt-2">
            <Link
              to="my-file-requests"
              className={`block text-start text-base px-6 py-3 transform transition-all duration-300 ease-in-out rounded-full group-hover:bg-gray-800 group-hover:pl-10 group-hover:text-yellow-400 ${
                activeItem === "myRequests" ? "bg-gray-800 pl-10 text-yellow-400" : ""
              }`}
            >
              <div className="flex items-center">
                <MessageCircleMore className="mr-2" size={16} /> My Requests
              </div>
            </Link>
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-start justify-between cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          {/* User Info */}
          <div className="flex items-center">
            <img
              src={
                user?.picture ||
                `https://avatar.iran.liara.run/username?username=${(user?.given_name || "") + " " + (user?.family_name || "")}`
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-sm font-medium">{(user?.given_name || "") + " " + (user?.family_name || "")}</p>
              <p className="text-xs text-gray-400">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          {/* Dropdown Icon */}
          <ChevronDown size={20} className={`${isDropdownOpen ? "rotate-180" : ""} transition-transform`} />
        </div>

        {/* Dropdown Content */}
        {isDropdownOpen && (
          <div className="mt-4 bg-gray-800 rounded-lg shadow-lg">
            <button
              onClick={logout}
              className="w-full text-left text-base px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 flex items-center"
            >
              <PowerIcon className="mr-2" size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
