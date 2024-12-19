import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/user-slice";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import {ReactComponent as Logo} from "../../svgs/game-logo.svg"
import Modal from "../modal/modal";
import { roomActions, trackUsersActions } from "../../utils/firestore";
import "./index.css";

export function Header() {
  // const username = useSelector(state => state.user.username);
  // const username = localStorage.getItem("username")
  const isAdmin = Boolean(localStorage.getItem("role") === 'admin')
  const username = localStorage.getItem("username")
  const role = localStorage.getItem("role")
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [isShowModal, setIsShowModal] = useState(false)
  const [modalContent, setIsModalContent] = useState('')
  const currentFunc = useRef(function () {})
  const mobileNavRef = useRef(null);

  const handleGameDestroy = async () => {
    const roomId = localStorage.getItem("roomId")
    localStorage.removeItem("roomId")
    const actions = await roomActions()
    await actions.deleteRoom(roomId)
  }

  const deleteAndExit = async () => {
    setMenuOpen(false); 
    localStorage.removeItem("username"); // Удаляем токен авторизации
    localStorage.removeItem("role")
    dispatch(logout());
    navigate("/auth/signin");
    handleGameDestroy()
  }
  
    const handleGameExit = async () => {
      try {
        const roomId = localStorage.getItem("roomId")
        const trackActions = await trackUsersActions()
        await trackActions.setPlayerLeave(roomId, {status: true, byUsername: localStorage.getItem("username")}, true).then(() => localStorage.removeItem("roomId")).then(() => deleteAndExit())
      } catch {
        
      }
  
    }

  const handleLogout = e => {
    e.stopPropagation();
    const isWasOnlineGame = Boolean(localStorage.getItem("roomId"))
    if (isWasOnlineGame) {
      setIsModalContent("Are u sure that u gonna leave from lobby and exit?")
      setIsShowModal(true)
      currentFunc.current = function () {
        handleGameExit()
      }
    } else {
      deleteAndExit()
    } 
  };

  const goToProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  const toggleModal = (onCloseFunc = function () {}) => {
    setIsShowModal((prev) => !prev);
    onCloseFunc()
  };

   // Handle clicks outside of the mobile navigation
   const handleClickOutside = (event) => {
    if (mobileNavRef.current && !mobileNavRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="header">
      <Modal isOpen={isShowModal} onClose={toggleModal} content={modalContent}>
      <button className="auth-button" onClick={() => toggleModal(currentFunc.current)}>yes, i'm sure</button>
      <button className="auth-button" onClick={toggleModal}>no, i'm stay</button>
      </Modal>
         <Link to={!isAdmin ? "/chooseGameMode" : `${location.pathname}`}>
          <div className="header__container">
          <Logo width={60} height={60}/>
          <div className="header__logo__container">
            <p className="header__logo__Title">Tic-Tac-Toe</p>
            <p className="header__logo__underTitle">The game, by marryknapweed</p>
          </div>
         </div>
       </Link>
      <div className="header__burger" onClick={toggleMenu}>
        {menuOpen ? <HiX size={30} /> : <HiOutlineMenuAlt3 size={30} />}
      </div>
      <nav
        className={`header__nav ${menuOpen ? "header__nav--mobile open" : ""}`}
        ref={mobileNavRef} // Attach the ref to the navigation
      >
      { !isAdmin && (
        <>
        <Link
          to="/chooseGameMode"
          className="header__link"
          onClick={() => setMenuOpen(false)}
        >
          Change gamemode
        </Link>
        <Link
          to="/leaderboard"
          className="header__link"
          onClick={() => setMenuOpen(false)}
        >
          Leaderboard
        </Link>
        </>
      )}
      <>
        <Link
          to="/history"
          className="header__link"
          onClick={() => setMenuOpen(false)}
        >
          Game's History
        </Link>
        <Link
          to="/bugReport"
          className="header__link"
          onClick={() => setMenuOpen(false)}
        >
         {isAdmin ? "Bug reports" : "Find a bug?"}
        </Link>
        </>
      
      
        {username && (
          <div className="header__profile--mobile" onClick={goToProfile}>
            <FaUserCircle className="header__icon" />
            <div className="username-role-block">
            <span className="header__username">{username}</span>
            <span className="header__role">{role}</span>
          </div>
            <button onClick={handleLogout} className="header__logout">
              Log out
            </button>
          </div>
        )}
      </nav>
      {username && (
        <div className="header__profile" onClick={goToProfile}>
          <FaUserCircle className="header__icon" />
          <div className="username-role-block">
            <span className="header__username">{username}</span>
            <span className="header__role">{role}</span>
          </div>
          <button onClick={handleLogout} className="header__logout">
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
