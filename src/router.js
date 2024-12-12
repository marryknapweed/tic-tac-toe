import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Login } from "./components/SignInForm";
import { Register } from "./components/SignUpForm";
import { Game } from "./components/game";
import { ChooseGameMode } from "./components/chooseMode";
import { Layout } from "./components/Layout";
import { Profile } from "./components/profile";
import { Leaderboard } from "./components/leaderboard";
import { PrivateRoute } from "./components/PrivateRoute";
import { AuthTabs } from "./components/authTabs";
import { GameHistory } from "./components/gameHistory";
import { ConnectRoom } from "./components/roomsForm/connectForm";
import { HostRoom } from "./components/roomsForm/hostRoomForm";
import { OnlineGameType } from "./components/roomsForm";
import { LoginWithPhone } from "./components/LoginWithPhone";
import { GameOnline } from "./components/gameOnline";

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
      {
        path: "phone",
        element: <LoginWithPhone />,
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
          // {
          //   path: "game",
          //   element: <Game />,
          // },
           {
            path: "chooseGameMode",
            element: <ChooseGameMode />,
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
            element: <GameHistory />, // Admin-only access
          },
        ],
      },
    ],
  },
  {
    path: "/game",
    element: <PrivateRoute />, // Проверка авторизации
    children: [
      {
        path: "", // This will match "/game"
        element: <Layout />, // Only one Layout here
        children: [
                {
                  path: 'chooseOnlineMode',
                  element: <OnlineGameType />
                },
                {
                  path: "create",
                  element: <HostRoom />,
                }, 
                {
                  path: "connect",
                  element: <ConnectRoom />,
                },
          {
            path: "AI",
            element: <Game />,
          },
          {
            path: "online/:id",
            element: <GameOnline />,
          }, 
        ],
      },
    ],
  }
]);