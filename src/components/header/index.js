import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/user-slice";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import "./index.css";

export function Header() {
  const username = useSelector(state => state.user.username);
  const isAdmin = Boolean(localStorage.getItem("role") === 'admin')
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
         <Link to="/game" className="header__logo">
         Game App
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
      
        {username && (
          <div className="header__profile--mobile" onClick={goToProfile}>
            <FaUserCircle className="header__icon" />
            <span className="header__username">{username}</span>
            <button onClick={handleLogout} className="header__logout">
              Log out
            </button>
          </div>
        )}
      </nav>
      {username && (
        <div className="header__profile" onClick={goToProfile}>
          <FaUserCircle className="header__icon" />
          <span className="header__username">{username}</span>
          <button onClick={handleLogout} className="header__logout">
            Log out
          </button>
        </div>
      )}
    </header>
  );
}
