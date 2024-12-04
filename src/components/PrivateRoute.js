import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Проверка авторизации через localStorage
export const PrivateRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("username")); // Проверяем токен авторизации

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" replace />;
};
