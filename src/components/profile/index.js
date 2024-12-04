import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./index.css";

export const Profile = () => {
  // Получаем данные пользователя из Redux
  const { username, stats } = useSelector(state => state.user);

  // Если пользователь не залогинен
  if (!username) {
    return <div>Profile not found</div>;
  }

  // Подсчитываем общее количество игр
  const totalGames = stats.wins + stats.losses + stats.draws;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">User Profile</h2>
      </div>

      <div className="profile-details">
        <p>
          <strong>Name:</strong>
          <span className="profile-username">{username}</span>
        </p>
        <p>
          <strong>Wins:</strong> {stats.wins}
        </p>
        <p>
          <strong>Draws:</strong> {stats.draws}
        </p>
        <p>
          <strong>Losses:</strong> {stats.losses}
        </p>
        <p>
          <strong>Total number of games:</strong> {totalGames}
        </p>
      </div>
      <Link to="/leaderboard" className="leaderboard-link">
        <button className="history-button">Leaderboard</button>
      </Link>
      {/* Ссылка на историю игр */}
      {/* <Link to="/history" className="game-history-link">
        <button className="history-button">Game History</button>
      </Link> */}
    </div>
  );
};
