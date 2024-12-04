import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/user-slice";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "../components/authForm";
import { authenticateUser } from "../utils/firestore";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username && password) {
      const isAuthenticated = await authenticateUser(username, password);

      if (isAuthenticated) {
        const savedUsername = localStorage.setItem("username", username);
        dispatch(login(savedUsername));
        navigate("/game");
      } else {
        alert("Invalid username or password");
      }
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      dispatch(login(savedUsername));
      navigate("/game");
    }
  }, [dispatch, navigate]);

  const formConfig = {
    title: "Login",
    username,
    password,
    onUsernameChange: e => setUsername(e.target.value),
    onPasswordChange: e => setPassword(e.target.value),
    onSubmit: handleLogin,
    buttonText: "Login",
    link: {
      text: "Register",
      href: "/auth/signup",
      description: "Don't have an account?",
    },
  };

  return <AuthForm config={formConfig} />;
}
