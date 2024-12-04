import React from "react";
import { Header } from "./header";
import { Footer } from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "./container";

export function Layout() {
  const location = useLocation();

  // Список маршрутов, на которых Header и Footer НЕ должны отображаться
  const hideLayoutRoutes = ["/auth/signin", "/auth/signup"];
  const isLayoutHidden = hideLayoutRoutes.includes(location.pathname);

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
