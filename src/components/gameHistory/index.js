import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGameHistory } from "../../utils/firestore";
import { setGameHistory } from "../../redux/game-history-slice";
import "./index.css";

export const GameHistory = () => {
  const dispatch = useDispatch();
  const username = useSelector(state => state.user.username);
  const gameHistory = useSelector(state => state.gameHistory.games);

  useEffect(() => {
    const loadHistory = async () => {
      if (username) {
        const games = await fetchGameHistory(username);
        dispatch(setGameHistory(games));
      }
    };
    loadHistory();
  }, [username, dispatch]);

  // Группировка игр по датам
  const groupedGames = gameHistory
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp)
    .reduce((groups, game) => {
      const date = new Date(game.timestamp).toLocaleDateString();
      const existingGroup = groups.find(group => group.date === date);
      if (existingGroup) {
        existingGroup.games.push(game);
      } else {
        groups.push({ date, games: [game] });
      }
      return groups;
    }, []);

  return (
    <div className="game-history-container">
      <h3 className="game-history-title">Game History</h3>
      {groupedGames.length > 0 ? (
        groupedGames.map(group => (
          <div key={group.date} className="game-history-date-group">
            <h4 className="game-history-date">{group.date}</h4>
            <ul className="game-history-list">
              {group.games.map((game, index) => (
                <li
                  key={game.id || game.timestamp || index}
                  className="game-history-item"
                >
                  <div className="game-history-details">
                    <p>
                      <strong>Opponent:</strong> {game.opponentName}
                    </p>
                    <p>
                      <strong>Result:</strong> {game.result}
                    </p>
                    <p>
                      <strong>Duration:</strong> {game.duration} seconds
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(game.timestamp).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="no-games-message">No games played yet.</p>
      )}
    </div>
  );
};