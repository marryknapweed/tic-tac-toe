import { Login } from "../SignInForm";
import { Register } from "../SignUpForm";
import { LoginWithPhone } from "../LoginWithPhone";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./index.css";

export function AuthTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const pathWayDictionary = {
    "/auth": "register",
    "/auth/signup": "register",
    "/auth/signin": "login",
    "/auth/phone": "phone"
  };

  const [activeTab, setActiveTab] = useState(pathWayDictionary[currentPath]);

  useEffect(() => {
    // Update the active tab based on the current path
    setActiveTab(pathWayDictionary[currentPath]);
  }, [currentPath, pathWayDictionary]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Update the URL based on the selected tab
    switch (tab) {
      case "login":
        navigate("/auth/signin");
        break;
      case "register":
        navigate("/auth/signup");
        break;
      case "phone":
        navigate("/auth/phone");
        break;
      default:
        navigate("/auth/signin");
    }
  };

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
          onClick={() => handleTabChange("login")}
        >
          Log In
        </button>
        <button
          className={`tab-button ${activeTab === "register" ? "active" : ""}`}
          onClick={() => handleTabChange("register")}
        >
          Register
        </button>
        <button
          className={`tab-button ${activeTab === "phone" ? "active" : ""}`}
          onClick={() => handleTabChange("phone")}
        >
          Phone Login
        </button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
}