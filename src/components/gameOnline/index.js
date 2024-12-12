import React, { useState, useEffect, useRef } from "react";
import { Board } from "../board";
import { useDispatch } from "react-redux";
import { updateStats, updateGamesHistory } from "../../redux/user-slice";
import { useNavigate } from "react-router-dom";
import { calculateWinner } from "../../utils";
import { saveData, getData } from "../../utils/localStorage";
import { roomActions } from "../../utils/firestore";
import { Timer } from "../timer";
import "./index.css";

export function GameOnline({ player }) {
  const dispatch = useDispatch();
  const [sessionData, setSessionData] = useState({})
  const navigate = useNavigate();
  const [currentMove, setCurrentMove] = useState(0);
  const [currentSquares, setCurrentSquares] = useState(Array(9).fill(null));
  // const scores = useRef({ X: 0, O: 0 });
  const [scores, setScores] = useState({X: 0, O: 0})
  const [timeUntilChaos, setTimeUntilChaos] = useState(5);
  // const [gameOver, setGameOver] = useState(false);
  const gameOver = useRef(false);
  const [gameStarted, setGameStarted] = useState(false); // Состояние для отслеживания начала игры
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); //Cостояние для хода игрока
  const winnerUpdated = useRef(false);
  const xIsNext = currentMove % 2 === 0;
  const winner = calculateWinner(currentSquares);
  const isBoardFull = currentSquares.every(square => square !== null);

  console.log(currentSquares)

  useEffect(async () => {
    const actions = await roomActions();
    const data = await actions.getRoomData("qY8pZ")
    console.log(data)
  }, [])

  useEffect(() => {
    if (!sessionData) {
      navigate("/auth/signin");
    }
  }, [sessionData, navigate]);

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

  const chaos = () => {
    const newSquares = [...currentSquares];
    for (let i = newSquares.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newSquares[i], newSquares[j]] = [newSquares[j], newSquares[i]];
    }

    setCurrentSquares(newSquares);
    setCurrentMove(prevMove => prevMove);
  };

  function handlePlay(nextSquares, index) {
    // Проверяем, если игра окончена, клетка уже занята, или ход не игрока
    if (gameOver.current || nextSquares[index] || !isPlayerTurn) return;

    const updatedSquares = nextSquares.slice();
    updatedSquares[index] = xIsNext ? "X" : "O"; // Устанавливаем X или O в выбранную клетку

    setCurrentSquares(updatedSquares);
    setTimeUntilChaos(5); // Сбрасываем таймер хаоса

    if (!gameStarted) {
      setGameStarted(true);
    }

    setIsPlayerTurn(false); // Передаем ход AI
  }

  function resetGame() {
    setCurrentMove(0);
    setCurrentSquares(Array(9).fill(null));
    gameOver.current = false;
    winnerUpdated.current = false;
    setGameStarted(false);
    setTimeUntilChaos(5);
    setIsPlayerTurn(true); // Сброс хода на игрока
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
            />
          </div>

          <div className="game-scores">
            <div className="score-container">
              <p className="score-label">{'123'}</p>
              <div className="score">{scores.X}</div>
            </div>
            <div className="score-container">
              <p className="score-label">AI</p>
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
