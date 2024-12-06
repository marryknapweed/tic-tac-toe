import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Проверка авторизации через localStorage
export const PrivateRoute = () => {
  const isAuthenticated = Boolean(localStorage.getItem("username") && localStorage.getItem('id')); // Проверяем токен авторизации
  const isAdmin = Boolean(localStorage.getItem('role') === 'admin');

  if (isAdmin) {
    return <Outlet />; // Render the Outlet for admin users
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" replace />;
};