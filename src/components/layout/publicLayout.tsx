import React, { useEffect } from "react";
// import { Navbar } from "../../components/navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../../providers/CoginitoAuthProvider";

export const PublicLayout: React.FC = () => {
  const navigate = useNavigate();
  const { usersession } = useAuth();
  useEffect(() => {
    if (usersession && usersession.isValid()) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div>
      <Outlet />
    </div>
  );
};
//#E7E6DE;
