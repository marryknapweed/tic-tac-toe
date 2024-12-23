// import React from "react";
// import { Square } from "../square";
// import { calculateWinner } from "../../utils";
// import "./index.css";

// export function Board({ xIsNext, squares, onPlay, winnerLine }) {
//   const renderSquare = i => {
//     return (
//       <Square
//         value={squares[i]}
//         onSquareClick={() => handleClick(i)}
//         isWinningSquare={winnerLine && winnerLine.includes(i)} // Выделяем победные клетки
//       />
//     );
//   };

//   const handleClick = i => {
//     if (squares[i] || calculateWinner(squares)) return; // Если клетка занята или уже есть победитель
//     const nextSquares = squares.slice();
//     nextSquares[i] = xIsNext ? "X" : "O"; // Ставим крестик или нолик в зависимости от хода
//     onPlay(nextSquares);
//   };

//   return (
//     <div className="board">
//       <div className="board-row">
//         {renderSquare(0)}
//         {renderSquare(1)}
//         {renderSquare(2)}
//       </div>
//       <div className="board-row">
//         {renderSquare(3)}
//         {renderSquare(4)}
//         {renderSquare(5)}
//       </div>
//       <div className="board-row">
//         {renderSquare(6)}
//         {renderSquare(7)}
//         {renderSquare(8)}
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Square } from "../square";
import { calculateWinner } from "../../utils";
import { useLocation } from "react-router-dom";
import "./index.css";

export function Board({ xIsNext, squares, onPlay, winnerLine, isPlayerTurn, playerSide}) {

  const currentLocation = useLocation().pathname

  const renderSquare = (i) => {
    return (
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={winnerLine && winnerLine.includes(i)} // Highlight winning squares
      />
    );
  };


  const handleClick = (i) => {
  // Check if the square is already occupied or if there's a winner
  if (squares[i] || calculateWinner(squares)) return;

  if (currentLocation.split("/").includes("online")) {
    // Check if it's the player's turn
    if (isPlayerTurn === playerSide) {
      const nextSquares = squares.slice();
      nextSquares[i] = playerSide === "p1" ? "X" : "O"; // Place X or O based on the turn
      onPlay(nextSquares); // Call the onPlay function to update the game state
    }

  } else {
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O"; // Ставим крестик или нолик в зависимости от хода
    onPlay(nextSquares);
  };
}

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