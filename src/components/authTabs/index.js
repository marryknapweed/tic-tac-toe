import React, { useState } from "react";
import { Login } from "../SignInForm";
import { Register } from "../SignUpForm";
import { LoginWithPhone } from "../LoginWithPhone";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

export function AuthTabs() {

  const location = useLocation();
  const navigate = useNavigate()
  const currentPath = location.pathname

  const pathWayDictionary = {
    "/auth/signup": "register",
    "/auth/signin": "login",
    "/auth/phone": "phone"
  }

  const tabByLink = pathWayDictionary[currentPath] 

  const [activeTab, setActiveTab] = useState(tabByLink ? tabByLink : "login");

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

  const handleButtonClick = (title) => {
    setActiveTab(title);
    const path = Object.keys(pathWayDictionary).find(key => pathWayDictionary[key] === title);
    if (path) {
      navigate(path);
    } else {
      console.error(`No path found for title: ${title}`);
    }
  };

  return (
    <div className="auth-tabs">
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === "login" ? "active" : ""}`}
          onClick={() => handleButtonClick("login")}
        >
          Log In
        </button>
        <button
          className={`tab-button ${activeTab === "register" ? "active" : ""}`}
          onClick={() => handleButtonClick("register")}
        >
          Register
        </button>
        <button
          className={`tab-button ${activeTab === "phone" ? "active" : ""}`}
          onClick={() => handleButtonClick("phone")}
        >
          Phone Login
        </button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}
