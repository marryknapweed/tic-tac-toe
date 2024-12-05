import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Login } from "./components/SignInForm";
import { Register } from "./components/SignUpForm";
import { Game } from "./components/game";
import { Layout } from "./components/Layout";
import { Profile } from "./components/profile";
import { Leaderboard } from "./components/leaderboard";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthTabs } from "./components/authTabs";
import { GameHistory } from "./components/gameHistory";

export const router = createBrowserRouter([
  // Открытые маршруты (авторизация)
  {
    path: "/auth",
    element: <AuthTabs />,
    children: [
      {
        path: "signin",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Register />,
      },
    ],
  },

  // Маршруты с Layout
  {
    path: "/",
    element: <PrivateRoute />, // Проверка авторизации
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "game",
            element: <Game />,
          },
          {
            path: "leaderboard",
            element: <Leaderboard />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "history",
            element: <GameHistory />,
          },
        ],
      },
    ],
  },
]);
