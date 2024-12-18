import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import "./index.css";

export function AuthForm({ config }) {
  const {
    title,
    username,
    password,
    phoneNumber,
    onUsernameChange,
    onPasswordChange,
    onPhoneNumberChange,
    onSubmit,
    link,
    buttonText,
  } = config;

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    phoneNumber: "",
  });
  const [isShownPNI, setIsShownPNI] = useState(
    title !== "Login" ? false : true
  );

  const handleUsernameChange = e => {
    onUsernameChange(e);
    setErrors(prevErrors => ({
      ...prevErrors,
      username: "", // Убираем ошибку для имени пользователя
    }));
  };

  const handlePasswordChange = e => {
    onPasswordChange(e);
    setErrors(prevErrors => ({
      ...prevErrors,
      password: "", // Убираем ошибку для пароля
    }));
  };

  const handlePhoneNumber = e => {
    onPhoneNumberChange(e);
    setErrors(prevErrors => ({
      ...prevErrors,
      phoneNumber: "", // Убираем ошибку для пароля
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Проверка имени пользователя
    if (!username) {
      newErrors.username = "Username required.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username =
        "The username can only contain letters, numbers and '_'.";
    }

    // Проверка пароля
    if (!password) {
      newErrors.password = "Password required.";
    } else if (password.length < 6) {
      newErrors.password = "The password must be at least 6 characters.";
    } else if (/\s/.test(password)) {
      newErrors.password = "The password must not contain spaces.";
    } else if (
      !/^[a-zA-Z0-9!@#$%^&*()_+=[\]{}|;:'",.<>?/`~\\-]+$/.test(password)
    ) {
      newErrors.password =
        "The password must contain only Latin letters, numbers and special characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Возвращаем true, если ошибок нет
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Поле имени пользователя */}
          <div className={`input-container ${errors.username ? "error" : ""}`}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          {errors.username && (
            <span className="error-message">{errors.username}</span>
          )}

          {/* Поле пароля */}
          <div className={`input-container ${errors.password ? "error" : ""}`}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          {!isShownPNI && (
            <div
              className={`input-container ${errors.phoneNumber ? "error" : ""}`}
            >
              <input
                type="text"
                placeholder="Phone number"
                value={phoneNumber}
                onChange={handlePhoneNumber}
              />
            </div>
          )}

          {errors.password && (
            <span className="error-message">{errors.password}</span>
          )}

          {/* Кнопка отправки */}
          <button type="submit" className="auth-button">
            {buttonText}
          </button>

          {/* Ссылка */}
          <div className="register-link">
            <span>{link.description}</span>
            <a href={link.href}>{link.text}</a>
          </div>
        </form>
      </div>
    </div>
  );
}
