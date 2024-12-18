import React, { useState } from "react";
import { saveData, getData } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/authForm";
import { addRegisteredUser, isUserAccountExists } from "../utils/firestore";

export function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [isShowModal, setIsShowModal] = useState(false)
  const [modalContent, setIsModalContent] = useState('')

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
      setIsModalContent("Wrong number format, please check it out and try again");
      setIsShowModal(true)
      return;
    }

      const isAccountExist = await isUserAccountExists(username, phoneNumber)
      if (isAccountExist) {
      setIsModalContent("Account with same nickname or phone number already exists! Please log-in or use other credentials");
      setIsShowModal(true)
      return;   
    } else {
      const onlyPhoneNumber = phoneNumber.replace("+", "");
      const registrationResult = await addRegisteredUser(username, password, onlyPhoneNumber);
      if (registrationResult === undefined) {
        setIsModalContent("Registration successful!");
        setIsShowModal(true)
      } else {
        setIsModalContent("Sorry, some problems with registration... please, try later again");
        setIsShowModal(true)
      }
    }
    

    // const updatedUsers = {
    //   ...existingUsers,
    //   [username]: { password },
    // };

    // saveData("users", updatedUsers);
  };

  const onCloseFunc = () => {
    setIsShowModal(false); // Close the modal
    setUsername("");
    setPassword("");
    setPhoneNumber("");
    navigate("/auth/signin"); // Navigate to the sign-in page
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
    isShowModal, modalContent, setIsModalContent, setIsShowModal, onCloseFunc
  };

  return <AuthForm config={formConfig} />;
}
