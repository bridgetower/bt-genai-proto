import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@/providers/CoginitoAuthProvider";

import { Sidebar } from "./sidebar";

export const ProtectedLoyout: React.FC = () => {
  const navigate = useNavigate();
  const { usersession } = useAuth();
  useEffect(() => {
    if (!usersession || !usersession.isValid()) {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <div className="grid grid-cols-6">
      <Sidebar />
      <div className="col-span-5">
        <Outlet />
      </div>
    </div>
  );
};
