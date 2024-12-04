import React, { useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { isNumberExistsInDB } from "../utils/firestore";

export function LoginWithPhone({ config = {} }) {
  const {
    title = "Phone Authentication",
    link = {},
    buttonText = "Send OTP",
  } = config;

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [errors, setErrors] = useState({
    phoneNumber: "",
    otp: "",
  });

  const navigate = useNavigate();
  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => console.log("Recaptcha verified"),
        "expired-callback": () => console.error("Recaptcha expired"),
      }
    );
  };

  const validatePhoneNumber = () => {
    const phoneRegex = /^\+?\d{10,14}$/; // Формат телефона с кодом страны
    if (!phoneNumber) {
      return "Phone number required.";
    } else if (!phoneRegex.test(phoneNumber)) {
      return "Invalid phone number format.";
    }
    return "";
  };

  const validateOtp = () => {
    if (!otp) {
      return "OTP required.";
    } else if (otp.length !== 6) {
      return "OTP must be 6 digits.";
    }
    return "";
  };

  const handleSendOtp = async e => {
    e.preventDefault();

    const phoneError = validatePhoneNumber();
    const isNumberExists = await isNumberExistsInDB(phoneNumber);
    console.log(isNumberExists);

    if (phoneError) {
      setErrors({ phoneNumber: phoneError });
      return;
    }

    try {
      if (!isNumberExists) {
        navigate("/sss"); // redirect to registration part !!!! ===========================
        return;
      }

      if (!window.recaptchaVerifier) {
        setupRecaptcha();
      }

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrors({
        phoneNumber: "Не удалось отправить SMS. Попробуйте снова.",
      });
    }
  };

  const handleVerifyOtp = async e => {
    e.preventDefault();

    const otpError = validateOtp();
    if (otpError) {
      setErrors(prevErrors => ({ ...prevErrors, otp: otpError }));
      return;
    }

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      console.log("Phone login successful");

      await localStorage.setItem("username", "123"); // Сохраняем имя пользователя
      navigate("/game");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors({
        otp: "Неправильный код или истек срок действия. Попробуйте снова.",
      });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth">
        <h2>{title}</h2>
        <form
          onSubmit={verificationId ? handleVerifyOtp : handleSendOtp}
          className="auth-form"
        >
          <div
            className={`input-container ${errors.phoneNumber ? "error" : ""}`}
          >
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={e => {
                setPhoneNumber(e.target.value);
                setErrors(prev => ({ ...prev, phoneNumber: "" }));
              }}
            />
          </div>
          {errors.phoneNumber && (
            <span className="error-message">{errors.phoneNumber}</span>
          )}

          {verificationId && (
            <>
              <div className={`input-container ${errors.otp ? "error" : ""}`}>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={e => {
                    setOtp(e.target.value);
                    setErrors(prev => ({ ...prev, otp: "" }));
                  }}
                />
              </div>
              {errors.otp && (
                <span className="error-message">{errors.otp}</span>
              )}
            </>
          )}

          <button type="submit" className="auth-button">
            {verificationId ? "Verify OTP" : buttonText}
          </button>

          {!verificationId && <div id="recaptcha-container"></div>}

          <div className="register-link">
            <span>{link.description}</span>
            <a href={link.href}>{link.text}</a>
          </div>
        </form>
      </div>
    </div>
  );
}
