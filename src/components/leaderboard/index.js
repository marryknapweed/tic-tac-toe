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

  const sortLeaderboardByWinRate = (leaderboard) => {
    // Create a copy of the leaderboard array to avoid mutating the original
    const leaderboardCopy = [...leaderboard];
  
    return leaderboardCopy.sort((a, b) => {
      const totalGamesA = a.stats.wins + a.stats.draws + a.stats.losses;
      const totalGamesB = b.stats.wins + b.stats.draws + b.stats.losses;
  
      // Calculate win rates
      const winRateA = totalGamesA > 0 ? (a.stats.wins / totalGamesA) : 0;
      const winRateB = totalGamesB > 0 ? (b.stats.wins / totalGamesB) : 0;
  
      // Sort by win rate (descending)
      return winRateB - winRateA; // Higher win rate comes first
    });
  };
  
  // Sort the leaderboard by win rate before mapping
  const sortedLeaderboard = sortLeaderboardByWinRate(leaderboard);
  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <p className="leaderboard-undertitle">Best player's of tic-tac-toe</p>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Wins</th>
            <th>Draws</th>
            <th>Losses</th>
            <th>Total games count</th>
            <th>Winrate, %</th>
          </tr>
        </thead>
        <tbody>
        {sortedLeaderboard.map(({ username, stats }) => {
  const totalGames = stats.wins + stats.draws + stats.losses;
  const winRate = totalGames > 0 ? (stats.wins / totalGames) * 100 : 0; // Calculate win rate

  return (
    <tr key={username}>
      <td className="leaderboard-username">{username}</td>
      <td>{stats.wins}</td>
      <td>{stats.draws}</td>
      <td>{stats.losses}</td>
      <td>{totalGames}</td>
      <td>{winRate.toFixed(2)}%</td> {/* Display win rate with 2 decimal places */}
    </tr>
  );
})}
        </tbody>
      </table>
    </div>
  );
};
