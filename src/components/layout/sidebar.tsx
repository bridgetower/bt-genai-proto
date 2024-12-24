import { useQuery } from "@apollo/client";
import { ChevronDown, LibraryBig, MessageCircleMore, PowerIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { FETCH_PROJECT_DDL_LIST } from "@/apollo/schemas/projectSchemas";
import { useAuth } from "@/providers/CoginitoAuthProvider";

import { Logo } from "../common/logo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const Sidebar: React.FC = () => {
  const token = localStorage.getItem("idToken");
  const [user, setUser] = useState<any>(null);
  const [projectList, setProjectList] = useState([]);
  const { logout, usersession } = useAuth(); // Assuming `user` contains name, email, and avatar.
  const location = useLocation();
  // const naivgate = useNavigate();
  const [projectId, setProjectId] = useState<string>(localStorage.getItem("projectId") || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data: projectListData } = useQuery(FETCH_PROJECT_DDL_LIST, {
    variables: {
      pageNo: 1,
      limit: 1000,
      organizationId: "3f0d758e-84c9-4a3d-b15a-da7a0c2229ba"
    },
    context: {
      apiVersion: "admin",
      headers: {
        identity: token
      }
    }
  });

  useEffect(() => {
    setProjectList(projectListData?.ListProject?.data?.projects || []);
  }, [projectListData]);
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

  const handleProjectChange = (value: string) => {
    localStorage.setItem("projectId", projectId);
    setProjectId(value);
    // naivgate("/chat");
  };

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
              to="/chat"
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
      <div className="p-6">
        <Select onValueChange={handleProjectChange} defaultValue={projectId}>
          <SelectTrigger className="w-full border-none rounded-lg bg-gray-800 text-white hover:text-yellow-400 ring-offset-transparent focus:ring-0 focus:ring-offset-0">
            <div className="flex items-center gap-1 ">
              <LibraryBig size={16} /> <SelectValue placeholder="Select a project" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {projectList.map((project: any) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
