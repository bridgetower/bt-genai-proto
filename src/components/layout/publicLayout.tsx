import React from "react";
import { Outlet } from "react-router-dom";

import { Sidebar } from "./sidebar";

export const PublicLayout: React.FC = () => {
  return (
    <div className="grid grid-cols-6">
      <Sidebar />
      <div className="col-span-5">
        <Outlet />
      </div>
    </div>
  );
};
