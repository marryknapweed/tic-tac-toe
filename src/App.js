import React from "react";
import { LoginWithPhone } from "./components/LoginWithPhone";

export function App() {
  const config = {
    title: "Sign In with Phone", // Заголовок страницы
    onSubmit: () => console.log("Login successful"), // Функция, вызываемая после успешного входа
    buttonText: "Send OTP", // Текст на кнопке для отправки OTP
  };

  return (
    <div>
      <LoginWithPhone config={config} />{" "}
    </div>
  );
}
