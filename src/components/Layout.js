import React, {useEffect, useState} from "react";
import { Header } from "./header";
import { Footer } from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "./container";

export function Layout() {
  const location = useLocation();

  // Список маршрутов, на которых Header и Footer НЕ должны отображаться
  const hideLayoutRoutes = ["/auth/signin", "/auth/signup"];
  const isLayoutHidden = hideLayoutRoutes.includes(location.pathname);

  const [prevLocation, setPrevLocation] = useState(location)
  
  useEffect(() => {
    const separatedlink = prevLocation.pathname.split("/")
    setPrevLocation(location);
    const isWasOnlineGame = Boolean(separatedlink[1] === 'game' && separatedlink[2] === "online" && separatedlink[3].length === 5)
    const isLeavedTheGamePage = localStorage.getItem("roomId") ? true : false
    if (isWasOnlineGame && isLeavedTheGamePage && prevLocation.pathname !== location.pathname) {
      alert("Are u sure?")
    }
  }, [location]);


  return (
    <>
      {!isLayoutHidden && <Header />}
      <Container>
        <Outlet />
      </Container>
      {/* {!isLayoutHidden && <Footer />} */}
    </>
  );
}
