import React, {useEffect, useState, useRef} from "react";
import { Header } from "./header";
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "./container";
import { trackUsersActions } from "../utils/firestore";
import Modal from "./modal/modal";

export function Layout() {
  const location = useLocation();

  // Список маршрутов, на которых Header и Footer НЕ должны отображаться
  const hideLayoutRoutes = ["/auth/signin", "/auth/signup"];
  const isLayoutHidden = hideLayoutRoutes.includes(location.pathname);

  const [prevLocation, setPrevLocation] = useState(location)

  const [isShowModal, setIsShowModal] = useState(false)
  const [modalContent, setIsModalContent] = useState('')
  const currentFunc = useRef(function () {})

  const deleteRoom = async () => {
    const ref = await trackUsersActions()
    await ref.setPlayerLeave(localStorage.getItem("roomId"), {status: true, byUsername: localStorage.getItem("username")}, true)
  }
  
  useEffect(() => {
    const separatedlink = prevLocation.pathname.split("/")
    setPrevLocation(location);
    const isWasOnlineGame = Boolean(separatedlink[1] === 'game' && separatedlink[2] === "online" && separatedlink[3].length === 5)
    const isLeavedTheGamePage = localStorage.getItem("roomId") ? true : false
    if (isWasOnlineGame && isLeavedTheGamePage && prevLocation.pathname !== location.pathname) {
      setIsModalContent("Are u sure that u gonna leave from game?")
      setIsShowModal(true)
      if (location.pathname === '/chooseGameMode') {
        currentFunc.current = function () {deleteRoom()}
      }
    }
  }, [location]);

  const toggleModal = (onCloseFunc = function () {}) => {
    setIsShowModal((prev) => !prev);
    onCloseFunc()
  };

  return (
    <>
      <Modal isOpen={isShowModal} onClose={toggleModal} content={modalContent}>
      <button className="auth-button" onClick={() => toggleModal(currentFunc.current)}>Okay</button>
      </Modal>
      {!isLayoutHidden && <Header />}
      <Container>
        <Outlet />
      </Container>
      {/* {!isLayoutHidden && <Footer />} */}
    </>
  );
}
