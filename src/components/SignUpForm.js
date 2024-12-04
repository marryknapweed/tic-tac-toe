import React, { useState } from "react";
import { saveData, getData } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/authForm";
import { addRegisteredUser } from "../utils/firestore";

export function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    const existingUsers = getData("users") || {};
    if (existingUsers[username]) {
      alert("A user with the same name already exists!");
      return;
    }

    const updatedUsers = {
      ...existingUsers,
      [username]: { password },
    };

    const onlyPhoneNumber = phoneNumber.replace("+", "");

    // saveData("users", updatedUsers);
    addRegisteredUser(username, password, onlyPhoneNumber);
    alert("Registration successful!");
    navigate("/auth/signin");
  };

  const formConfig = {
    title: "Registration",
    username,
    password,
    phoneNumber,
    onUsernameChange: e => setUsername(e.target.value),
    onPasswordChange: e => setPassword(e.target.value),
    onPhoneNumberChange: e => setPhoneNumber(e.target.value),
    onSubmit: handleRegister,
    buttonText: "Register",
    link: {
      text: "Login",
      href: "/auth/signin",
      description: "Already registered?",
    },
  };

  return <AuthForm config={formConfig} />;
}
