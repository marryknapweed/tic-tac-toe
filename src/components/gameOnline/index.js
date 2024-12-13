import React, { useState, useEffect, useRef } from "react";
import { Board } from "../board";
import { useDispatch } from "react-redux";
import { updateStats, updateGamesHistory } from "../../redux/user-slice";
import { useNavigate } from "react-router-dom";
import { calculateWinner } from "../../utils";
import { saveData, getData } from "../../utils/localStorage";
import { roomActions, trackUsersActions } from "../../utils/firestore";
import { Timer } from "../timer";
import { useLocation } from "react-router-dom";
import "./index.css";

export function GameOnline({ player }) {
  const dispatch = useDispatch();
  const [sessionData, setSessionData] = useState({})
  const location = useLocation();
  const navigate = useNavigate()
  const roomId = location.pathname.split("/")[3]
  const [currentMove, setCurrentMove] = useState(0);
  const [currentSquares, setCurrentSquares] = useState(Array(9).fill(null));
  // const scores = useRef({ X: 0, O: 0 });
  const [scores, setScores] = useState({X: 0, O: 0})
  const [timeUntilChaos, setTimeUntilChaos] = useState(5);
  // const [gameOver, setGameOver] = useState(false);
  const gameOver = useRef(false);
  const [gameStarted, setGameStarted] = useState(false); // Состояние для отслеживания начала игры
  const [isPlayerTurn, setIsPlayerTurn] = useState("p1")
  const [playerSide, setPlayerSide] = useState("")


  const winnerUpdated = useRef(false);
  const xIsNext = currentMove % 2 === 0;
  const winner = calculateWinner(currentSquares);
  const isBoardFull = currentSquares.every(square => square !== null);

  console.log("Whos set", isPlayerTurn, "Player - ", playerSide)

  useEffect(async () => {
    defineSession()
  }, [])



  useEffect(() => {
    if (!sessionData) {
      navigate("/auth/signin");
    }
  }, [sessionData, navigate]);

  const defineSession = async () => {
    const actions = await roomActions();
    const data = await actions.getRoomData(roomId)
    setSessionData(data)
    const players = [{name: data.player1, key: "p1"}, {name: data.player2, key: "p2"}]
    const username = localStorage.getItem("username")
    const currentRight = players.filter((el) => el.name === username)[0]
    setPlayerSide(currentRight.key)
  }

  useEffect(() => {
    const savedScores = getData("scores") || { X: 0, O: 0 };
   setScores(savedScores);
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

  const updateSquares = async (data) => {
    const actions = await roomActions();
    await actions.updateRoomSquares(roomId, data)
    await actions.updatePlayerTurn(roomId, isPlayerTurn)
  }

  const chaos = () => { // edit updated twice
    // const newSquares = [...currentSquares];
    // for (let i = newSquares.length - 1; i > 0; i--) {
    //   const j = Math.floor(Math.random() * (i + 1));
    //   [newSquares[i], newSquares[j]] = [newSquares[j], newSquares[i]];
    // }

    // updateSquares(newSquares);
    // setCurrentMove(prevMove => prevMove);
  };


  // const updateSquaresDB = async () => {
  //   const actions = await roomActions();
  //   await actions.updateRoomSquares(roomId, currentSquares)
  // }


  async function handlePlay(nextSquares, index) {
    // Check if the game is over, the square is already occupied, or it's not the player's turn
    if (gameOver.current || nextSquares[index] || (isPlayerTurn !== playerSide)) return;

    const updatedSquares = nextSquares.slice();


 
    if (isPlayerTurn == playerSide) {
      // updatedSquares[index] = xIsNext ? "X" : "O"; // Set X or O in the selected square

    // Update the squares in the database
    await updateSquares(updatedSquares);

    // Reset chaos timer
    setTimeUntilChaos(5);

    // Update the current move
    setCurrentMove(prevMove => prevMove + 1);

    }
    
}


  const loadSquaresFromDB = async () => {
    const actions = await trackUsersActions()
    await actions.checkForSquares(roomId, setCurrentSquares, true)
    await actions.checkForPlayerTurn(roomId, setIsPlayerTurn, true)
  }
 
  useEffect(async () => {
    loadSquaresFromDB()
  }, [])

  function resetGame() {
    setCurrentMove(0);
    setCurrentSquares(Array(9).fill(null));
    gameOver.current = false;
    winnerUpdated.current = false;
    setGameStarted(false);
    setTimeUntilChaos(5);
    setIsPlayerTurn("p1"); // Сброс хода на игрока
  }

  console.log(scores)

  useEffect(() => {
    if (winner && !winnerUpdated.current) {
      gameOver.current = true;

      // Обновляем счет только один раз за победу
      const newScores = { ...scores };
      newScores[winner.winner] += 1;
      setScores(newScores)
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


  // Функция обработчик для завершения таймера
  const handleTimerEnd = () => {
    if (!gameOver.current) {
      chaos();
    }
  };

  return (
    <div className="game">
      <div className="game-container">
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
  isPlayerTurn={isPlayerTurn} // Pass the current player's turn
  playerSide={playerSide}
  sessionData={sessionData}
/>
          </div>

          <div className="game-scores">
            <div className="score-container">
              <p className="score-label">{sessionData.player1}</p>
              <div className="score">{scores.X}</div>
            </div>
            <div className="score-container">
              <p className="score-label">{sessionData.player2}</p>
              <div className="score">{scores.O}</div>
            </div>
          </div>

          <button type="button" className="reset-button" onClick={resetGame}>
            Reset Game
          </button>

        </div>
      </div>
    </div>
  );
}
