import React from "react";
import Layout from "../Layout/Layout";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles: number[];
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  element,
}) => {
  const role = Number(localStorage.getItem("role_id"));
  const token = localStorage.getItem("token");
  const path = window.location.pathname;

  //REDIRECT TO LOGIN IF TOKEN OR ROLE NOT PRESENT
  if (
    token === null ||
    (token === "" && path !== "/login") ||
    role === undefined
  ) {
    window.location.href = "/login";
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={"/"} />;
  }

  return <Layout>{element}</Layout>;
};

export default ProtectedRoute;
