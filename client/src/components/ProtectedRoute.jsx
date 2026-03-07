import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <p>Checking access...</p>;
  }

  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}