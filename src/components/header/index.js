import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/user-slice";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import {ReactComponent as Logo} from "../../svgs/game-logo.svg"
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

  const handleLogout = e => {
    e.stopPropagation();
    dispatch(logout());
    navigate("/auth/signin");
    setMenuOpen(false);
    localStorage.removeItem("username"); // Удаляем токен авторизации
    localStorage.removeItem("role")
    localStorage.removeItem("id")
  };

  const goToProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };


  return (
    <header className="header">
      { !isAdmin && (
         <Link to="/chooseGameMode">
          <div className="header__container">
          <Logo width={60} height={60}/>
          <div className="header__logo__container">
            <p className="header__logo__Title">Tic-Tac-Toe</p>
            <p className="header__logo__underTitle">The game, by marryknapweed</p>
          </div>
         </div>
       </Link>
      )}
      <div className="header__burger" onClick={toggleMenu}>
        {menuOpen ? <HiX size={30} /> : <HiOutlineMenuAlt3 size={30} />}
      </div>
      <nav
        className={`header__nav ${menuOpen ? "header__nav--mobile open" : ""}`}
      >
      { !isAdmin && (
        <>
        <Link
          to="/bugReport"
          className="header__link"
          onClick={() => setMenuOpen(false)}
        >
         Find a bug?
        </Link>
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
        <Link
          to="/history"
          className="header__link"
          onClick={() => setMenuOpen(false)}
        >
          Game's History
        </Link>
        </>
      )}
      
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
