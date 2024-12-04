import React from "react";
import { Square } from "../square";
import { calculateWinner } from "../../utils";
import "./index.css";

export function Board({ xIsNext, squares, onPlay, winnerLine }) {
  const renderSquare = i => {
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={winnerLine && winnerLine.includes(i)} // Выделяем победные клетки
      />
    );
  };

  const handleClick = i => {
    if (squares[i] || calculateWinner(squares)) return; // Если клетка занята или уже есть победитель
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O"; // Ставим крестик или нолик в зависимости от хода
    onPlay(nextSquares);
  };

  return (
    <div className="board">
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}
