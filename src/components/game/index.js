// import React, { useState, useEffect } from "react";
// import { Board } from "../board";
// import { useDispatch, useSelector } from "react-redux";
// import { logout, updateStats } from "../../redux/user-slice";
// import { useNavigate } from "react-router-dom";
// import { calculateWinner } from "../../utils";
// import { makeAIMove } from "../../utils/ai";
// import { saveData, getData } from "../../utils/localStorage";
// import { saveGameResult } from "../../utils/firestore";
// import { addGameHistory } from "../../redux/game-history-slice";
// import { Timer } from "../timer";
// import "./index.css";

// export function Game({ player }) {
//   // Функция для форматирования продолжительности
//   const formatDuration = duration => {
//     const hours = Math.floor(duration / 3600000);
//     const minutes = Math.floor((duration % 3600000) / 60000);
//     const seconds = Math.floor((duration % 60000) / 1000);

//     return `${hours}h ${minutes}m ${seconds}s`;
//   };

//   const username = useSelector(state => state.user.id);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [history, setHistory] = useState([Array(9).fill(null)]);
//   const [currentMove, setCurrentMove] = useState(0);
//   const [currentSquares, setCurrentSquares] = useState(Array(9).fill(null));
//   const [scores, setScores] = useState({ X: 0, O: 0 });
//   const [timeUntilChaos, setTimeUntilChaos] = useState(5);
//   const [gameOver, setGameOver] = useState(false);
//   const [gameStarted, setGameStarted] = useState(false); // Состояние для отслеживания начала игры
//   const [isPlayerTurn, setIsPlayerTurn] = useState(true); //Cостояние для хода игрока
//   const [winnerUpdated, setWinnerUpdated] = useState(false);
//   const [isHistoryVisible, setIsHistoryVisible] = useState(false);
//   const [botLevel, setBotLevel] = useState("easy");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [gameStartTime, setGameStartTime] = useState(null);
//   const xIsNext = currentMove % 2 === 0;
//   const winner = calculateWinner(currentSquares);
//   const isBoardFull = currentSquares.every(square => square !== null);

//   useEffect(() => {
//     if (!username) {
//       navigate("/auth/signin");
//     }
//   }, [username, navigate]);

//   useEffect(() => {
//     const savedScores = getData("scores") || { X: 0, O: 0 };
//     setScores(savedScores);
//   }, []);

//   useEffect(() => {
//     if (gameOver) return;

//     const chaosTimer = setInterval(() => {
//       setTimeUntilChaos(prevTime => {
//         if (prevTime <= 1) {
//           chaos();
//           return 5; // Сброс таймера
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => clearInterval(chaosTimer);
//   }, [gameOver, currentSquares]);

//   const chaos = () => {
//     const newSquares = [...currentSquares];
//     for (let i = newSquares.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [newSquares[i], newSquares[j]] = [newSquares[j], newSquares[i]];
//     }

//     setCurrentSquares(newSquares);
//     setHistory(prevHistory => {
//       const newHistory = [...prevHistory];
//       newHistory[currentMove] = newSquares;
//       return newHistory;
//     });
//     setCurrentMove(prevMove => prevMove);
//   };

//   // При начале игры инициализируйте gameStartTime
//   function handlePlay(nextSquares, index) {
//     // Проверяем, если игра окончена, клетка уже занята, или ход не игрока
//     if (gameOver || nextSquares[index] || !isPlayerTurn) return;

//     const updatedSquares = nextSquares.slice();
//     updatedSquares[index] = xIsNext ? "X" : "O"; // Устанавливаем X или O в выбранную клетку

//     const nextHistory = [...history.slice(0, currentMove + 1), updatedSquares];
//     setHistory(nextHistory);
//     setCurrentMove(nextHistory.length - 1);
//     setCurrentSquares(updatedSquares);
//     setTimeUntilChaos(5); // Сбрасываем таймер хаоса

//     if (!gameStarted) {
//       setGameStarted(true);
//       setGameStartTime(Date.now()); // Устанавливаем текущее время как время начала игры
//     }

//     setIsPlayerTurn(false); // Передаем ход AI
//   }

//   function jumpTo(move) {
//     setCurrentMove(move);
//     setCurrentSquares(history[move]);
//   }

//   function resetGame() {
//     setHistory([Array(9).fill(null)]);
//     setCurrentMove(0);
//     setCurrentSquares(Array(9).fill(null));
//     setGameOver(false);
//     setWinnerUpdated(false);
//     setGameStarted(false);
//     setTimeUntilChaos(5);
//     setIsPlayerTurn(true); // Сброс хода на игрока
//   }

//   useEffect(() => {
//     if (gameOver) return;

//     if (winner && !winnerUpdated) {
//       // Обновление состояния при победе
//       const newScores = { ...scores };
//       newScores[winner.winner] += 1;
//       setScores(newScores);
//       setWinnerUpdated(true); // Устанавливаем, что победитель обновлен

//       // Обновляем статистику
//       const result = winner.winner === "X" ? "wins" : "losses";
//       updateGameStats(result);
//     } else if (!winner && isBoardFull && !gameOver) {
//       // Обновление состояния при ничьей
//       setGameOver(true);
//       updateGameStats("draws");
//     }
//   }, [winner, winnerUpdated, scores, isBoardFull, gameOver]);

//   // Функция для обновления статистики и сохранения результатов
//   const updateGameStats = result => {
//     const gameDuration = Date.now() - gameStartTime; // Вычисляем продолжительность игры
//     const formattedDuration = formatDuration(gameDuration); // Преобразуем продолжительность в читаемый формат

//     const gameData = {
//       opponentName: "AI",
//       result,
//       duration: formattedDuration, // Добавляем форматированное время
//       timestamp: new Date().toISOString(),
//     };

//     dispatch(updateStats({ result }));
//     // saveGameResult(username, gameData); // Сохранение в Firestore
//     // dispatch(addGameHistory(gameData)); // Обновление в Redux
//     setGameOver(true); // Завершение игры
//   };

//   useEffect(() => {
//     if (!gameOver && !isPlayerTurn) {
//       const timeout = setTimeout(() => {
//         const aiMove = makeAIMove(currentSquares, botLevel);

//         if (aiMove !== null && currentSquares[aiMove] === null) {
//           const updatedSquares = [...currentSquares];
//           updatedSquares[aiMove] = "O"; // AI всегда играет "O"

//           const nextHistory = [
//             ...history.slice(0, currentMove + 1),
//             updatedSquares,
//           ];
//           setHistory(nextHistory);
//           setCurrentMove(nextHistory.length - 1);
//           setCurrentSquares(updatedSquares);

//           setIsPlayerTurn(true); // Передаем ход игроку
//         }
//       }, 500);

//       return () => clearTimeout(timeout); // Очищаем таймаут
//     }
//   }, [currentSquares, isPlayerTurn, gameOver, botLevel, history, currentMove]);

//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   const handleSelect = level => {
//     setBotLevel(level);
//     setIsDropdownOpen(false);
//   };

//   // Функция обработчик для завершения таймера
//   const handleTimerEnd = () => {
//     if (!gameOver) {
//       chaos();
//     }
//   };

//   return (
//     <div className="game">
//       <div className="game-container">
//         <div className="game-sidebar">
//           <div className="game-selector">
//             <label className="game-mode">Select game mode:</label>
//             <div
//               className={`custom-dropdown ${isDropdownOpen ? "open" : ""}`}
//               onClick={toggleDropdown}
//             >
//               <button className="custom-dropdown-button">{botLevel}</button>
//               <ul className="custom-dropdown-list">
//                 <li onClick={() => handleSelect("easy")}>Easy</li>
//                 <li onClick={() => handleSelect("medium")}>Medium</li>
//                 <li onClick={() => handleSelect("hard")}>Hard</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div className="game-main">
//           {gameStarted && timeUntilChaos > 0 && !gameOver && (
//             <Timer remainingTime={timeUntilChaos} onTimerEnd={handleTimerEnd} />
//           )}
//           <div className="game-board">
//             <Board
//               xIsNext={currentMove % 2 === 0}
//               squares={currentSquares}
//               onPlay={handlePlay}
//               winnerLine={winner ? winner.line : null}
//             />
//           </div>

//           <div className="game-scores">
//             <div className="score-container">
//               <p className="score-label">{username}</p>
//               <div className="score">{scores.X}</div>
//             </div>
//             <div className="score-container">
//               <p className="score-label">AI</p>
//               <div className="score">{scores.O}</div>
//             </div>
//           </div>

//           <button type="button" className="reset-button" onClick={resetGame}>
//             Reset Game
//           </button>

//           <div className="game-info">
//             <div className="status">
//               {winner ? (
//                 <span>{`Winner: ${winner.winner}`}</span>
//               ) : isBoardFull ? (
//                 <span>It's a draw!</span>
//               ) : currentMove === history.length - 1 ? (
//                 <span>Current move</span>
//               ) : (
//                 <span>Move #{currentMove + 1}</span>
//               )}
//             </div>
//             <button
//               className="toggle-history-button"
//               onClick={() => setIsHistoryVisible(!isHistoryVisible)}
//             >
//               {isHistoryVisible ? "▲ Hide Moves" : "▼ Show Moves"}
//             </button>
//             {isHistoryVisible && (
//               <ol className="history-list">
//                 {history.map((squares, move) => (
//                   <li key={move}>
//                     <button
//                       className={`history-button ${
//                         move === currentMove ? "current-move" : ""
//                       }`}
//                       onClick={() => jumpTo(move)}
//                     >
//                       {move === 0 ? "Go to game start" : `Go to move #${move}`}
//                     </button>
//                   </li>
//                 ))}
//               </ol>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { Board } from "../board";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateStats, updateGamesHistory } from "../../redux/user-slice";
import { useNavigate } from "react-router-dom";
import { calculateWinner } from "../../utils";
import { makeAIMove } from "../../utils/ai";
import { saveData, getData } from "../../utils/localStorage";
import { Timer } from "../timer";
import "./index.css";

export function Game({ player }) {
  const dispatch = useDispatch();
  const { username, id } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [currentSquares, setCurrentSquares] = useState(Array(9).fill(null));
  const scores = useRef({ X: 0, O: 0 });
  const [timeUntilChaos, setTimeUntilChaos] = useState(5);
  // const [gameOver, setGameOver] = useState(false);
  const gameOver = useRef(false);
  const [gameStarted, setGameStarted] = useState(false); // Состояние для отслеживания начала игры
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); //Cостояние для хода игрока
  const winnerUpdated = useRef(false);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [botLevel, setBotLevel] = useState("easy");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const winner = calculateWinner(currentSquares);
  const isBoardFull = currentSquares.every(square => square !== null);

  useEffect(() => {
    if (!username) {
      navigate("/auth/signin");
    }
  }, [username, navigate]);

  useEffect(() => {
    const savedScores = getData("scores") || { X: 0, O: 0 };
    scores.current = savedScores;
  }, []);

  useEffect(() => {
    if (gameOver.current) return;

    const chaosTimer = setInterval(() => {
      setTimeUntilChaos(prevTime => {
        if (prevTime <= 1) {
          chaos();
          return 5;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(chaosTimer);
  }, [gameOver.current, currentSquares]);

  const chaos = () => {
    const newSquares = [...currentSquares];
    for (let i = newSquares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newSquares[i], newSquares[j]] = [newSquares[j], newSquares[i]];
    }

    setCurrentSquares(newSquares);
    setHistory(prevHistory => {
      const newHistory = [...prevHistory];
      newHistory[currentMove] = newSquares;
      return newHistory;
    });
    setCurrentMove(prevMove => prevMove);
  };

  function handlePlay(nextSquares, index) {
    // Проверяем, если игра окончена, клетка уже занята, или ход не игрока
    if (gameOver.current || nextSquares[index] || !isPlayerTurn) return;

    const updatedSquares = nextSquares.slice();
    updatedSquares[index] = xIsNext ? "X" : "O"; // Устанавливаем X или O в выбранную клетку

    const nextHistory = [...history.slice(0, currentMove + 1), updatedSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setCurrentSquares(updatedSquares);
    setTimeUntilChaos(5); // Сбрасываем таймер хаоса

    if (!gameStarted) {
      setGameStarted(true);
    }

    setIsPlayerTurn(false); // Передаем ход AI
  }

  function jumpTo(move) {
    setCurrentMove(move);
    setCurrentSquares(history[move]);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setCurrentSquares(Array(9).fill(null));
    gameOver.current = false;
    winnerUpdated.current = false;
    setGameStarted(false);
    setTimeUntilChaos(5);
    setIsPlayerTurn(true); // Сброс хода на игрока
  }

  useEffect(() => {
    if (winner && !winnerUpdated.current) {
      gameOver.current = true;

      // Обновляем счет только один раз за победу
      const newScores = { ...scores };
      newScores[winner.winner] += 1;
      scores.current = newScores;
      winnerUpdated.current = true; // Устанавливаем, что победитель обновлен

      // Обновляем статистику игрока
        dispatch(
          updateStats({ result: winner.winner === "X" ? "wins" : "losses" }),
        );
        dispatch(
          updateGamesHistory({ result: winner.winner === "X" ? "wins" : "losses" })
        );
    } else if (!winner && isBoardFull && !gameOver.current) {
      gameOver.current = true
      dispatch(updateStats({ result: "draws" }));
    }
  }, [winner, winnerUpdated.current, dispatch, isBoardFull, gameOver.current]);

  useEffect(() => {
    if (!gameOver.current && !isPlayerTurn) {
      const timeout = setTimeout(() => {
        const aiMove = makeAIMove(currentSquares, botLevel);

        if (aiMove !== null && currentSquares[aiMove] === null) {
          setCurrentSquares(prevSquares => {
            const updatedSquares = [...prevSquares];
            updatedSquares[aiMove] = "O";
            setHistory(prevHistory => [...prevHistory, updatedSquares]);
            setCurrentMove(prevMove => prevMove + 1);
            return updatedSquares;
          });
          setIsPlayerTurn(true); // Передаем ход игроку
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [currentSquares, isPlayerTurn, gameOver.current, botLevel]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelect = level => {
    setBotLevel(level);
    setIsDropdownOpen(false);
  };

  // Функция обработчик для завершения таймера
  const handleTimerEnd = () => {
    if (!gameOver.current) {
      chaos();
    }
  };

  return (
    <div className="game">
      <div className="game-container">
        <div className="game-sidebar">
          <div className="game-selector">
            <label className="game-mode">Select game mode:</label>
            <div
              className={`custom-dropdown ${isDropdownOpen ? "open" : ""}`}
              onClick={toggleDropdown}
            >
              <button className="custom-dropdown-button">{botLevel}</button>
              <ul className="custom-dropdown-list">
                <li onClick={() => handleSelect("easy")}>Easy</li>
                <li onClick={() => handleSelect("medium")}>Medium</li>
                <li onClick={() => handleSelect("hard")}>Hard</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="game-main">
          {gameStarted && timeUntilChaos > 0 && !gameOver.current && (
            <Timer remainingTime={timeUntilChaos} onTimerEnd={handleTimerEnd} />
          )}
          <div className="game-board">
            <Board
              xIsNext={currentMove % 2 === 0}
              squares={currentSquares}
              onPlay={handlePlay}
              winnerLine={winner ? winner.line : null}
            />
          </div>

          <div className="game-scores">
            <div className="score-container">
              <p className="score-label">{username}</p>
              {/* <div className="score">{scores.current.X}</div> */}
               <div className="score">{0}</div>
            </div>
            <div className="score-container">
              <p className="score-label">AI</p>
              {/* <div className="score">{scores.current.O}</div> */}
                   <div className="score">{0}</div>
            </div>
          </div>

          <button type="button" className="reset-button" onClick={resetGame}>
            Reset Game
          </button>

          <div className="game-info">
            <div className="status">
              {winner ? (
                <span>{`Winner: ${winner.winner}`}</span>
              ) : isBoardFull ? (
                <span>It's a draw!</span>
              ) : currentMove === history.length - 1 ? (
                <span>Current move</span>
              ) : (
                <span>Move #{currentMove + 1}</span>
              )}
            </div>
            <button
              className="toggle-history-button"
              onClick={() => setIsHistoryVisible(!isHistoryVisible)}
            >
              {isHistoryVisible ? "▲ Hide Moves" : "▼ Show Moves"}
            </button>
            {isHistoryVisible && (
              <ol className="history-list">
                {history.map((squares, move) => (
                  <li key={move}>
                    <button
                      className={`history-button ${
                        move === currentMove ? "current-move" : ""
                      }`}
                      onClick={() => jumpTo(move)}
                    >
                      {move === 0 ? "Go to game start" : `Go to move #${move}`}
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
