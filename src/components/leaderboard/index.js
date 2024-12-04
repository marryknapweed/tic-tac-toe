import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../../redux/leaderboard-slice";

import "./index.css";

export const Leaderboard = () => {
  const dispatch = useDispatch();
  const { leaderboard, status, error } = useSelector(
    state => state.leaderboard
  );

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Таблица лидеров</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Wins</th>
            <th>Draws</th>
            <th>Losses</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(({ username, stats }) => (
            <tr key={username}>
              <td className="leaderboard-username">{username}</td>
              <td>{stats.wins}</td>
              <td>{stats.draws}</td>
              <td>{stats.losses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
