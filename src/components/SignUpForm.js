import React, { useState } from "react";
import { saveData, getData } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/authForm";
import { addRegisteredUser, isUserAccountExists } from "../utils/firestore";

export function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    // const existingUsers = getData("users") || {};
    // if (existingUsers[username]) {

    const validatePhoneNumber = (phoneNumber) => {
      // Regex to match the specified phone number formats without spaces
      const phoneRegex = /^(?:\+?\d{1,3}\d{2}\d{3}\d{2}\d{2}|8\d{3}\d{2}\d{2}\d{2})$/;
    
      if (!phoneNumber) {
        return "Phone number required.";
      } else if (!phoneRegex.test(phoneNumber)) {
        return "Invalid phone number format.";
      }
      return "";
    };
      const numberErr = validatePhoneNumber(phoneNumber)

    if (numberErr) {
      alert("Wrong number format, please check it out and try again");
      return;
    }

      const isAccountExist = await isUserAccountExists(username, phoneNumber)
      if (isAccountExist) {
      alert("Account with same nickname or phone number already exists! Please log-in or use other credentials");
      return;   
    } else {
      const onlyPhoneNumber = phoneNumber.replace("+", "");
      const registrationResult = await addRegisteredUser(username, password, onlyPhoneNumber);
      if (registrationResult === undefined) {
        alert("Registration successful!");
        navigate("/auth/signin");
      } else {
        alert("Sorry, some problems with registration... please, try later again");
      }
    }

    // const updatedUsers = {
    //   ...existingUsers,
    //   [username]: { password },
    // };

    // saveData("users", updatedUsers);
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
