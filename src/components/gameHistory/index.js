import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGameHistory } from "../../utils/firestore";
import { setGameHistory } from "../../redux/game-history-slice";
import "./index.css";
import { useNavigate } from "react-router-dom";

export const GameHistory = () => {
  const dispatch = useDispatch();
  const gameHistory = useSelector(state => state.gameHistory.games);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGameHistory = async () => {
      const isAdmin = Boolean(localStorage.getItem("role") === 'admin')
      const id = localStorage.getItem("id")
      const games = isAdmin ? await fetchGameHistory() : await fetchGameHistory(id);
      console.log("Fetched games:", games); // Log the fetched games
      dispatch(setGameHistory(games));
    };
      loadGameHistory();
  }, [dispatch, navigate]); // Add navigate to the dependency array

  // Группировка игр по датам
  const groupedGames = gameHistory
  .slice()
  .sort((a, b) => b.date - a.date) // Sort by date in descending order
  .reduce((groups, game) => {
      const date = new Date(game.date * 1000).toLocaleDateString(); // Convert seconds to milliseconds and format date
      const existingGroup = groups.find(group => group.date === date);
      
      if (existingGroup) {
          existingGroup.games.push(game); // Add game to existing group
      } else {
          groups.push({ date, games: [game] }); // Create new group
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
                key={game.id || game.date || index}
                className="game-history-item"
              >
                <div className="game-history-details">
                  <p>
                    <strong>Opponent:</strong> {game.opponent}
                  </p>
                  <p>
                    <strong>Who win's:</strong> {game.wins}
                  </p>
                  <p>
                    <strong>Username:</strong> {game.username ? game.username: 'user'}
                  </p>
                  <p>
                    <strong>Gamemode:</strong> {game.type}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(game.date * 1000).toLocaleString()}
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

    // <div className="game-history-container">
    //   <h3 className="game-history-title">Game History</h3>
    //   {groupedGames.length > 0 ? (
    //     groupedGames.map(group => (
    //       <div key={group.date} className="game-history-date-group">
    //         <h4 className="game-history-date">{group.date}</h4>
    //         <ul className="game-history-list">
    //           {group.games.map((game, index) => (
    //             <li
    //               key={game.id || game.timestamp || index}
    //               className="game-history-item"
    //             >
    //               <div className="game-history-details">
    //                 <p>
    //                   <strong>Opponent:</strong> {game.opponentName}
    //                 </p>
    //                 <p>
    //                   <strong>Result:</strong> {game.result}
    //                 </p>
    //                 <p>
    //                   <strong>Duration:</strong> {game.duration} seconds
    //                 </p>
    //                 <p>
    //                   <strong>Date:</strong>{" "}
    //                   {new Date(game.timestamp).toLocaleString()}
    //                 </p>
    //               </div>
    //             </li>
    //           ))}
    //         </ul>
    //       </div>
    //     ))
    //   ) : (
    //     <p className="no-games-message">No games played yet.</p>
    //   )}
    // </div>
  );
};