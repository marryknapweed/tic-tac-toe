import React, { useState } from "react";
import { Login } from "../SignInForm";
import { Register } from "../SignUpForm";
import { LoginWithPhone } from "../LoginWithPhone";
import "./index.css";

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState("login");

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
