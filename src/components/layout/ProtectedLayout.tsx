import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/CoginitoAuthProvider";

import { Sidebar } from "./sidebar";

export const ProtectedLoyout: React.FC = () => {
  const navigate = useNavigate();
  const { usersession } = useAuth();
  const token = localStorage.getItem("idToken");
  useEffect(() => {
    if (token) {
      if (token && usersession && !usersession.isValid()) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [usersession]);
  const path = window.location.pathname;
  console.log("path", path);

  return (
    <div className={`grid grid-cols-6`}>
      {path !== "/" && <Sidebar />}
      <div className={`${path === "/" ? "col-span-6" : "col-span-5"}`}>
        <Outlet />
      </div>
    </div>
  );
};
