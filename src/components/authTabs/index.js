import React, { useState } from "react";
import { Login } from "../SignInForm";
import { Register } from "../SignUpForm";
import { LoginWithPhone } from "../LoginWithPhone";
import { useLocation } from "react-router-dom";
import "./index.css";

export function AuthTabs() {

  const location = useLocation();
  const currentPath = location.pathname

  const pathWayDictionary = {
    "/auth": "register",
    "/auth/signup": "register",
    "/auth/signin": "login",
  }

  const [activeTab, setActiveTab] = useState(pathWayDictionary[currentPath]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "login":
        return <Login />;
      case "register":
        return <Register />;
      case "phone":
        return <LoginWithPhone />;
      default:
        return <Login />;
    }
  };

  return (
    <div className="auth-tabs">
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Log In
        </button>
        <button
          className={`tab-button ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
        <button
          className={`tab-button ${activeTab === "phone" ? "active" : ""}`}
          onClick={() => setActiveTab("phone")}
        >
          Phone Login
        </button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}
