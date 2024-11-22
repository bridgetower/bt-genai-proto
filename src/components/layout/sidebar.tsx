import { MessageCircleMore, PowerIcon } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import Logo from "../common/logo";

export const Sidebar: React.FC = () => {
  const getAtiveItem = () => {
    const path = window.location.pathname;
    if (path === "/") {
      return "Chat";
    }
    if (path === "/settings") {
      return "Settings";
    }
    return "Chat";
  };
  return (
    <div className="min-h-screen  bg-navbackground text-navforeground shadow-lg">
      <div className="px-7 py-3 text-2xl font-bold  border-b border-gray-700">
        <Logo height={48} width={200} />
      </div>
      <div className="flex flex-col justify-between h-[calc(100%-90px)]">
        <ul className="mt-8">
          <li className="group px-6">
            <Link
              to={"/"}
              className={`block text-start text-base px-6 py-3 transform transition-all duration-300 ease-in-out group-hover:bg-gray-800 rounded-full group-hover:pl-10 group-hover:text-yellow-400 ${getAtiveItem() === "Chat" ? "bg-gray-800 rounded-full pl-10 text-yellow-400" : ""}`}
            >
              <div className="flex items-center">
                <MessageCircleMore className="mr-1" size={16} /> Chat
              </div>
            </Link>
          </li>
          {/* <li className="group px-6">
            <Link
              to={""}
              className={`block text-start text-base px-6 py-3 mt-2 transform transition-all duration-300 ease-in-out group-hover:bg-gray-800 rounded-full group-hover:pl-10 group-hover:text-yellow-400 ${getAtiveItem() === "Settings" ? "bg-gray-800 rounded-full pl-10 text-yellow-400" : ""}`}
            >
              <div className="flex items-center">
                <PowerIcon className="mr-1" size={16} /> Settings
              </div>
            </Link>
          </li> */}
        </ul>
        <ul className="mt-16">
          <li className="group px-6">
            <Link
              to={""}
              className={`block text-start text-base px-6 py-3 mt-2 transform transition-all duration-300 ease-in-out group-hover:bg-gray-800 rounded-full pl-10 group-hover:text-yellow-400 ${getAtiveItem() === "Settings" ? "bg-gray-800 rounded-full pl-10 text-yellow-400" : ""}`}
            >
              <div className="flex items-center">
                <PowerIcon className="mr-1" size={16} /> Logout
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
